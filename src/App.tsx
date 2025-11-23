import Deck from './components/Deck/Deck';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">MixMaster Pro</h1>
        <p className="app__subtitle">Professional DJ Mixing Application</p>
      </header>
      <main className="app__main">
        <div className="deck-grid">
          <Deck deckId="A" />
          <Deck deckId="B" />
          <Deck deckId="C" />
          <Deck deckId="D" />
        </div>
      </main>
    </div>
  );
}

export default App;
