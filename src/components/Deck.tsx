import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  togglePlay,
  jumpToCue,
  setCue,
  syncBPM,
  setPitch,
  setVolume,
  toggleSolo,
  toggleMute,
  tapTempo,
  setFocus,
  loadTrack,
} from '../store/deckSlice';
import type { Track } from '../types/deck';
import './Deck.css';

interface DeckProps {
  deckId: 'A' | 'B' | 'C' | 'D';
}

const Deck: React.FC<DeckProps> = ({ deckId }) => {
  const dispatch = useAppDispatch();
  const deck = useAppSelector((state) => state.decks[deckId]);
  const allDecks = useAppSelector((state) => state.decks);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const handlePlayPause = () => {
    dispatch(togglePlay(deckId));
  };

  const handleCue = () => {
    if (deck.isPlaying) {
      // If playing, set current position as cue point
      dispatch(setCue({ deckId, time: deck.currentTime }));
    } else {
      // If stopped, jump to cue point
      dispatch(jumpToCue(deckId));
    }
  };

  const handleSync = () => {
    // Sync to the first playing deck that's not this one
    const otherDecks = (['A', 'B', 'C', 'D'] as const).filter(id => id !== deckId);
    const playingDeck = otherDecks.find(id => allDecks[id]?.isPlaying);
    
    if (playingDeck) {
      dispatch(syncBPM({ sourceDeck: playingDeck, targetDeck: deckId }));
    } else if (otherDecks.length > 0) {
      // If no deck is playing, sync to the first other deck
      dispatch(syncBPM({ sourceDeck: otherDecks[0], targetDeck: deckId }));
    }
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pitch = parseFloat(e.target.value);
    dispatch(setPitch({ deckId, pitch }));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    dispatch(setVolume({ deckId, volume }));
  };

  const handleSolo = () => {
    dispatch(toggleSolo(deckId));
  };

  const handleMute = () => {
    dispatch(toggleMute(deckId));
  };

  const handleTapTempo = () => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now].slice(-4); // Keep last 4 taps
    setTapTimes(newTapTimes);

    if (newTapTimes.length >= 2) {
      // Calculate average interval between taps
      const intervals = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      
      if (bpm >= 60 && bpm <= 200) {
        dispatch(tapTempo({ deckId, bpm }));
      }
    }
  };

  const handleFocus = () => {
    dispatch(setFocus(deckId));
  };

  const handleLoadTrack = (track: Track) => {
    dispatch(loadTrack({ deckId, track }));
  };

  const handleQuickLoad = () => {
    // Demo: Load a sample track
    const sampleTracks: Track[] = [
      { id: '1', name: 'Electronic Dreams', artist: 'DJ Shadow', duration: 240, bpm: 128 },
      { id: '2', name: 'Bass Foundation', artist: 'The Architect', duration: 300, bpm: 140 },
      { id: '3', name: 'Melodic Journey', artist: 'Sound Waves', duration: 270, bpm: 125 },
      { id: '4', name: 'Night Rhythm', artist: 'Beat Master', duration: 210, bpm: 132 },
    ];
    
    const randomTrack = sampleTracks[Math.floor(Math.random() * sampleTracks.length)];
    handleLoadTrack(randomTrack);
  };

  const truncateText = (text: string, maxLength: number = 20) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div 
      className={`deck ${deck.isFocused ? 'focused' : ''}`}
      onClick={handleFocus}
    >
      <div className="deck-header">
        <div className="deck-id">DECK {deckId}</div>
        <button className="load-track-btn" onClick={handleQuickLoad}>
          Load Track
        </button>
      </div>

      <div className="track-info">
        <div className="track-name">
          {deck.track ? truncateText(deck.track.name) : 'No track loaded'}
        </div>
        <div className="track-artist">
          {deck.track ? truncateText(deck.track.artist) : '---'}
        </div>
      </div>

      <div className="waveform-display">
        <svg width="100%" height="60" preserveAspectRatio="none">
          {deck.waveformData.map((value, index) => (
            <rect
              key={index}
              x={`${(index / deck.waveformData.length) * 100}%`}
              y={30 - value / 2}
              width={`${100 / deck.waveformData.length}%`}
              height={value}
              fill={deck.isPlaying ? '#00ff00' : '#666'}
              opacity="0.7"
            />
          ))}
        </svg>
      </div>

      <div className="controls">
        <button 
          className={`control-btn play-btn ${deck.isPlaying ? 'active' : ''}`}
          onClick={handlePlayPause}
        >
          {deck.isPlaying ? '⏸' : '▶'}
        </button>
        <button 
          className={`control-btn cue-btn ${deck.isCued ? 'active' : ''}`}
          onClick={handleCue}
        >
          CUE
        </button>
        <button className="control-btn sync-btn" onClick={handleSync}>
          SYNC
        </button>
      </div>

      <div className="bpm-section">
        <div className="bpm-display">
          <span className="bpm-label">BPM:</span>
          <span className="bpm-value">{deck.bpm.toFixed(2)}</span>
        </div>
        <button className="tap-tempo-btn" onClick={handleTapTempo}>
          TAP
        </button>
      </div>

      <div className="pitch-section">
        <label className="pitch-label">
          Pitch: {deck.pitch.toFixed(1)}%
        </label>
        <input
          type="range"
          className="pitch-slider"
          min="-100"
          max="100"
          step="0.1"
          value={deck.pitch}
          onChange={handlePitchChange}
        />
        <div className="pitch-markers">
          <span>-100%</span>
          <span>0</span>
          <span>+100%</span>
        </div>
      </div>

      <div className="volume-section">
        <label className="volume-label">
          Volume: {deck.volume.toFixed(0)}%
        </label>
        <input
          type="range"
          className="volume-fader"
          min="0"
          max="100"
          step="1"
          value={deck.volume}
          onChange={handleVolumeChange}
          disabled={deck.isMuted}
        />
        <div className="volume-controls">
          <button 
            className={`volume-btn ${deck.isSolo ? 'active' : ''}`}
            onClick={handleSolo}
          >
            SOLO
          </button>
          <button 
            className={`volume-btn ${deck.isMuted ? 'active' : ''}`}
            onClick={handleMute}
          >
            MUTE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deck;
