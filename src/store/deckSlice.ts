import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DeckState, Track } from '../types/deck';

const createInitialDeckState = (id: 'A' | 'B' | 'C' | 'D'): DeckState => ({
  id,
  track: null,
  isPlaying: false,
  isCued: false,
  cuePoint: 0,
  currentTime: 0,
  pitch: 0,
  volume: 75,
  isSolo: false,
  isMuted: false,
  bpm: 120,
  isFocused: false,
  waveformData: Array(100).fill(0).map(() => Math.random() * 100),
});

const initialState = {
  A: createInitialDeckState('A'),
  B: createInitialDeckState('B'),
  C: createInitialDeckState('C'),
  D: createInitialDeckState('D'),
};

const deckSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    loadTrack: (state, action: PayloadAction<{ deckId: 'A' | 'B' | 'C' | 'D'; track: Track }>) => {
      const { deckId, track } = action.payload;
      state[deckId].track = track;
      state[deckId].bpm = track.bpm;
      state[deckId].waveformData = Array(100).fill(0).map(() => Math.random() * 100);
    },
    
    togglePlay: (state, action: PayloadAction<'A' | 'B' | 'C' | 'D'>) => {
      const deckId = action.payload;
      state[deckId].isPlaying = !state[deckId].isPlaying;
    },
    
    setCue: (state, action: PayloadAction<{ deckId: 'A' | 'B' | 'C' | 'D'; time: number }>) => {
      const { deckId, time } = action.payload;
      state[deckId].cuePoint = time;
      state[deckId].isCued = true;
    },
    
    jumpToCue: (state, action: PayloadAction<'A' | 'B' | 'C' | 'D'>) => {
      const deckId = action.payload;
      state[deckId].currentTime = state[deckId].cuePoint;
      state[deckId].isPlaying = false;
    },
    
    syncBPM: (state, action: PayloadAction<{ sourceDeck: 'A' | 'B' | 'C' | 'D'; targetDeck: 'A' | 'B' | 'C' | 'D' }>) => {
      const { sourceDeck, targetDeck } = action.payload;
      const sourceBPM = state[sourceDeck].bpm;
      state[targetDeck].bpm = sourceBPM;
      // Calculate pitch adjustment based on original track BPM
      if (state[targetDeck].track) {
        const originalBPM = state[targetDeck].track.bpm;
        state[targetDeck].pitch = ((sourceBPM - originalBPM) / originalBPM) * 100;
      }
    },
    
    setPitch: (state, action: PayloadAction<{ deckId: 'A' | 'B' | 'C' | 'D'; pitch: number }>) => {
      const { deckId, pitch } = action.payload;
      // Clamp pitch between -100 and +100
      const clampedPitch = Math.max(-100, Math.min(100, pitch));
      state[deckId].pitch = clampedPitch;
      
      // Update BPM based on pitch
      if (state[deckId].track) {
        const originalBPM = state[deckId].track.bpm;
        state[deckId].bpm = originalBPM * (1 + clampedPitch / 100);
      }
    },
    
    setVolume: (state, action: PayloadAction<{ deckId: 'A' | 'B' | 'C' | 'D'; volume: number }>) => {
      const { deckId, volume } = action.payload;
      state[deckId].volume = Math.max(0, Math.min(100, volume));
    },
    
    toggleSolo: (state, action: PayloadAction<'A' | 'B' | 'C' | 'D'>) => {
      const deckId = action.payload;
      const newSoloState = !state[deckId].isSolo;
      state[deckId].isSolo = newSoloState;
      
      // If enabling solo, mute other decks
      if (newSoloState) {
        (['A', 'B', 'C', 'D'] as const).forEach((id) => {
          if (id !== deckId) {
            state[id].isMuted = true;
          }
        });
      } else {
        // If disabling solo, unmute other decks
        (['A', 'B', 'C', 'D'] as const).forEach((id) => {
          state[id].isMuted = false;
        });
      }
    },
    
    toggleMute: (state, action: PayloadAction<'A' | 'B' | 'C' | 'D'>) => {
      const deckId = action.payload;
      state[deckId].isMuted = !state[deckId].isMuted;
    },
    
    tapTempo: (state, action: PayloadAction<{ deckId: 'A' | 'B' | 'C' | 'D'; bpm: number }>) => {
      const { deckId, bpm } = action.payload;
      state[deckId].bpm = bpm;
      
      // Update pitch based on new BPM
      if (state[deckId].track) {
        const originalBPM = state[deckId].track.bpm;
        state[deckId].pitch = ((bpm - originalBPM) / originalBPM) * 100;
      }
    },
    
    setFocus: (state, action: PayloadAction<'A' | 'B' | 'C' | 'D' | null>) => {
      const focusedDeck = action.payload;
      (['A', 'B', 'C', 'D'] as const).forEach((id) => {
        state[id].isFocused = id === focusedDeck;
      });
    },
    
    updateTime: (state, action: PayloadAction<{ deckId: 'A' | 'B' | 'C' | 'D'; time: number }>) => {
      const { deckId, time } = action.payload;
      state[deckId].currentTime = time;
    },
  },
});

export const {
  loadTrack,
  togglePlay,
  setCue,
  jumpToCue,
  syncBPM,
  setPitch,
  setVolume,
  toggleSolo,
  toggleMute,
  tapTempo,
  setFocus,
  updateTime,
} = deckSlice.actions;

export default deckSlice.reducer;
