import type { Exercise, MusicalNote } from '../../../shared/types';
import { createPitch, STANDARD_TUNING, POSITIONS } from '../../../shared/types';

// Helper to create a simple note
function note(
  name: 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B',
  octave: 2 | 3 | 4 | 5 | 6,
  duration: 'whole' | 'half' | 'quarter' = 'quarter',
  accidental: 'natural' | 'sharp' | 'flat' = 'natural'
): MusicalNote {
  return {
    id: `${name}${accidental !== 'natural' ? accidental : ''}${octave}-${Math.random().toString(36).slice(2, 7)}`,
    pitch: createPitch(name, accidental, octave),
    duration: { value: duration, dots: 0 },
  };
}

// Sample exercises for beginners
export const EXERCISES: Exercise[] = [
  // Exercise 1: Open String Notes
  {
    id: 'open-strings',
    title: 'Open Strings',
    description: 'Practice identifying the six open string notes: E, A, D, G, B, E',
    category: 'single-notes',
    difficulty: 'beginner',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'C', mode: 'major', sharps: 0, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('E', 4, 'quarter'), // High E string
          note('B', 3, 'quarter'),
          note('G', 3, 'quarter'),
          note('D', 3, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('A', 2, 'quarter'),
          note('E', 2, 'quarter'),
          note('A', 2, 'quarter'),
          note('D', 3, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[0], // Open Position
    tuning: STANDARD_TUNING,
  },

  // Exercise 2: First Position - E String
  {
    id: 'first-position-e',
    title: 'First Position - E String',
    description: 'Notes on the high E string: E, F, G',
    category: 'single-notes',
    difficulty: 'beginner',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'C', mode: 'major', sharps: 0, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('E', 4, 'quarter'),
          note('F', 4, 'quarter'),
          note('G', 4, 'quarter'),
          note('F', 4, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('E', 4, 'quarter'),
          note('G', 4, 'quarter'),
          note('F', 4, 'quarter'),
          note('E', 4, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[0],
    tuning: STANDARD_TUNING,
  },

  // Exercise 3: First Position - B String
  {
    id: 'first-position-b',
    title: 'First Position - B String',
    description: 'Notes on the B string: B, C, D',
    category: 'single-notes',
    difficulty: 'beginner',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'C', mode: 'major', sharps: 0, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('B', 3, 'quarter'),
          note('C', 4, 'quarter'),
          note('D', 4, 'quarter'),
          note('C', 4, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('B', 3, 'quarter'),
          note('D', 4, 'quarter'),
          note('C', 4, 'quarter'),
          note('B', 3, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[0],
    tuning: STANDARD_TUNING,
  },

  // Exercise 4: First Position - G String
  {
    id: 'first-position-g',
    title: 'First Position - G String',
    description: 'Notes on the G string: G, A',
    category: 'single-notes',
    difficulty: 'beginner',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'C', mode: 'major', sharps: 0, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('G', 3, 'quarter'),
          note('A', 3, 'quarter'),
          note('G', 3, 'quarter'),
          note('A', 3, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('A', 3, 'quarter'),
          note('G', 3, 'quarter'),
          note('A', 3, 'quarter'),
          note('G', 3, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[0],
    tuning: STANDARD_TUNING,
  },

  // Exercise 5: C Major Scale
  {
    id: 'c-major-scale',
    title: 'C Major Scale',
    description: 'Practice the C major scale in first position',
    category: 'scales',
    difficulty: 'beginner',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'C', mode: 'major', sharps: 0, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('C', 3, 'quarter'),
          note('D', 3, 'quarter'),
          note('E', 3, 'quarter'),
          note('F', 3, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('G', 3, 'quarter'),
          note('A', 3, 'quarter'),
          note('B', 3, 'quarter'),
          note('C', 4, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[0],
    tuning: STANDARD_TUNING,
  },

  // Exercise 6: Simple Melody - Mary Had a Little Lamb
  {
    id: 'mary-lamb',
    title: 'Mary Had a Little Lamb',
    description: 'A simple melody using E, D, and C',
    category: 'melodies',
    difficulty: 'beginner',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'C', mode: 'major', sharps: 0, flats: 0 },
    tempo: 80,
    measures: [
      {
        id: 'm1',
        notes: [
          note('E', 4, 'quarter'),
          note('D', 4, 'quarter'),
          note('C', 4, 'quarter'),
          note('D', 4, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('E', 4, 'quarter'),
          note('E', 4, 'quarter'),
          note('E', 4, 'half'),
        ],
      },
    ],
    positionConstraint: POSITIONS[0],
    tuning: STANDARD_TUNING,
  },

  // Exercise 7: G Major - First Three Notes
  {
    id: 'g-major-intro',
    title: 'G Major Introduction',
    description: 'Practice notes in G major with F#',
    category: 'single-notes',
    difficulty: 'beginner',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'G', mode: 'major', sharps: 1, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('G', 3, 'quarter'),
          note('A', 3, 'quarter'),
          note('B', 3, 'quarter'),
          note('A', 3, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('G', 3, 'quarter'),
          note('F', 3, 'quarter', 'sharp'),
          note('G', 3, 'quarter'),
          note('A', 3, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[0],
    tuning: STANDARD_TUNING,
  },

  // Exercise 8: Half Notes Practice
  {
    id: 'half-notes',
    title: 'Half Notes',
    description: 'Practice reading and playing half notes',
    category: 'single-notes',
    difficulty: 'beginner',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'C', mode: 'major', sharps: 0, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('C', 4, 'half'),
          note('E', 4, 'half'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('G', 4, 'half'),
          note('E', 4, 'half'),
        ],
      },
    ],
    positionConstraint: POSITIONS[0],
    tuning: STANDARD_TUNING,
  },

  // Exercise 9: Mixed Rhythm
  {
    id: 'mixed-rhythm',
    title: 'Mixed Rhythm',
    description: 'Practice quarter and half notes together',
    category: 'single-notes',
    difficulty: 'beginner',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'C', mode: 'major', sharps: 0, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('C', 4, 'quarter'),
          note('D', 4, 'quarter'),
          note('E', 4, 'half'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('F', 4, 'half'),
          note('E', 4, 'quarter'),
          note('D', 4, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[0],
    tuning: STANDARD_TUNING,
  },

  // Exercise 10: Low String Practice
  {
    id: 'low-strings',
    title: 'Low Strings',
    description: 'Practice notes on the A and E strings',
    category: 'single-notes',
    difficulty: 'beginner',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'C', mode: 'major', sharps: 0, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('E', 2, 'quarter'),
          note('F', 2, 'quarter'),
          note('G', 2, 'quarter'),
          note('A', 2, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('A', 2, 'quarter'),
          note('B', 2, 'quarter'),
          note('C', 3, 'quarter'),
          note('A', 2, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[0],
    tuning: STANDARD_TUNING,
  },

  // ============================================
  // SECOND POSITION EXERCISES (Frets 2-5)
  // ============================================

  // Exercise 11: Second Position - High E String
  {
    id: 'second-position-e',
    title: 'Second Position - E String',
    description: 'Notes on the high E string in 2nd position: F#, G, G#, A',
    category: 'single-notes',
    difficulty: 'intermediate',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'G', mode: 'major', sharps: 1, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('F', 4, 'quarter', 'sharp'),
          note('G', 4, 'quarter'),
          note('G', 4, 'quarter', 'sharp'),
          note('A', 4, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('A', 4, 'quarter'),
          note('G', 4, 'quarter'),
          note('F', 4, 'quarter', 'sharp'),
          note('G', 4, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[2], // Second Position
    tuning: STANDARD_TUNING,
  },

  // Exercise 12: Second Position - B String
  {
    id: 'second-position-b',
    title: 'Second Position - B String',
    description: 'Notes on the B string in 2nd position: C#, D, D#, E',
    category: 'single-notes',
    difficulty: 'intermediate',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'D', mode: 'major', sharps: 2, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('C', 4, 'quarter', 'sharp'),
          note('D', 4, 'quarter'),
          note('D', 4, 'quarter', 'sharp'),
          note('E', 4, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('E', 4, 'quarter'),
          note('D', 4, 'quarter'),
          note('C', 4, 'quarter', 'sharp'),
          note('D', 4, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[2],
    tuning: STANDARD_TUNING,
  },

  // Exercise 13: Second Position - G String
  {
    id: 'second-position-g',
    title: 'Second Position - G String',
    description: 'Notes on the G string in 2nd position: A, B, C',
    category: 'single-notes',
    difficulty: 'intermediate',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'C', mode: 'major', sharps: 0, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('A', 3, 'quarter'),
          note('B', 3, 'quarter'),
          note('C', 4, 'quarter'),
          note('B', 3, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('A', 3, 'quarter'),
          note('C', 4, 'quarter'),
          note('B', 3, 'quarter'),
          note('A', 3, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[2],
    tuning: STANDARD_TUNING,
  },

  // Exercise 14: Second Position - D String
  {
    id: 'second-position-d',
    title: 'Second Position - D String',
    description: 'Notes on the D string in 2nd position: E, F, F#, G',
    category: 'single-notes',
    difficulty: 'intermediate',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'G', mode: 'major', sharps: 1, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('E', 3, 'quarter'),
          note('F', 3, 'quarter'),
          note('F', 3, 'quarter', 'sharp'),
          note('G', 3, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('G', 3, 'quarter'),
          note('F', 3, 'quarter', 'sharp'),
          note('E', 3, 'quarter'),
          note('F', 3, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[2],
    tuning: STANDARD_TUNING,
  },

  // Exercise 15: A Major Scale - Second Position
  {
    id: 'a-major-scale-2nd',
    title: 'A Major Scale (2nd Position)',
    description: 'Practice the A major scale in second position',
    category: 'scales',
    difficulty: 'intermediate',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'A', mode: 'major', sharps: 3, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('A', 3, 'quarter'),
          note('B', 3, 'quarter'),
          note('C', 4, 'quarter', 'sharp'),
          note('D', 4, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('E', 4, 'quarter'),
          note('F', 4, 'quarter', 'sharp'),
          note('G', 4, 'quarter', 'sharp'),
          note('A', 4, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[2],
    tuning: STANDARD_TUNING,
  },

  // Exercise 16: D Major Scale - Second Position
  {
    id: 'd-major-scale-2nd',
    title: 'D Major Scale (2nd Position)',
    description: 'Practice the D major scale in second position',
    category: 'scales',
    difficulty: 'intermediate',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'D', mode: 'major', sharps: 2, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('D', 3, 'quarter'),
          note('E', 3, 'quarter'),
          note('F', 3, 'quarter', 'sharp'),
          note('G', 3, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('A', 3, 'quarter'),
          note('B', 3, 'quarter'),
          note('C', 4, 'quarter', 'sharp'),
          note('D', 4, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[2],
    tuning: STANDARD_TUNING,
  },

  // Exercise 17: Second Position - Two Strings Combined
  {
    id: 'second-position-e-b',
    title: 'Second Position - E & B Strings',
    description: 'Moving between high E and B strings in 2nd position',
    category: 'single-notes',
    difficulty: 'intermediate',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'D', mode: 'major', sharps: 2, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('F', 4, 'quarter', 'sharp'),
          note('D', 4, 'quarter'),
          note('G', 4, 'quarter'),
          note('E', 4, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('A', 4, 'quarter'),
          note('D', 4, 'quarter'),
          note('F', 4, 'quarter', 'sharp'),
          note('E', 4, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[2],
    tuning: STANDARD_TUNING,
  },

  // Exercise 18: Second Position - Across Three Strings
  {
    id: 'second-position-three-strings',
    title: 'Second Position - Three Strings',
    description: 'Moving across E, B, and G strings in 2nd position',
    category: 'single-notes',
    difficulty: 'intermediate',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'G', mode: 'major', sharps: 1, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('A', 3, 'quarter'),
          note('D', 4, 'quarter'),
          note('G', 4, 'quarter'),
          note('B', 3, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('C', 4, 'quarter'),
          note('E', 4, 'quarter'),
          note('A', 4, 'quarter'),
          note('D', 4, 'quarter'),
        ],
      },
    ],
    positionConstraint: POSITIONS[2],
    tuning: STANDARD_TUNING,
  },

  // Exercise 19: Second Position - Low Strings
  {
    id: 'second-position-low',
    title: 'Second Position - Low Strings',
    description: 'Notes on D, A, and E strings in 2nd position',
    category: 'single-notes',
    difficulty: 'intermediate',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'G', mode: 'major', sharps: 1, flats: 0 },
    tempo: 60,
    measures: [
      {
        id: 'm1',
        notes: [
          note('F', 2, 'quarter', 'sharp'),
          note('G', 2, 'quarter'),
          note('B', 2, 'quarter'),
          note('C', 3, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('D', 3, 'quarter'),
          note('E', 3, 'quarter'),
          note('G', 3, 'quarter'),
          note('F', 3, 'quarter', 'sharp'),
        ],
      },
    ],
    positionConstraint: POSITIONS[2],
    tuning: STANDARD_TUNING,
  },

  // Exercise 20: Second Position Melody
  {
    id: 'second-position-melody',
    title: 'Second Position Melody',
    description: 'A simple melody using notes in 2nd position',
    category: 'melodies',
    difficulty: 'intermediate',
    timeSignature: { numerator: 4, denominator: 4 },
    keySignature: { root: 'D', mode: 'major', sharps: 2, flats: 0 },
    tempo: 72,
    measures: [
      {
        id: 'm1',
        notes: [
          note('D', 4, 'quarter'),
          note('E', 4, 'quarter'),
          note('F', 4, 'quarter', 'sharp'),
          note('D', 4, 'quarter'),
        ],
      },
      {
        id: 'm2',
        notes: [
          note('A', 4, 'half'),
          note('F', 4, 'quarter', 'sharp'),
          note('E', 4, 'quarter'),
        ],
      },
      {
        id: 'm3',
        notes: [
          note('D', 4, 'quarter'),
          note('C', 4, 'quarter', 'sharp'),
          note('B', 3, 'quarter'),
          note('A', 3, 'quarter'),
        ],
      },
      {
        id: 'm4',
        notes: [
          note('D', 4, 'half'),
          note('D', 4, 'half'),
        ],
      },
    ],
    positionConstraint: POSITIONS[2],
    tuning: STANDARD_TUNING,
  },
];

// Get exercise by ID
export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((ex) => ex.id === id);
}

// Get exercises by difficulty
export function getExercisesByDifficulty(difficulty: Exercise['difficulty']): Exercise[] {
  return EXERCISES.filter((ex) => ex.difficulty === difficulty);
}

// Get exercises by category
export function getExercisesByCategory(category: Exercise['category']): Exercise[] {
  return EXERCISES.filter((ex) => ex.category === category);
}
