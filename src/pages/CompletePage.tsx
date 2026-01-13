import type { Exercise } from '../shared/types';

interface CompletePageProps {
  exercise: Exercise;
  correctCount: number;
  totalNotes: number;
  onTryAgain: () => void;
  onGoHome: () => void;
}

export function CompletePage({
  exercise,
  correctCount,
  totalNotes,
  onTryAgain,
  onGoHome,
}: CompletePageProps) {
  const percentage = Math.round((correctCount / totalNotes) * 100);

  const getMessage = () => {
    if (percentage === 100) return 'Perfect!';
    if (percentage >= 80) return 'Great job!';
    if (percentage >= 60) return 'Good effort!';
    return 'Keep practicing!';
  };

  const getEmoji = () => {
    if (percentage === 100) return '🌟';
    if (percentage >= 80) return '🎸';
    if (percentage >= 60) return '👍';
    return '💪';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">{getEmoji()}</div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {getMessage()}
        </h1>

        <p className="text-gray-600 mb-6">
          You completed "{exercise.title}"
        </p>

        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <div className="text-4xl font-bold text-blue-600">
            {percentage}%
          </div>
          <div className="text-gray-500 text-sm mt-1">
            {correctCount} of {totalNotes} notes correct
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onTryAgain}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onGoHome}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Choose Another Exercise
          </button>
        </div>
      </div>
    </div>
  );
}
