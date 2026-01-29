import { useState, useEffect } from 'react';
import StatsTab from './components/StatsTab';
import GamesTab from './components/GamesTab';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('stats');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('loveAppSettings');
    return saved
      ? JSON.parse(saved)
      : {
          partner1Name: '',
          partner2Name: '',
          anniversaryDate: '',
          nextVisitDate: '',
          visitsCount: 0,
        };
  });

  const [gameScores, setGameScores] = useState(() => {
    const saved = localStorage.getItem('loveAppGameScores');
    return saved
      ? JSON.parse(saved)
      : {
          partner1: { wins: 0, losses: 0 },
          partner2: { wins: 0, losses: 0 },
          games: {
            wordle: { partner1: 0, partner2: 0 },
            connections: { partner1: 0, partner2: 0 },
            tictactoe: { partner1: 0, partner2: 0 },
          }
        };
  });

  useEffect(() => {
    localStorage.setItem('loveAppSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('loveAppGameScores', JSON.stringify(gameScores));
  }, [gameScores]);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const handleGameEnd = (winner, gameType) => {
    if (winner === 'tie') return;

    setGameScores(prev => {
      const loser = winner === 'partner1' ? 'partner2' : 'partner1';
      const newScores = {
        ...prev,
        [winner]: {
          ...prev[winner],
          wins: prev[winner].wins + 1,
        },
        [loser]: {
          ...prev[loser],
          losses: prev[loser].losses + 1,
        },
        games: {
          ...prev.games,
          [gameType]: {
            ...prev.games[gameType],
            [winner]: (prev.games[gameType]?.[winner] || 0) + 1,
          }
        }
      };
      return newScores;
    });
  };

  const resetScores = () => {
    setGameScores({
      partner1: { wins: 0, losses: 0 },
      partner2: { wins: 0, losses: 0 },
      games: {
        wordle: { partner1: 0, partner2: 0 },
        connections: { partner1: 0, partner2: 0 },
        tictactoe: { partner1: 0, partner2: 0 },
      }
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Our Love App</h1>
      </header>

      <main className="app-main">
        {activeTab === 'stats' && (
          <StatsTab
            settings={settings}
            gameScores={gameScores}
            onOpenSettings={() => setShowSettings(true)}
            onResetScores={resetScores}
          />
        )}
        {activeTab === 'games' && (
          <GamesTab
            settings={settings}
            onGameEnd={handleGameEnd}
          />
        )}
      </main>

      <nav className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-label">Stats</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          <span className="tab-icon">🎮</span>
          <span className="tab-label">Games</span>
        </button>
      </nav>

      {showSettings && (
        <Settings
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
