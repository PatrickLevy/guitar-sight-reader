import { useState, useEffect, useRef, useCallback } from 'react';
import { YIN } from 'pitchfinder';

// Guitar frequency range
const MIN_FREQUENCY = 75; // Below low E (82.41 Hz)
const MAX_FREQUENCY = 1400; // Above high E at 12th fret

interface PitchDetectionConfig {
  sampleRate?: number;
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
    sampleRate = 44100,
    bufferSize = 2048,
    threshold = 0.15,
  } = config;

  const [pitch, setPitch] = useState<number | null>(null);
  const [noteName, setNoteName] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const detectPitchRef = useRef<ReturnType<typeof YIN> | null>(null);

  // Initialize pitch detector
  useEffect(() => {
    detectPitchRef.current = YIN({ sampleRate, threshold });
  }, [sampleRate, threshold]);

  const processAudio = useCallback(() => {
    if (!analyzerRef.current || !detectPitchRef.current) return;

    const dataArray = new Float32Array(bufferSize);
    analyzerRef.current.getFloatTimeDomainData(dataArray);

    // Detect pitch
    const frequency = detectPitchRef.current(dataArray);

    if (frequency && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY) {
      setPitch(frequency);
      const noteInfo = frequencyToNote(frequency);
      setNoteName(`${noteInfo.name}${noteInfo.octave}`);
    } else {
      setPitch(null);
      setNoteName(null);
    }

    // Continue processing
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(processAudio);
    }
  }, [bufferSize, isActive]);

  const start = useCallback((stream: MediaStream) => {
    // Create audio context
    const audioContext = new AudioContext({ sampleRate });
    audioContextRef.current = audioContext;

    // Create analyzer node
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = bufferSize;
    analyzerRef.current = analyzer;

    // Connect stream to analyzer
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyzer);
    sourceRef.current = source;

    setIsActive(true);
  }, [bufferSize, sampleRate]);

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
