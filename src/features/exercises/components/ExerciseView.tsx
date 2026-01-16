import { useEffect, useCallback, useState, useRef } from 'react';
import type { Exercise, Pitch } from '../../../shared/types';
import { Staff } from '../../notation';
import { PitchIndicator, MicrophoneButton, AudioDeviceSelector, useMicrophone, usePitchDetection, isPitchCorrect } from '../../pitch-detection';
import { useExercise } from '../hooks/useExercise';

interface ExerciseViewProps {
  exercise: Exercise;
  onComplete: (correctCount: number, totalNotes: number) => void;
  onBack: () => void;
}

export function ExerciseView({ exercise, onComplete, onBack }: ExerciseViewProps) {
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

  const {
    stream,
    permission,
    isListening,
    devices,
    selectedDeviceId,
    currentDeviceLabel,
    setSelectedDeviceId,
    requestPermission,
    stopMicrophone,
    error,
  } = useMicrophone();
  const { pitch, noteName, start, stop } = usePitchDetection();

  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [correctNotes, setCorrectNotes] = useState<Set<number>>(new Set());
  const [incorrectNotes, setIncorrectNotes] = useState<Set<number>>(new Set());
  const [waitingForNewNote, setWaitingForNewNote] = useState(false);
  const correctTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStreamRef = useRef<MediaStream | null>(null);

  // Start/restart pitch detection when stream changes
  useEffect(() => {
    if (stream && stream !== prevStreamRef.current) {
      // Stop previous detection if any
      stop();
      // Start with new stream
      start(stream);
      prevStreamRef.current = stream;
    }
  }, [stream, start, stop]);

  // When pitch goes silent, we're ready to detect a new note
  useEffect(() => {
    if (pitch === null && waitingForNewNote) {
      setWaitingForNewNote(false);
    }
  }, [pitch, waitingForNewNote]);

  // Check if the detected pitch matches the current note
  useEffect(() => {
    // Don't check if waiting for silence between notes
    if (!pitch || !currentNote || currentNote.pitch === 'rest' || hasAnswered || waitingForNewNote) {
      return;
    }

    const targetPitch = currentNote.pitch as Pitch;
    const correct = isPitchCorrect(pitch, targetPitch.frequency, 50);

    if (!hasAnswered) {
      if (correct) {
        setIsCorrect(true);
        setHasAnswered(true);
        checkNote(pitch);

        // Mark this note as correct
        setCorrectNotes(prev => new Set(prev).add(currentNoteIndex));

        // Auto-advance after a short delay
        correctTimeoutRef.current = setTimeout(() => {
          nextNote();
          setIsCorrect(undefined);
          setHasAnswered(false);
          setWaitingForNewNote(true);
        }, 800);
      } else {
        // Wrong note detected - mark as incorrect and move on
        setIsCorrect(false);
        setHasAnswered(true);

        // Mark this note as incorrect
        setIncorrectNotes(prev => new Set(prev).add(currentNoteIndex));

        // Auto-advance after a short delay
        correctTimeoutRef.current = setTimeout(() => {
          nextNote();
          setIsCorrect(undefined);
          setHasAnswered(false);
          setWaitingForNewNote(true);
        }, 800);
      }
    }
  }, [pitch, currentNote, currentNoteIndex, hasAnswered, waitingForNewNote, checkNote, nextNote]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (correctTimeoutRef.current) {
        clearTimeout(correctTimeoutRef.current);
      }
    };
  }, []);

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      stop();
      stopMicrophone();
      onComplete(correctCount, totalNotes);
    }
  }, [isComplete, correctCount, totalNotes, onComplete, stop, stopMicrophone]);

  const handleMicrophoneToggle = useCallback(async () => {
    if (isListening) {
      stop();
      stopMicrophone();
    } else {
      await requestPermission();
    }
  }, [isListening, stop, stopMicrophone, requestPermission]);

  const handleSkip = useCallback(() => {
    nextNote();
    setIsCorrect(undefined);
    setHasAnswered(false);
  }, [nextNote]);

  const handleReset = useCallback(() => {
    reset();
    setIsCorrect(undefined);
    setHasAnswered(false);
    setCorrectNotes(new Set());
    setIncorrectNotes(new Set());
    setWaitingForNewNote(false);
  }, [reset]);

  // Get target note name for display
  const targetNoteName = currentNote && currentNote.pitch !== 'rest'
    ? `${(currentNote.pitch as Pitch).name}${(currentNote.pitch as Pitch).octave}`
    : undefined;

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
          <div className="w-20" /> {/* Spacer for alignment */}
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
            width={Math.min(800, window.innerWidth - 64)}
            height={180}
          />
        </div>

        {/* Pitch detection */}
        <div className="flex flex-col items-center gap-6 mb-6">
          <PitchIndicator
            detectedNote={noteName}
            targetNote={targetNoteName}
            isCorrect={isCorrect}
            frequency={pitch}
          />

          {/* Audio device selector */}
          <AudioDeviceSelector
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            onDeviceChange={setSelectedDeviceId}
            disabled={false}
          />
          {isListening && currentDeviceLabel && (
            <p className="text-sm text-gray-600">
              Using: <span className="font-medium">{currentDeviceLabel}</span>
            </p>
          )}

          <MicrophoneButton
            isListening={isListening}
            permission={permission}
            onToggle={handleMicrophoneToggle}
            error={error}
          />
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
