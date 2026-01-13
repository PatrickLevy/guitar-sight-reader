import { useState, useCallback, useRef } from 'react';

type PermissionState = 'prompt' | 'granted' | 'denied';

interface UseMicrophoneReturn {
  stream: MediaStream | null;
  error: string | null;
  permission: PermissionState;
  isListening: boolean;
  requestPermission: () => Promise<MediaStream | null>;
  stopMicrophone: () => void;
}

export function useMicrophone(): UseMicrophoneReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<PermissionState>('prompt');
  const [isListening, setIsListening] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const requestPermission = useCallback(async (): Promise<MediaStream | null> => {
    try {
      setError(null);

      // Request microphone with settings optimized for musical instruments
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false, // We want raw audio
          noiseSuppression: false, // Preserve musical detail
          autoGainControl: false, // Consistent volume
        },
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setPermission('granted');
      setIsListening(true);

      return mediaStream;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Microphone access denied';
      setError(errorMessage);
      setPermission('denied');
      setIsListening(false);
      return null;
    }
  }, []);

  const stopMicrophone = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    setIsListening(false);
  }, []);

  return {
    stream,
    error,
    permission,
    isListening,
    requestPermission,
    stopMicrophone,
  };
}
