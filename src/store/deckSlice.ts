import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DeckState {
  id: 'A' | 'B' | 'C' | 'D';
  isPlaying: boolean;
  isCueSet: boolean;
  cuePoint: number;
  pitch: number; // -100 to +100
  volume: number; // 0 to 100
  isMuted: boolean;
  isSolo: boolean;
  bpm: number;
  trackName: string;
  waveformData: number[];
  isFocused: boolean;
  position: number; // Current position in seconds
}

export interface DecksState {
  decks: Record<string, DeckState>;
}

const initialDeckState = (id: 'A' | 'B' | 'C' | 'D'): DeckState => ({
  id,
  isPlaying: false,
  isCueSet: false,
  cuePoint: 0,
  pitch: 0,
  volume: 75,
  isMuted: false,
  isSolo: false,
  bpm: 120,
  trackName: '',
  waveformData: [],
  isFocused: false,
  position: 0,
});

const initialState: DecksState = {
  decks: {
    A: initialDeckState('A'),
    B: initialDeckState('B'),
    C: initialDeckState('C'),
    D: initialDeckState('D'),
  },
};

const deckSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    togglePlay: (state, action: PayloadAction<string>) => {
      const deck = state.decks[action.payload];
      if (deck) {
        deck.isPlaying = !deck.isPlaying;
      }
    },
    setCue: (state, action: PayloadAction<string>) => {
      const deck = state.decks[action.payload];
      if (deck) {
        deck.isCueSet = true;
        deck.cuePoint = deck.position;
      }
    },
    jumpToCue: (state, action: PayloadAction<string>) => {
      const deck = state.decks[action.payload];
      if (deck && deck.isCueSet) {
        deck.position = deck.cuePoint;
        deck.isPlaying = false;
      }
    },
    setPitch: (state, action: PayloadAction<{ deckId: string; pitch: number }>) => {
      const deck = state.decks[action.payload.deckId];
      if (deck) {
        deck.pitch = Math.max(-100, Math.min(100, action.payload.pitch));
      }
    },
    setVolume: (state, action: PayloadAction<{ deckId: string; volume: number }>) => {
      const deck = state.decks[action.payload.deckId];
      if (deck) {
        deck.volume = Math.max(0, Math.min(100, action.payload.volume));
      }
    },
    toggleMute: (state, action: PayloadAction<string>) => {
      const deck = state.decks[action.payload];
      if (deck) {
        deck.isMuted = !deck.isMuted;
      }
    },
    toggleSolo: (state, action: PayloadAction<string>) => {
      const deck = state.decks[action.payload];
      if (deck) {
        deck.isSolo = !deck.isSolo;
      }
    },
    setBpm: (state, action: PayloadAction<{ deckId: string; bpm: number }>) => {
      const deck = state.decks[action.payload.deckId];
      if (deck) {
        deck.bpm = action.payload.bpm;
      }
    },
    syncBpm: (state, action: PayloadAction<{ sourceDeckId: string; targetDeckId: string }>) => {
      const sourceDeck = state.decks[action.payload.sourceDeckId];
      const targetDeck = state.decks[action.payload.targetDeckId];
      if (sourceDeck && targetDeck) {
        targetDeck.bpm = sourceDeck.bpm;
        targetDeck.pitch = sourceDeck.pitch;
      }
    },
    loadTrack: (state, action: PayloadAction<{ deckId: string; trackName: string; bpm: number; waveformData: number[] }>) => {
      const deck = state.decks[action.payload.deckId];
      if (deck) {
        deck.trackName = action.payload.trackName;
        deck.bpm = action.payload.bpm;
        deck.waveformData = action.payload.waveformData;
        deck.position = 0;
        deck.isPlaying = false;
      }
    },
    setFocus: (state, action: PayloadAction<string>) => {
      // Clear focus from all decks
      Object.keys(state.decks).forEach(key => {
        state.decks[key].isFocused = false;
      });
      // Set focus on the specified deck
      const deck = state.decks[action.payload];
      if (deck) {
        deck.isFocused = true;
      }
    },
    updatePosition: (state, action: PayloadAction<{ deckId: string; position: number }>) => {
      const deck = state.decks[action.payload.deckId];
      if (deck) {
        deck.position = action.payload.position;
      }
    },
  },
});

export const {
  togglePlay,
  setCue,
  jumpToCue,
  setPitch,
  setVolume,
  toggleMute,
  toggleSolo,
  setBpm,
  syncBpm,
  loadTrack,
  setFocus,
  updatePosition,
} = deckSlice.actions;

export default deckSlice.reducer;
