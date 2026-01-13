import { useState, useCallback, useMemo } from 'react';
import type { Exercise, MusicalNote, Pitch } from '../../../shared/types';
import { isPitchCorrect } from '../../pitch-detection';

interface UseExerciseReturn {
  currentNoteIndex: number;
  currentNote: MusicalNote | null;
  allNotes: MusicalNote[];
  isComplete: boolean;
  correctCount: number;
  totalNotes: number;
  checkNote: (detectedFrequency: number) => boolean;
  nextNote: () => void;
  reset: () => void;
  progress: number;
}

export function useExercise(exercise: Exercise | null): UseExerciseReturn {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Flatten all notes from measures
  const allNotes = useMemo(() => {
    if (!exercise) return [];
    return exercise.measures.flatMap((measure) => measure.notes);
  }, [exercise]);

  const totalNotes = allNotes.length;
  const currentNote = allNotes[currentNoteIndex] || null;
  const isComplete = currentNoteIndex >= totalNotes;
  const progress = totalNotes > 0 ? (currentNoteIndex / totalNotes) * 100 : 0;

  const checkNote = useCallback(
    (detectedFrequency: number): boolean => {
      if (!currentNote || currentNote.pitch === 'rest') {
        return false;
      }

      const pitch = currentNote.pitch as Pitch;
      const isCorrect = isPitchCorrect(detectedFrequency, pitch.frequency, 50);

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }

      return isCorrect;
    },
    [currentNote]
  );

  const nextNote = useCallback(() => {
    setCurrentNoteIndex((prev) => Math.min(prev + 1, totalNotes));
  }, [totalNotes]);

  const reset = useCallback(() => {
    setCurrentNoteIndex(0);
    setCorrectCount(0);
  }, []);

  return {
    currentNoteIndex,
    currentNote,
    allNotes,
    isComplete,
    correctCount,
    totalNotes,
    checkNote,
    nextNote,
    reset,
    progress,
  };
}
