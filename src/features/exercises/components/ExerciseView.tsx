import { useEffect, useCallback, useState, useRef } from 'react';
import type { Exercise, Pitch } from '../../../shared/types';
import { Staff } from '../../notation';
import { PitchIndicator, usePitchDetection, isPitchCorrect } from '../../pitch-detection';
import { useExercise } from '../hooks/useExercise';

interface ExerciseViewProps {
  exercise: Exercise;
  onComplete: (correctCount: number, totalNotes: number) => void;
  onBack: () => void;
  stream: MediaStream | null;
  isListening: boolean;
  onToggleListening: () => void;
  maxAttempts: number;
}

export function ExerciseView({
  exercise,
  onComplete,
  onBack,
  stream,
  isListening,
  onToggleListening,
  maxAttempts,
}: ExerciseViewProps) {
  const {
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
  } = useExercise(exercise);

  const { pitch, noteName, start, stop } = usePitchDetection();

  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [correctNotes, setCorrectNotes] = useState<Set<number>>(new Set());
  const [incorrectNotes, setIncorrectNotes] = useState<Set<number>>(new Set());
  const [attemptingNotes, setAttemptingNotes] = useState<Set<number>>(new Set());
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [noteFinalized, setNoteFinalized] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStreamRef = useRef<MediaStream | null>(null);
  const lastCorrectPitchRef = useRef<number | null>(null);

  // Start/restart pitch detection when stream changes
  useEffect(() => {
    if (stream && stream !== prevStreamRef.current) {
      stop();
      start(stream);
      prevStreamRef.current = stream;
    } else if (!stream && prevStreamRef.current) {
      stop();
      prevStreamRef.current = null;
    }
  }, [stream, start, stop]);


  // Check if the detected pitch matches the current note
  useEffect(() => {
    if (!pitch || !currentNote || currentNote.pitch === 'rest' || noteFinalized) {
      return;
    }

    // During cooldown, only accept a significantly different pitch (new note being played)
    if (cooldownActive && lastCorrectPitchRef.current) {
      const pitchRatio = pitch / lastCorrectPitchRef.current;
      // If pitch is within 20% of the last correct pitch, ignore it (same note still ringing)
      if (pitchRatio > 0.8 && pitchRatio < 1.2) {
        return;
      }
      // New pitch detected, end cooldown early
      setCooldownActive(false);
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
        cooldownTimeoutRef.current = null;
      }
    }

    const targetPitch = currentNote.pitch as Pitch;
    const correct = isPitchCorrect(pitch, targetPitch.frequency, 50);

    if (correct) {
      // Clear any pending timeout
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = null;
      }

      setIsCorrect(true);
      setNoteFinalized(true);
      checkNote(pitch);
      lastCorrectPitchRef.current = pitch;

      // Mark as correct (remove from attempting if it was there)
      setAttemptingNotes(prev => {
        const next = new Set(prev);
        next.delete(currentNoteIndex);
        return next;
      });
      setCorrectNotes(prev => new Set(prev).add(currentNoteIndex));

      // Auto-advance after a short delay
      advanceTimeoutRef.current = setTimeout(() => {
        nextNote();
        setIsCorrect(undefined);
        setCurrentAttempts(0);
        setNoteFinalized(false);
        // Start a short cooldown to prevent detecting the same note
        setCooldownActive(true);
        cooldownTimeoutRef.current = setTimeout(() => {
          setCooldownActive(false);
          lastCorrectPitchRef.current = null;
        }, 150);
      }, 800);
    } else {
      // Wrong note detected
      setIsCorrect(false);

      // Mark as attempting (temporary red)
      setAttemptingNotes(prev => new Set(prev).add(currentNoteIndex));

      const newAttempts = currentAttempts + 1;
      setCurrentAttempts(newAttempts);

      // Check if max attempts reached (0 = unlimited)
      if (maxAttempts > 0 && newAttempts >= maxAttempts) {
        // Finalize as incorrect
        setNoteFinalized(true);
        setAttemptingNotes(prev => {
          const next = new Set(prev);
          next.delete(currentNoteIndex);
          return next;
        });
        setIncorrectNotes(prev => new Set(prev).add(currentNoteIndex));

        // Auto-advance after a short delay
        advanceTimeoutRef.current = setTimeout(() => {
          nextNote();
          setIsCorrect(undefined);
          setCurrentAttempts(0);
          setNoteFinalized(false);
          // Start a short cooldown
          setCooldownActive(true);
          cooldownTimeoutRef.current = setTimeout(() => {
            setCooldownActive(false);
          }, 150);
        }, 800);
      } else {
        // Short cooldown before accepting another attempt (prevents rapid-fire wrong detections)
        setCooldownActive(true);
        cooldownTimeoutRef.current = setTimeout(() => {
          setCooldownActive(false);
        }, 200);
      }
    }
  }, [pitch, currentNote, currentNoteIndex, cooldownActive, noteFinalized, currentAttempts, maxAttempts, checkNote, nextNote]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
    };
  }, []);

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      stop();
      onComplete(correctCount, totalNotes);
    }
  }, [isComplete, correctCount, totalNotes, onComplete, stop]);

  const handleSkip = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = null;
    }
    // Mark as incorrect when skipping
    setAttemptingNotes(prev => {
      const next = new Set(prev);
      next.delete(currentNoteIndex);
      return next;
    });
    setIncorrectNotes(prev => new Set(prev).add(currentNoteIndex));
    nextNote();
    setIsCorrect(undefined);
    setCurrentAttempts(0);
    setNoteFinalized(false);
    setCooldownActive(false);
    lastCorrectPitchRef.current = null;
  }, [nextNote, currentNoteIndex]);

  const handleReset = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = null;
    }
    reset();
    setIsCorrect(undefined);
    setCorrectNotes(new Set());
    setIncorrectNotes(new Set());
    setAttemptingNotes(new Set());
    setCurrentAttempts(0);
    setNoteFinalized(false);
    setCooldownActive(false);
    lastCorrectPitchRef.current = null;
  }, [reset]);

  // Get target note name for display
  const targetNoteName = currentNote && currentNote.pitch !== 'rest'
    ? `${(currentNote.pitch as Pitch).name}${(currentNote.pitch as Pitch).octave}`
    : undefined;

  // Show attempts remaining
  const attemptsDisplay = maxAttempts > 0
    ? `Attempt ${currentAttempts + 1} of ${maxAttempts}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-800">{exercise.title}</h1>
          <div className="w-20" />
        </div>

        {/* Listening status and toggle */}
        <div className="flex justify-center mb-4">
          <button
            onClick={onToggleListening}
            className={`px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isListening ? (
              <>
                <span className="animate-pulse w-2 h-2 bg-white rounded-full" />
                Listening - Click to Stop
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                Start Listening
              </>
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{currentNoteIndex} / {totalNotes}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Music notation */}
        <div className="mb-6">
          <Staff
            notes={allNotes}
            keySignature={exercise.keySignature}
            timeSignature={exercise.timeSignature}
            currentNoteIndex={currentNoteIndex}
            correctNotes={correctNotes}
            incorrectNotes={incorrectNotes}
            attemptingNotes={attemptingNotes}
            width={Math.min(800, window.innerWidth - 64)}
            height={180}
          />
        </div>

        {/* Pitch detection feedback */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <PitchIndicator
            detectedNote={noteName}
            targetNote={targetNoteName}
            isCorrect={isCorrect}
            frequency={pitch}
          />
          {attemptsDisplay && isListening && !noteFinalized && (
            <p className="text-sm text-gray-500">{attemptsDisplay}</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Skip Note
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Restart
          </button>
        </div>

        {/* Score */}
        <div className="mt-6 text-center text-gray-600">
          Score: {correctCount} / {currentNoteIndex} correct
        </div>
      </div>
    </div>
  );
}
