import type { Exercise } from '../../../shared/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: () => void;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

const categoryIcons: Record<string, string> = {
  'single-notes': 'N',
  scales: 'S',
  intervals: 'I',
  melodies: 'M',
};

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  const noteCount = exercise.measures.reduce(
    (count, measure) => count + measure.notes.length,
    0
  );

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-100"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{exercise.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            difficultyColors[exercise.difficulty]
          }`}
        >
          {exercise.difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center font-mono">
            {categoryIcons[exercise.category] || '?'}
          </span>
          {exercise.category}
        </span>
        <span>{noteCount} notes</span>
        <span>{exercise.tempo} BPM</span>
      </div>
    </button>
  );
}
