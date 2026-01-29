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

  useEffect(() => {
    localStorage.setItem('loveAppSettings', JSON.stringify(settings));
  }, [settings]);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
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
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
        {activeTab === 'games' && <GamesTab settings={settings} />}
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
