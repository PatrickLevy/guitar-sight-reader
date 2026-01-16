# Guitar Sight Reader

A web application for learning to sight-read music notation on guitar. The app listens to your guitar through a microphone or audio interface and provides real-time feedback as you play the notes shown on the staff.

## Features

- **Music Notation Display**: Notes are rendered on a standard treble clef staff using VexFlow
- **Real-time Pitch Detection**: Uses the YIN and AMDF algorithms to detect the pitch you're playing
- **Visual Feedback**: Notes are highlighted as you play:
  - Yellow: Current target note
  - Green: Correctly played note
  - Red: Incorrectly played note
- **Multiple Audio Inputs**: Supports microphone or USB audio interfaces (e.g., Fender Mustang Micro Plus)
- **Progressive Exercises**: Organized by difficulty and fretboard position
- **Installable PWA**: Can be installed on mobile or desktop for a full-screen experience

## Exercises

### Beginner (First Position, Frets 0-4)
- Open Strings
- First Position exercises for E, B, G strings
- C Major Scale
- Simple melodies (Mary Had a Little Lamb)
- G Major Introduction
- Half notes and mixed rhythm practice
- Low string exercises

### Intermediate (Second Position, Frets 2-5)
- Second Position exercises for each string
- A Major Scale (2nd Position)
- D Major Scale (2nd Position)
- Multi-string exercises
- Second Position melodies

## Getting Started

### Prerequisites
- Node.js 18+
- A guitar
- A microphone or USB audio interface

### Installation

```bash
# Clone the repository
git clone https://github.com/PatrickLevy/guitar-sight-reader.git
cd guitar-sight-reader

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. Open the app in your browser
2. Select your audio input device (microphone or audio interface) in the Audio Setup section
3. Choose an exercise from the list
4. Click "Start Listening" to begin
5. Play the highlighted note on your guitar
6. The app will detect if you played correctly and advance to the next note

## Tech Stack

- **React 18** + **TypeScript** - UI framework
- **Vite** - Build tool
- **VexFlow** - Music notation rendering
- **pitchfinder** - Pitch detection (YIN and AMDF algorithms)
- **Tailwind CSS** - Styling
- **Web Audio API** - Audio input processing

## Project Structure

```
src/
├── App.tsx                 # Main app component with routing
├── pages/
│   ├── HomePage.tsx        # Exercise selection and audio setup
│   └── CompletePage.tsx    # Exercise completion summary
├── features/
│   ├── exercises/          # Exercise data and components
│   │   ├── components/
│   │   │   ├── ExerciseView.tsx   # Main exercise UI
│   │   │   └── ExerciseCard.tsx   # Exercise list item
│   │   ├── data/
│   │   │   └── exercises.ts       # Exercise definitions
│   │   └── hooks/
│   │       └── useExercise.ts     # Exercise state management
│   ├── notation/           # Music notation rendering
│   │   ├── components/
│   │   │   └── Staff.tsx          # VexFlow staff component
│   │   └── hooks/
│   │       └── useVexFlow.ts      # VexFlow integration
│   └── pitch-detection/    # Audio input and pitch detection
│       ├── components/
│       │   ├── AudioDeviceSelector.tsx
│       │   ├── MicrophoneButton.tsx
│       │   └── PitchIndicator.tsx
│       └── hooks/
│           ├── useMicrophone.ts      # Audio device management
│           └── usePitchDetection.ts  # Pitch detection logic
└── shared/
    └── types/              # TypeScript type definitions
        ├── music.ts        # Musical notation types
        ├── guitar.ts       # Guitar-specific types
        └── exercise.ts     # Exercise types
```

## Pitch Detection

The app uses two complementary algorithms for pitch detection:

- **YIN**: Generally more accurate for higher frequencies
- **AMDF**: Better for low frequencies (bass notes)

The detector automatically falls back to AMDF when YIN fails to detect a pitch, which improves reliability for the lower strings of the guitar.

### Configuration
- Buffer size: 8192 samples (~186ms at 44.1kHz)
- FFT size: 16384 for maximum frequency resolution
- Frequency range: 60Hz - 1400Hz (covers standard guitar range)
- Pitch tolerance: 50 cents (half a semitone)

## Deployment

The app is configured for GitHub Pages deployment:

```bash
# Build for production
npm run build

# Deploy (via GitHub Actions on push to main)
git push origin main
```

## License

MIT
