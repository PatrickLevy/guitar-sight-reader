interface MicrophoneButtonProps {
  isListening: boolean;
  permission: 'prompt' | 'granted' | 'denied';
  onToggle: () => void;
  error?: string | null;
}

export function MicrophoneButton({
  isListening,
  permission,
  onToggle,
  error,
}: MicrophoneButtonProps) {
  const getButtonText = () => {
    if (permission === 'denied') return 'Microphone Denied';
    if (isListening) return 'Stop Listening';
    if (permission === 'granted') return 'Start Listening';
    return 'Enable Microphone';
  };

  const getButtonStyle = () => {
    if (permission === 'denied') {
      return 'bg-red-100 text-red-700 cursor-not-allowed';
    }
    if (isListening) {
      return 'bg-red-500 hover:bg-red-600 text-white';
    }
    return 'bg-blue-500 hover:bg-blue-600 text-white';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onToggle}
        disabled={permission === 'denied'}
        className={`px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 ${getButtonStyle()}`}
      >
        {/* Microphone icon */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isListening ? (
            // Microphone with slash (mute icon)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          ) : (
            // Regular microphone
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          )}
        </svg>
        {getButtonText()}
      </button>

      {error && (
        <p className="text-sm text-red-500 text-center max-w-xs">{error}</p>
      )}

      {isListening && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
          Listening...
        </div>
      )}
    </div>
  );
}
