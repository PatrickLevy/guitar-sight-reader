import { useState, useCallback } from 'react';
import { HomePage } from './pages/HomePage';
import { CompletePage } from './pages/CompletePage';
import { ExerciseView } from './features/exercises';
import { useMicrophone } from './features/pitch-detection';
import type { Exercise } from './shared/types';

type AppState =
  | { screen: 'home' }
  | { screen: 'exercise'; exercise: Exercise }
  | { screen: 'complete'; exercise: Exercise; correctCount: number; totalNotes: number };

function App() {
  const [state, setState] = useState<AppState>({ screen: 'home' });
  const [maxAttempts, setMaxAttempts] = useState<number>(50);

  // Audio state lifted to app level
  const {
    stream,
    isListening,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    requestPermission,
    stopMicrophone,
  } = useMicrophone();

  const handleSelectExercise = useCallback((exercise: Exercise) => {
    setState({ screen: 'exercise', exercise });
  }, []);

  const handleExerciseComplete = useCallback(
    (correctCount: number, totalNotes: number) => {
      if (state.screen === 'exercise') {
        setState({
          screen: 'complete',
          exercise: state.exercise,
          correctCount,
          totalNotes,
        });
      }
    },
    [state]
  );

  const handleGoHome = useCallback(() => {
    setState({ screen: 'home' });
  }, []);

  const handleTryAgain = useCallback(() => {
    if (state.screen === 'complete') {
      setState({ screen: 'exercise', exercise: state.exercise });
    }
  }, [state]);

  const handleBack = useCallback(() => {
    setState({ screen: 'home' });
  }, []);

  switch (state.screen) {
    case 'home':
      return (
        <HomePage
          onSelectExercise={handleSelectExercise}
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          onDeviceChange={setSelectedDeviceId}
          maxAttempts={maxAttempts}
          onMaxAttemptsChange={setMaxAttempts}
        />
      );

    case 'exercise':
      return (
        <ExerciseView
          exercise={state.exercise}
          onComplete={handleExerciseComplete}
          onBack={handleBack}
          stream={stream}
          isListening={isListening}
          onToggleListening={isListening ? stopMicrophone : requestPermission}
          maxAttempts={maxAttempts}
        />
      );

    case 'complete':
      return (
        <CompletePage
          exercise={state.exercise}
          correctCount={state.correctCount}
          totalNotes={state.totalNotes}
          onTryAgain={handleTryAgain}
          onGoHome={handleGoHome}
        />
      );
  }
}

export default App;
