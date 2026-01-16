import { useState, useEffect, useRef, useCallback } from 'react';
import { YIN, AMDF } from 'pitchfinder';

// Guitar frequency range
const MIN_FREQUENCY = 60; // Well below low E (82.41 Hz) to catch it reliably
const MAX_FREQUENCY = 1400; // Above high E at 12th fret

interface PitchDetectionConfig {
  bufferSize?: number;
  threshold?: number;
}

interface UsePitchDetectionReturn {
  pitch: number | null;
  noteName: string | null;
  isActive: boolean;
  start: (stream: MediaStream) => void;
  stop: () => void;
}

// Convert frequency to note name and octave
function frequencyToNote(frequency: number): { name: string; octave: number; cents: number } {
  // A4 = 440 Hz = MIDI 69
  const midiNumber = 12 * Math.log2(frequency / 440) + 69;
  const roundedMidi = Math.round(midiNumber);
  const cents = Math.round((midiNumber - roundedMidi) * 100);

  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteName = noteNames[roundedMidi % 12];
  const octave = Math.floor(roundedMidi / 12) - 1;

  return { name: noteName, octave, cents };
}

export function usePitchDetection(config: PitchDetectionConfig = {}): UsePitchDetectionReturn {
  const {
    // Large buffer for reliable low frequency detection
    // 8192 samples at 44100Hz = ~186ms, enough for ~15 cycles of low E (82Hz)
    bufferSize = 8192,
    // Very low threshold for maximum sensitivity
    threshold = 0.05,
  } = config;

  const [pitch, setPitch] = useState<number | null>(null);
  const [noteName, setNoteName] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const yinDetectorRef = useRef<ReturnType<typeof YIN> | null>(null);
  const amdfDetectorRef = useRef<ReturnType<typeof AMDF> | null>(null);

  const processAudio = useCallback(() => {
    if (!analyzerRef.current || !yinDetectorRef.current || !amdfDetectorRef.current) return;

    const dataArray = new Float32Array(bufferSize);
    analyzerRef.current.getFloatTimeDomainData(dataArray);

    // Check if we have enough signal (RMS level)
    let sumSquares = 0;
    let maxAbs = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sumSquares += dataArray[i] * dataArray[i];
      maxAbs = Math.max(maxAbs, Math.abs(dataArray[i]));
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);

    // Very low threshold - audio interfaces have clean signals
    if (rms > 0.001 || maxAbs > 0.01) {
      // Try YIN first (usually more accurate for higher frequencies)
      let frequency = yinDetectorRef.current(dataArray);

      // If YIN fails or gives suspicious result, try AMDF (better for low frequencies)
      if (!frequency || frequency < MIN_FREQUENCY || frequency > MAX_FREQUENCY) {
        frequency = amdfDetectorRef.current(dataArray);
      }

      if (frequency && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY) {
        setPitch(frequency);
        const noteInfo = frequencyToNote(frequency);
        setNoteName(`${noteInfo.name}${noteInfo.octave}`);
      } else {
        setPitch(null);
        setNoteName(null);
      }
    } else {
      // Signal too weak, consider it silence
      setPitch(null);
      setNoteName(null);
    }

    // Continue processing
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(processAudio);
    }
  }, [bufferSize, isActive]);

  const start = useCallback(async (stream: MediaStream) => {
    // Create audio context - let browser choose optimal sample rate for the device
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    // Resume the context in case it was created in a suspended state
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const sampleRate = audioContext.sampleRate;

    // Initialize both YIN and AMDF detectors
    // YIN is generally more accurate, AMDF is better for low frequencies
    yinDetectorRef.current = YIN({
      sampleRate,
      threshold, // Lower = more sensitive
    });

    amdfDetectorRef.current = AMDF({
      sampleRate,
      minFrequency: MIN_FREQUENCY,
      maxFrequency: MAX_FREQUENCY,
    });

    // Create analyzer node with larger FFT for better frequency resolution
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 16384; // Maximum FFT size for best low-freq resolution
    analyzer.smoothingTimeConstant = 0; // No smoothing for more responsive detection
    analyzerRef.current = analyzer;

    // Connect stream to analyzer
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyzer);
    sourceRef.current = source;

    setIsActive(true);
  }, [threshold]);

  // Start processing when active
  useEffect(() => {
    if (isActive && analyzerRef.current) {
      animationFrameRef.current = requestAnimationFrame(processAudio);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, processAudio]);

  const stop = useCallback(() => {
    setIsActive(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyzerRef.current = null;
    yinDetectorRef.current = null;
    amdfDetectorRef.current = null;
    setPitch(null);
    setNoteName(null);
  }, []);

  return {
    pitch,
    noteName,
    isActive,
    start,
    stop,
  };
}

// Helper to compare detected pitch with target pitch
export function isPitchCorrect(
  detectedFrequency: number,
  targetFrequency: number,
  toleranceCents: number = 50
): boolean {
  const cents = 1200 * Math.log2(detectedFrequency / targetFrequency);
  return Math.abs(cents) <= toleranceCents;
}
