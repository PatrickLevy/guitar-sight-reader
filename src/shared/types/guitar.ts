import type { Pitch } from './music';
import { createPitch } from './music';

// Guitar string numbers (1 = high E, 6 = low E)
export type GuitarString = 1 | 2 | 3 | 4 | 5 | 6;

// Fretboard position
export interface FretPosition {
  string: GuitarString;
  fret: number; // 0 = open, 1-24 typical
}

// Guitar tuning
export interface GuitarTuning {
  name: string;
  strings: [Pitch, Pitch, Pitch, Pitch, Pitch, Pitch]; // Strings 1-6
}

// Standard EADGBE tuning (from string 1 to 6)
export const STANDARD_TUNING: GuitarTuning = {
  name: 'Standard',
  strings: [
    createPitch('E', 'natural', 4), // String 1 - High E
    createPitch('B', 'natural', 3), // String 2
    createPitch('G', 'natural', 3), // String 3
    createPitch('D', 'natural', 3), // String 4
    createPitch('A', 'natural', 2), // String 5
    createPitch('E', 'natural', 2), // String 6 - Low E
  ],
};

// Position constraint for exercises
export interface PositionConstraint {
  name: string;
  minFret: number;
  maxFret: number;
}

// Common guitar positions
export const POSITIONS: PositionConstraint[] = [
  { name: 'Open Position', minFret: 0, maxFret: 4 },
  { name: 'First Position', minFret: 1, maxFret: 4 },
  { name: 'Second Position', minFret: 2, maxFret: 5 },
  { name: 'Fifth Position', minFret: 5, maxFret: 8 },
  { name: 'Seventh Position', minFret: 7, maxFret: 10 },
  { name: 'Ninth Position', minFret: 9, maxFret: 12 },
];

// Get all fretboard positions where a pitch can be played
export function getAllPositionsForPitch(
  pitch: Pitch,
  tuning: GuitarTuning = STANDARD_TUNING
): FretPosition[] {
  const positions: FretPosition[] = [];
  const targetMidi = pitch.midiNumber;

  tuning.strings.forEach((openString, index) => {
    const fret = targetMidi - openString.midiNumber;
    if (fret >= 0 && fret <= 24) {
      positions.push({
        string: (index + 1) as GuitarString,
        fret,
      });
    }
  });

  return positions;
}

// Get positions within a constraint
export function getPositionsInConstraint(
  pitch: Pitch,
  constraint: PositionConstraint,
  tuning: GuitarTuning = STANDARD_TUNING
): FretPosition[] {
  return getAllPositionsForPitch(pitch, tuning).filter(
    (pos) => pos.fret >= constraint.minFret && pos.fret <= constraint.maxFret
  );
}
