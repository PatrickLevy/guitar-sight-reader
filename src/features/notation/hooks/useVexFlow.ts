import { useEffect, useRef, useCallback } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';
import type { MusicalNote, Pitch, DurationValue, KeySignature, TimeSignature, Accidental as AccidentalType } from '../../../shared/types';

interface UseVexFlowOptions {
  width: number;
  height: number;
  clef?: string;
  keySignature?: KeySignature;
  timeSignature?: TimeSignature;
  currentNoteIndex?: number;
  correctNotes?: Set<number>;
  incorrectNotes?: Set<number>;
  attemptingNotes?: Set<number>;
}

// Map duration to VexFlow duration string
function mapDuration(duration: DurationValue): string {
  const map: Record<DurationValue, string> = {
    whole: 'w',
    half: 'h',
    quarter: 'q',
    eighth: '8',
    sixteenth: '16',
  };
  return map[duration];
}

// Map accidental to VexFlow accidental string
function mapAccidental(accidental: AccidentalType): string {
  const map: Record<AccidentalType, string> = {
    natural: 'n',
    sharp: '#',
    flat: 'b',
  };
  return map[accidental];
}

// Map key signature to VexFlow key string
function mapKeySignature(keySignature: KeySignature): string {
  const { root, mode } = keySignature;

  // VexFlow uses format like 'C', 'G', 'F', 'Am', 'Em' etc.
  if (mode === 'major') {
    return root;
  }
  return `${root}m`;
}

// Map time signature to VexFlow format
function mapTimeSignature(timeSignature: TimeSignature): string {
  return `${timeSignature.numerator}/${timeSignature.denominator}`;
}

export function useVexFlow(
  containerRef: React.RefObject<HTMLDivElement | null>,
  notes: MusicalNote[],
  options: UseVexFlowOptions
) {
  const rendererRef = useRef<Renderer | null>(null);

  const render = useCallback(() => {
    if (!containerRef.current) return;

    // Clear previous render
    containerRef.current.innerHTML = '';

    // Create renderer
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(options.width, options.height);
    rendererRef.current = renderer;

    const context = renderer.getContext();
    context.setFont('Arial', 10);

    // Calculate stave width accounting for clef, key sig, time sig
    // Position stave lower to leave room for ledger lines below (low guitar notes)
    const staveX = 10;
    const staveY = 10;
    const staveWidth = options.width - 20;

    // Create stave
    const stave = new Stave(staveX, staveY, staveWidth);
    stave.addClef(options.clef || 'treble');

    if (options.keySignature) {
      stave.addKeySignature(mapKeySignature(options.keySignature));
    }

    if (options.timeSignature) {
      stave.addTimeSignature(mapTimeSignature(options.timeSignature));
    }

    stave.setContext(context).draw();

    // If no notes, just draw the empty stave
    if (notes.length === 0) return;

    // Create VexFlow notes
    const vexNotes = notes.map((note, index) => {
      if (note.pitch === 'rest') {
        // Handle rests
        return new StaveNote({
          keys: ['b/4'],
          duration: `${mapDuration(note.duration.value)}r`,
        });
      }

      const pitch = note.pitch as Pitch;
      const key = `${pitch.name.toLowerCase()}/${pitch.octave}`;

      const vexNote = new StaveNote({
        keys: [key],
        duration: mapDuration(note.duration.value),
      });

      // Add accidentals (only show if not natural)
      if (pitch.accidental !== 'natural') {
        vexNote.addModifier(new Accidental(mapAccidental(pitch.accidental)));
      }

      // Apply highlighting colors based on note state
      if (options.correctNotes?.has(index)) {
        // Note was played correctly - green
        vexNote.setStyle({ fillStyle: '#22c55e', strokeStyle: '#22c55e' });
      } else if (options.incorrectNotes?.has(index)) {
        // Note was finalized as incorrect - red
        vexNote.setStyle({ fillStyle: '#ef4444', strokeStyle: '#ef4444' });
      } else if (options.attemptingNotes?.has(index)) {
        // Note is being attempted (temporary wrong) - red
        vexNote.setStyle({ fillStyle: '#ef4444', strokeStyle: '#ef4444' });
      }
      // Current target note stays black (default) - highlight added separately

      return vexNote;
    });

    // Create voice - use SOFT mode for more flexibility
    const voice = new Voice({ numBeats: 4, beatValue: 4 }).setMode(Voice.Mode.SOFT);
    voice.addTickables(vexNotes);

    // Format and draw
    new Formatter().joinVoices([voice]).format([voice], staveWidth - 100);
    voice.draw(context, stave);

    // Draw highlight around current note (after notes are rendered so we can get positions)
    if (options.currentNoteIndex !== undefined &&
        options.currentNoteIndex >= 0 &&
        options.currentNoteIndex < vexNotes.length &&
        !options.correctNotes?.has(options.currentNoteIndex) &&
        !options.incorrectNotes?.has(options.currentNoteIndex)) {
      const currentVexNote = vexNotes[options.currentNoteIndex];
      const bbox = currentVexNote.getBoundingBox();

      if (bbox) {
        // Draw a rounded rectangle highlight behind/around the note
        const padding = 6;
        const svgContext = context as unknown as { svg: SVGSVGElement };

        if (svgContext.svg) {
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', String(bbox.getX() - padding));
          rect.setAttribute('y', String(bbox.getY() - padding));
          rect.setAttribute('width', String(bbox.getW() + padding * 2));
          rect.setAttribute('height', String(bbox.getH() + padding * 2));
          rect.setAttribute('rx', '4');
          rect.setAttribute('ry', '4');
          rect.setAttribute('fill', '#fef08a'); // Yellow highlight background
          rect.setAttribute('stroke', '#eab308'); // Yellow border
          rect.setAttribute('stroke-width', '2');

          // Insert at the beginning so it appears behind the notes
          const svg = svgContext.svg;
          svg.insertBefore(rect, svg.firstChild);
        }
      }
    }
  }, [containerRef, notes, options]);

  useEffect(() => {
    render();
  }, [render]);

  return { render };
}
