import { useState } from 'react';
import { isFirebaseConfigured } from './firebase';
import { CoupleProvider, useCouple } from './context/CoupleContext';
import CoupleSetup from './components/CoupleSetup';
import StatsTab from './components/StatsTab';
import GamesTab from './components/GamesTab';
import Settings from './components/Settings';
import './App.css';

function FirebaseError() {
  return (
    <div className="app">
      <div className="firebase-error">
        <h1>Setup Required</h1>
        <p>Firebase is not configured yet.</p>
        <div className="error-instructions">
          <h3>To fix this:</h3>
          <ol>
            <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
            <li>Create a new project</li>
            <li>Enable Realtime Database</li>
            <li>Add environment variables in Vercel Settings</li>
            <li>Redeploy</li>
          </ol>
        </div>
        <p className="error-hint">
          Need the exact variable names? Check the .env.example file in the repo.
        </p>
      </div>
    </div>
  );
}

function AppContent() {
  const { coupleCode, coupleData, loading, isConnected, saveSettings, logout } = useCouple();
  const [activeTab, setActiveTab] = useState('stats');
  const [showSettings, setShowSettings] = useState(false);

  // Get settings from Firebase or use defaults
  const settings = {
    partner1Name: coupleData?.partner1?.name || '',
    partner2Name: coupleData?.partner2?.name || '',
    anniversaryDate: coupleData?.settings?.anniversaryDate || '',
    nextVisitDate: coupleData?.settings?.nextVisitDate || '',
    visitsCount: coupleData?.settings?.visitsCount || 0,
  };

  const handleSaveSettings = async (newSettings) => {
    await saveSettings({
      anniversaryDate: newSettings.anniversaryDate,
      nextVisitDate: newSettings.nextVisitDate,
      visitsCount: newSettings.visitsCount,
    });
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading-heart">💕</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!coupleCode) {
    return (
      <div className="app">
        <CoupleSetup />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Our Love App</h1>
        {!isConnected() && (
          <div className="waiting-badge">Waiting for partner...</div>
        )}
      </header>

      <main className="app-main">
        {activeTab === 'stats' && (
          <StatsTab
            settings={settings}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
        {activeTab === 'games' && (
          <GamesTab settings={settings} />
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
          coupleCode={coupleCode}
          onLogout={logout}
        />
      )}
    </div>
  );
}

function App() {
  // Check if Firebase is configured
  if (!isFirebaseConfigured()) {
    return <FirebaseError />;
  }

  return (
    <CoupleProvider>
      <AppContent />
    </CoupleProvider>
  );
}

export default App;
