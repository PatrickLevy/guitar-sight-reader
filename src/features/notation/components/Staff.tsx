import { useRef } from 'react';
import { useVexFlow } from '../hooks/useVexFlow';
import type { MusicalNote, KeySignature, TimeSignature } from '../../../shared/types';

interface StaffProps {
  notes: MusicalNote[];
  keySignature?: KeySignature;
  timeSignature?: TimeSignature;
  width?: number;
  height?: number;
  currentNoteIndex?: number;
  correctNotes?: Set<number>;
  incorrectNotes?: Set<number>;
  attemptingNotes?: Set<number>;
}

export function Staff({
  notes,
  keySignature,
  timeSignature,
  width = 600,
  height = 150,
  currentNoteIndex,
  correctNotes,
  incorrectNotes,
  attemptingNotes,
}: StaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useVexFlow(containerRef, notes, {
    width,
    height,
    clef: 'treble',
    keySignature,
    timeSignature,
    currentNoteIndex,
    correctNotes,
    incorrectNotes,
    attemptingNotes,
  });

  return (
    <div className="relative">
      <div ref={containerRef} className="bg-white rounded-lg shadow-md p-4" />
      {currentNoteIndex !== undefined && currentNoteIndex >= 0 && (
        <div className="text-center text-sm text-gray-600 mt-2">
          Note {currentNoteIndex + 1} of {notes.length}
        </div>
      )}
    </div>
  );
}
