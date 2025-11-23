# MixMaster Pro

A professional 4-deck DJ controller web application built with React, TypeScript, and Redux.

![MixMaster Pro](https://github.com/user-attachments/assets/965b2852-0736-4c25-8a48-5fcbc02bebc1)

## Features

### 4-Deck Layout
- **Deck A, B, C, D** - Four independent DJ decks with complete controls
- **Responsive Design**: Desktop row layout, mobile stacked layout

### Per-Deck Features

1. **Waveform Display** - Visual representation of track audio
2. **Playback Controls**:
   - Play/Pause button (▶/⏸)
   - Cue button (set/jump to cue point)
   - Sync button (sync BPM with other decks)
3. **Pitch Control** - Slider with range -100% to +100%
4. **Volume Control** - Fader with 0-100% range
5. **Solo/Mute Buttons** - Smart solo/mute logic
6. **BPM Display** - Shows current BPM with precision
7. **Tap Tempo** - Tap to manually set tempo
8. **Track Information** - Track name and artist with truncation
9. **Focus Indicator** - Green border highlights active deck
10. **Load Track** - Quick load button with sample tracks

## Tech Stack

- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **Vite** for fast development and building
- **CSS** with responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm preview
```

## Project Structure

```
src/
├── components/
│   ├── Deck.tsx          # Main deck component
│   └── Deck.css          # Deck styling
├── store/
│   ├── store.ts          # Redux store configuration
│   ├── deckSlice.ts      # Deck state management
│   └── hooks.ts          # Typed Redux hooks
├── types/
│   └── deck.ts           # TypeScript type definitions
├── App.tsx               # Main application component
├── App.css               # Application styling
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

## Usage

### Loading Tracks
Click the "Load Track" button on any deck to load a sample track.

### Playback Controls
- **Play/Pause**: Start or stop track playback
- **Cue**: Set a cue point while playing, or jump to cue point when stopped
- **Sync**: Synchronize BPM with other playing decks

### Pitch & Volume
- Use the **Pitch Slider** to adjust playback speed (-100% to +100%)
- Use the **Volume Fader** to control deck volume
- **Solo**: Mute all other decks
- **Mute**: Mute current deck

### BPM Control
- View current BPM in real-time
- Use **TAP** button to manually set tempo by tapping the beat

### Focus
Click on any deck to focus it (indicated by green border)

## Screenshots

**Desktop View:**
![Desktop](https://github.com/user-attachments/assets/965b2852-0736-4c25-8a48-5fcbc02bebc1)

**With Tracks:**
![With Tracks](https://github.com/user-attachments/assets/76ed617b-3d12-4e1e-91ad-14b0f77f6336)

**Mobile View:**
![Mobile](https://github.com/user-attachments/assets/97a965aa-eb68-4ee5-bff7-3740682ff4ab)

## License

MIT
