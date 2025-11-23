export interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number;
  bpm: number;
}

export interface DeckState {
  id: 'A' | 'B' | 'C' | 'D';
  track: Track | null;
  isPlaying: boolean;
  isCued: boolean;
  cuePoint: number;
  currentTime: number;
  pitch: number; // Range: -100 to +100
  volume: number; // Range: 0 to 100
  isSolo: boolean;
  isMuted: boolean;
  bpm: number;
  isFocused: boolean;
  waveformData: number[]; // Simplified waveform representation
}

export interface DecksState {
  decks: {
    A: DeckState;
    B: DeckState;
    C: DeckState;
    D: DeckState;
  };
}
