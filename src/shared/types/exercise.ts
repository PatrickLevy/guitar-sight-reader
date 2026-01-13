import type { Measure, TimeSignature, KeySignature } from './music';
import type { PositionConstraint, GuitarTuning } from './guitar';
import { STANDARD_TUNING, POSITIONS } from './guitar';

// Difficulty levels
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Exercise categories
export type ExerciseCategory =
  | 'single-notes'
  | 'scales'
  | 'intervals'
  | 'melodies';

// An exercise
export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;

  // Musical content
  timeSignature: TimeSignature;
  keySignature: KeySignature;
  tempo: number; // BPM
  measures: Measure[];

  // Guitar-specific
  positionConstraint: PositionConstraint;
  tuning: GuitarTuning;
}

// Exercise attempt for tracking progress
export interface ExerciseAttempt {
  exerciseId: string;
  timestamp: number;
  duration: number; // seconds
  notesAttempted: number;
  notesCorrect: number;
  accuracy: number; // 0-100
}

// User progress
export interface UserProgress {
  exerciseHistory: ExerciseAttempt[];
  totalPracticeTime: number; // minutes
}

// Default exercise settings
export const DEFAULT_EXERCISE_SETTINGS = {
  timeSignature: { numerator: 4, denominator: 4 } as TimeSignature,
  keySignature: { root: 'C' as const, mode: 'major' as const, sharps: 0, flats: 0 } as KeySignature,
  tempo: 60,
  positionConstraint: POSITIONS[0], // Open Position
  tuning: STANDARD_TUNING,
};
