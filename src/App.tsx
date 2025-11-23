import Deck from './components/Deck';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>MixMaster Pro</h1>
        <p className="tagline">Professional 4-Deck DJ Controller</p>
      </header>
      
      <main className="decks-container">
        <Deck deckId="A" />
        <Deck deckId="B" />
        <Deck deckId="C" />
        <Deck deckId="D" />
      </main>
      
      <footer className="app-footer">
        <p>Use SOLO/MUTE for volume control | TAP for tempo | SYNC to match BPM</p>
      </footer>
    </div>
  );
}

export default App;
