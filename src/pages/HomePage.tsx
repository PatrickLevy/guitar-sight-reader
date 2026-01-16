import { EXERCISES, ExerciseCard } from '../features/exercises';
import { AudioDeviceSelector } from '../features/pitch-detection';
import type { Exercise } from '../shared/types';
import type { AudioInputDevice } from '../features/pitch-detection';

interface HomePageProps {
  onSelectExercise: (exercise: Exercise) => void;
  devices: AudioInputDevice[];
  selectedDeviceId: string | null;
  onDeviceChange: (deviceId: string | null) => void;
  maxAttempts: number;
  onMaxAttemptsChange: (attempts: number) => void;
}

export function HomePage({
  onSelectExercise,
  devices,
  selectedDeviceId,
  onDeviceChange,
  maxAttempts,
  onMaxAttemptsChange,
}: HomePageProps) {
  const beginnerExercises = EXERCISES.filter((e) => e.difficulty === 'beginner');
  const intermediateExercises = EXERCISES.filter((e) => e.difficulty === 'intermediate');

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
            <li>Select your audio input below</li>
            <li>Select an exercise</li>
            <li>Play the notes shown on the staff on your guitar</li>
            <li>The app will detect if you played the correct note</li>
          </ol>
        </div>

        {/* Audio Setup */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-800 mb-4">Audio Setup</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <AudioDeviceSelector
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                onDeviceChange={onDeviceChange}
                disabled={false}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="max-attempts" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="max-attempts"
                value={maxAttempts}
                onChange={(e) => onMaxAttemptsChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>Don't mark wrong notes</option>
                <option value={100}>Forgiving</option>
                <option value={10}>Strict</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                How forgiving the scoring is
              </p>
            </div>
          </div>
        </div>

        {/* Beginner Exercises */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Beginner Exercises (First Position)
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

        {/* Intermediate Exercises */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Intermediate Exercises (Second Position)
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {intermediateExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onClick={() => onSelectExercise(exercise)}
              />
            ))}
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
