# MixMaster Pro

Professional DJ Mixing Application built with React, TypeScript, and Redux Toolkit.

## Features

### 4 Professional Decks (A, B, C, D)

Each deck includes:
- **Compact Waveform Display**: Visual representation of audio tracks
- **Transport Controls**:
  - Play/Pause button with visual feedback
  - Cue button (set and jump to cue points)
  - Sync button (synchronize BPM between decks)
- **Pitch Control**: Slider with -100% to +100% range for tempo adjustment
- **Volume Control**: Fader with Solo and Mute buttons
- **BPM Display**: Real-time BPM with Tap Tempo functionality
- **Track Information**: Display with automatic truncation for long names
- **Focus Indicator**: Visual highlight for active deck
- **Quick Menu**: Intuitive track loading interface

### Responsive Design

- **Desktop**: 4 decks in a row (grid layout)
- **Tablet**: 2x2 grid layout
- **Mobile Portrait**: Stacked layout (single column)

### State Management

Centralized state management with Redux Toolkit:
- Independent deck states
- Synchronized BPM control
- Real-time updates across all components

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Vite** - Build tool and dev server
- **ESLint** - Code quality
- **CSS3** - Styling with modern features

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/eligiuszmruk-hash/MixMasterPro.git
cd MixMasterPro

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173/
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint
```

## Project Structure

```
src/
├── components/
│   └── Deck/
│       ├── Deck.tsx        # Deck component
│       └── Deck.css        # Deck styles
├── store/
│   ├── store.ts           # Redux store configuration
│   ├── deckSlice.ts       # Deck state slice
│   └── hooks.ts           # Typed Redux hooks
├── App.tsx                # Main application component
├── App.css                # Application styles
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Usage

### Loading Tracks

1. Click the "Load Track" button on any deck
2. Select a track from the Quick Menu
3. The track will load with its waveform and BPM

### Playback Controls

- **Play/Pause**: Start or stop playback
- **Cue**: Set a cue point while playing, or jump to cue point when stopped
- **Sync**: Synchronize BPM with other playing decks

### Tempo Control

- Use the **Pitch Slider** to adjust tempo from -100% to +100%
- The BPM display updates in real-time based on pitch adjustment

### Volume Control

- Adjust volume with the **Volume Fader** (0-100)
- **Solo (S)**: Solo this deck (mute others)
- **Mute (M)**: Mute this deck

### Tap Tempo

Click the **TAP** button multiple times to the beat:
- 2 or more taps calculate average BPM
- Validated to 60-200 BPM range
- Updates deck BPM automatically

### Deck Focus

Click any deck to set it as the active/focused deck:
- Cyan border highlights the active deck
- Glowing dot indicator in the header
- Useful for keyboard control (future feature)

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast color scheme

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
