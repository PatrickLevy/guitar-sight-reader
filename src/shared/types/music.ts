// Note names
export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

// Accidentals
export type Accidental = 'natural' | 'sharp' | 'flat';

// Octave range (guitar typically uses 2-6)
export type Octave = 2 | 3 | 4 | 5 | 6;

// Duration values
export type DurationValue = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';

// Pitch representation
export interface Pitch {
  name: NoteName;
  accidental: Accidental;
  octave: Octave;
  midiNumber: number; // 0-127, useful for comparison
  frequency: number; // Hz, for pitch detection matching
}

// Duration representation
export interface Duration {
  value: DurationValue;
  dots: number; // 0, 1, or 2
}

// A musical note
export interface MusicalNote {
  id: string;
  pitch: Pitch | 'rest';
  duration: Duration;
}

// Time signature
export interface TimeSignature {
  numerator: number; // e.g., 4
  denominator: number; // e.g., 4
}

// Key signature
export interface KeySignature {
  root: NoteName;
  mode: 'major' | 'minor';
  sharps: number; // 0-7
  flats: number; // 0-7
}

// A measure/bar of music
export interface Measure {
  id: string;
  notes: MusicalNote[];
}

// Helper function to create a pitch with calculated frequency and MIDI number
export function createPitch(
  name: NoteName,
  accidental: Accidental,
  octave: Octave
): Pitch {
  const noteToSemitone: Record<NoteName, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };

  const accidentalOffset: Record<Accidental, number> = {
    flat: -1,
    natural: 0,
    sharp: 1,
  };

  const semitone = noteToSemitone[name] + accidentalOffset[accidental];
  const midiNumber = (octave + 1) * 12 + semitone;

  // A4 = 440 Hz, MIDI 69
  const frequency = 440 * Math.pow(2, (midiNumber - 69) / 12);

  return {
    name,
    accidental,
    octave,
    midiNumber,
    frequency: Math.round(frequency * 100) / 100,
  };
}
