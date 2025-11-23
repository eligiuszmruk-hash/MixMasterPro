import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
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
} from '../../store/deckSlice';
import './Deck.css';

interface DeckProps {
  deckId: 'A' | 'B' | 'C' | 'D';
}

const Deck: React.FC<DeckProps> = ({ deckId }) => {
  const dispatch = useAppDispatch();
  const deck = useAppSelector((state) => state.decks.decks[deckId]);
  const allDecks = useAppSelector((state) => state.decks.decks);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  if (!deck) return null;

  const handlePlayPause = () => {
    dispatch(togglePlay(deckId));
  };

  const handleCue = () => {
    if (deck.isPlaying) {
      dispatch(setCue(deckId));
    } else {
      dispatch(jumpToCue(deckId));
    }
  };

  const handleSync = () => {
    // Sync with first playing deck or deck A
    const otherDeckId = Object.keys(allDecks).find(
      (id) => id !== deckId && allDecks[id].isPlaying
    );
    if (otherDeckId) {
      dispatch(syncBpm({ sourceDeckId: otherDeckId, targetDeckId: deckId }));
    }
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    dispatch(setPitch({ deckId, pitch: value }));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    dispatch(setVolume({ deckId, volume: value }));
  };

  const handleMute = () => {
    dispatch(toggleMute(deckId));
  };

  const handleSolo = () => {
    dispatch(toggleSolo(deckId));
  };

  const handleTapTempo = () => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now].slice(-4);
    setTapTimes(newTapTimes);

    if (newTapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      // Validate BPM is within reasonable range (60-200)
      const validBpm = Math.max(60, Math.min(200, bpm));
      dispatch(setBpm({ deckId, bpm: validBpm }));
    }
  };

  const handleLoadTrack = () => {
    setShowQuickMenu(!showQuickMenu);
  };

  const loadSampleTrack = (trackName: string, bpm: number) => {
    // Generate sample waveform data (simulating audio analysis)
    // Using sine wave pattern for more realistic appearance
    const waveformData = Array.from({ length: 100 }, (_, i) => {
      const sine = Math.sin(i * 0.2) * 30 + 50;
      const noise = Math.random() * 20 - 10;
      return Math.max(10, Math.min(100, sine + noise));
    });
    dispatch(loadTrack({ deckId, trackName, bpm, waveformData }));
    setShowQuickMenu(false);
  };

  const handleFocus = () => {
    dispatch(setFocus(deckId));
  };

  const truncateTrackName = (name: string, maxLength: number = 30) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  const effectiveBpm = Math.round(deck.bpm * (1 + deck.pitch / 100));

  return (
    <div
      className={`deck ${deck.isFocused ? 'deck--focused' : ''}`}
      onClick={handleFocus}
    >
      <div className="deck__header">
        <h2 className="deck__title">Deck {deckId}</h2>
        <div className="deck__focus-indicator">
          {deck.isFocused && <span className="deck__focus-dot"></span>}
        </div>
      </div>

      <div className="deck__track-info">
        <div className="deck__track-name" title={deck.trackName}>
          {deck.trackName ? truncateTrackName(deck.trackName) : 'No track loaded'}
        </div>
        <button className="deck__load-button" onClick={handleLoadTrack}>
          Load Track
        </button>
      </div>

      {showQuickMenu && (
        <div className="deck__quick-menu">
          <div className="deck__quick-menu-header">
            <span>Quick Menu</span>
            <button onClick={() => setShowQuickMenu(false)}>×</button>
          </div>
          <div className="deck__track-list">
            <div
              className="deck__track-item"
              onClick={() => loadSampleTrack('Summer Vibes - DJ Mix 2024', 128)}
            >
              Summer Vibes - DJ Mix 2024 (128 BPM)
            </div>
            <div
              className="deck__track-item"
              onClick={() => loadSampleTrack('Deep House Anthems Collection', 124)}
            >
              Deep House Anthems Collection (124 BPM)
            </div>
            <div
              className="deck__track-item"
              onClick={() => loadSampleTrack('Techno Underground Sessions Vol.3', 132)}
            >
              Techno Underground Sessions Vol.3 (132 BPM)
            </div>
            <div
              className="deck__track-item"
              onClick={() => loadSampleTrack('Tropical Beats Paradise Mix', 110)}
            >
              Tropical Beats Paradise Mix (110 BPM)
            </div>
          </div>
        </div>
      )}

      <div className="deck__waveform">
        {deck.waveformData.length > 0 ? (
          <div className="deck__waveform-bars">
            {deck.waveformData.map((height, index) => (
              <div
                key={index}
                className="deck__waveform-bar"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        ) : (
          <div className="deck__waveform-empty">No waveform</div>
        )}
      </div>

      <div className="deck__controls">
        <div className="deck__control-row">
          <button
            className={`deck__button deck__button--play ${deck.isPlaying ? 'active' : ''}`}
            onClick={handlePlayPause}
            title={deck.isPlaying ? 'Pause' : 'Play'}
            aria-label={deck.isPlaying ? 'Pause' : 'Play'}
          >
            {deck.isPlaying ? '⏸' : '▶'}
          </button>
          <button
            className={`deck__button deck__button--cue ${deck.isCueSet ? 'active' : ''}`}
            onClick={handleCue}
            title={deck.isPlaying ? 'Set Cue' : 'Jump to Cue'}
            aria-label={deck.isPlaying ? 'Set Cue Point' : 'Jump to Cue Point'}
          >
            CUE
          </button>
          <button
            className="deck__button deck__button--sync"
            onClick={handleSync}
            title="Sync BPM"
            aria-label="Sync BPM with other deck"
          >
            SYNC
          </button>
        </div>

        <div className="deck__bpm-section">
          <div className="deck__bpm-display">
            <span className="deck__bpm-label">BPM</span>
            <span className="deck__bpm-value">{effectiveBpm}</span>
          </div>
          <button
            className="deck__tap-tempo"
            onClick={handleTapTempo}
            title="Tap Tempo"
          >
            TAP
          </button>
        </div>

        <div className="deck__slider-section">
          <label className="deck__slider-label">
            Pitch: {deck.pitch > 0 ? '+' : ''}{deck.pitch.toFixed(1)}%
          </label>
          <input
            type="range"
            className="deck__pitch-slider"
            min="-100"
            max="100"
            step="0.1"
            value={deck.pitch}
            onChange={handlePitchChange}
          />
        </div>

        <div className="deck__volume-section">
          <div className="deck__volume-controls">
            <button
              className={`deck__button deck__button--small ${deck.isSolo ? 'active' : ''}`}
              onClick={handleSolo}
              title="Solo"
              aria-label="Toggle Solo"
            >
              S
            </button>
            <button
              className={`deck__button deck__button--small ${deck.isMuted ? 'active' : ''}`}
              onClick={handleMute}
              title="Mute"
              aria-label="Toggle Mute"
            >
              M
            </button>
          </div>
          <label className="deck__slider-label">
            Volume: {deck.volume}
          </label>
          <input
            type="range"
            className="deck__volume-fader"
            min="0"
            max="100"
            step="1"
            value={deck.volume}
            onChange={handleVolumeChange}
            disabled={deck.isMuted}
          />
        </div>
      </div>
    </div>
  );
};

export default Deck;
