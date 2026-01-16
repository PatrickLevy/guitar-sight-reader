import { useState, useCallback, useRef, useEffect } from 'react';

const STORAGE_KEY_DEVICE = 'guitar-sight-reader-audio-device';

type PermissionState = 'prompt' | 'granted' | 'denied';

export interface AudioInputDevice {
  deviceId: string;
  label: string;
}

interface UseMicrophoneReturn {
  stream: MediaStream | null;
  error: string | null;
  permission: PermissionState;
  isListening: boolean;
  devices: AudioInputDevice[];
  selectedDeviceId: string | null;
  currentDeviceLabel: string | null;
  setSelectedDeviceId: (deviceId: string | null) => void;
  refreshDevices: () => Promise<AudioInputDevice[]>;
  requestPermission: () => Promise<MediaStream | null>;
  stopMicrophone: () => void;
}

export function useMicrophone(): UseMicrophoneReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<PermissionState>('prompt');
  const [isListening, setIsListening] = useState(false);
  const [devices, setDevices] = useState<AudioInputDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_DEVICE);
  });
  const [currentDeviceLabel, setCurrentDeviceLabel] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Persist selected device to localStorage
  useEffect(() => {
    if (selectedDeviceId) {
      localStorage.setItem(STORAGE_KEY_DEVICE, selectedDeviceId);
    } else {
      localStorage.removeItem(STORAGE_KEY_DEVICE);
    }
  }, [selectedDeviceId]);

  // Enumerate available audio input devices
  const refreshDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices
        .filter((device) => device.kind === 'audioinput')
        // Filter out "default" pseudo-devices which don't work reliably on Linux
        .filter((device) => device.deviceId !== 'default' && !device.deviceId.startsWith('default'))
        .map((device, index) => ({
          deviceId: device.deviceId,
          // Label may be empty if permission not granted yet
          label: device.label || `Audio Input ${index + 1}`,
        }));
      setDevices(audioInputs);
      return audioInputs;
    } catch (err) {
      console.error('Failed to enumerate devices:', err);
      return [];
    }
  }, []);

  // Listen for device changes (plug/unplug)
  useEffect(() => {
    refreshDevices();

    const handleDeviceChange = () => {
      refreshDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [refreshDevices]);

  const startStream = useCallback(async (deviceId: string | null): Promise<MediaStream | null> => {
    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Build audio constraints optimized for musical instruments
    const audioConstraints: MediaTrackConstraints = {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      sampleRate: 44100,
    };

    // If a specific device is selected, use it
    // Skip "default" pseudo-devices as they don't work well with exact constraint
    if (deviceId && deviceId !== 'default' && !deviceId.startsWith('default')) {
      audioConstraints.deviceId = { exact: deviceId };
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: audioConstraints,
    });

    // Get the actual device being used
    const audioTrack = mediaStream.getAudioTracks()[0];
    const settings = audioTrack.getSettings();

    // Find the device label
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const usedDevice = allDevices.find(d => d.deviceId === settings.deviceId);
    setCurrentDeviceLabel(usedDevice?.label || 'Unknown Device');

    streamRef.current = mediaStream;
    setStream(mediaStream);

    return mediaStream;
  }, []);

  const requestPermission = useCallback(async (): Promise<MediaStream | null> => {
    try {
      setError(null);

      const mediaStream = await startStream(selectedDeviceId);

      setPermission('granted');
      setIsListening(true);

      // Refresh devices to get proper labels now that we have permission
      await refreshDevices();

      return mediaStream;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Audio input access denied';
      setError(errorMessage);
      setPermission('denied');
      setIsListening(false);
      return null;
    }
  }, [selectedDeviceId, startStream, refreshDevices]);

  // When device selection changes while listening, restart with new device
  const handleDeviceChange = useCallback(async (deviceId: string | null) => {
    setSelectedDeviceId(deviceId);

    // If currently listening, restart stream with new device
    if (isListening) {
      try {
        setError(null);
        await startStream(deviceId);
        // Refresh devices in case labels changed
        await refreshDevices();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to switch audio device';
        setError(errorMessage);
      }
    }
  }, [isListening, startStream, refreshDevices]);

  const stopMicrophone = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    setIsListening(false);
    setCurrentDeviceLabel(null);
  }, []);

  return {
    stream,
    error,
    permission,
    isListening,
    devices,
    selectedDeviceId,
    currentDeviceLabel,
    setSelectedDeviceId: handleDeviceChange,
    refreshDevices,
    requestPermission,
    stopMicrophone,
  };
}
