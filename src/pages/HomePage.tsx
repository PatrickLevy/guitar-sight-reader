import { EXERCISES, ExerciseCard } from '../features/exercises';
import type { Exercise } from '../shared/types';

interface HomePageProps {
  onSelectExercise: (exercise: Exercise) => void;
}

export function HomePage({ onSelectExercise }: HomePageProps) {
  const beginnerExercises = EXERCISES.filter((e) => e.difficulty === 'beginner');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Guitar Sight Reader
          </h1>
          <p className="text-gray-600 mt-1">
            Learn to read music notation for guitar
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-blue-800 mb-2">How it works</h2>
          <ol className="list-decimal list-inside text-blue-700 text-sm space-y-1">
            <li>Select an exercise below</li>
            <li>Enable your microphone when prompted</li>
            <li>Play the notes shown on the staff on your guitar</li>
            <li>The app will detect if you played the correct note</li>
          </ol>
        </div>

        {/* Exercise list */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Beginner Exercises
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {beginnerExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onClick={() => onSelectExercise(exercise)}
              />
            ))}
          </div>
        </section>

        {/* Coming soon */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Coming Soon
          </h2>
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">
            <p>More exercises and difficulty levels</p>
            <p className="text-sm mt-2">
              Including intermediate and advanced exercises, scales, and full melodies
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Guitar Sight Reader - Practice sight reading for guitar</p>
        </div>
      </footer>
    </div>
  );
}
