interface PitchIndicatorProps {
  detectedNote: string | null;
  targetNote?: string;
  isCorrect?: boolean;
  frequency?: number | null;
}

export function PitchIndicator({
  detectedNote,
  targetNote,
  isCorrect,
  frequency,
}: PitchIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md">
      <div className="text-sm text-gray-500 uppercase tracking-wide">
        Detected Note
      </div>

      <div
        className={`text-6xl font-bold transition-colors ${
          detectedNote
            ? isCorrect
              ? 'text-green-500'
              : isCorrect === false
              ? 'text-red-500'
              : 'text-blue-500'
            : 'text-gray-300'
        }`}
      >
        {detectedNote || '--'}
      </div>

      {frequency && (
        <div className="text-sm text-gray-400">
          {frequency.toFixed(1)} Hz
        </div>
      )}

      {targetNote && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-500">Target:</span>
          <span className="text-lg font-semibold text-gray-700">{targetNote}</span>
        </div>
      )}

      {isCorrect !== undefined && detectedNote && (
        <div
          className={`text-sm font-medium ${
            isCorrect ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isCorrect ? 'Correct!' : 'Try again'}
        </div>
      )}
    </div>
  );
}
