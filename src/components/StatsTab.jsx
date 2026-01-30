import { useState, useEffect } from 'react';
import { useCouple } from '../context/CoupleContext';

function StatsTab({ settings, onOpenSettings }) {
  const { coupleData, partnerId, getMyName, getPartnerName, getOtherPartnerId, isConnected } = useCouple();
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timeUntilVisit, setTimeUntilVisit] = useState(null);
  const [todayKey, setTodayKey] = useState('');

  const myName = getMyName();
  const partnerName = getPartnerName();

  useEffect(() => {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    setTodayKey(dateKey);

    const calculateTimeElapsed = () => {
      if (!settings.anniversaryDate) return;

      const start = new Date(settings.anniversaryDate);
      const now = new Date();
      const diff = now - start;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    const calculateTimeUntilVisit = () => {
      if (!settings.nextVisitDate) {
        setTimeUntilVisit(null);
        return;
      }

      const visit = new Date(settings.nextVisitDate);
      const now = new Date();
      const diff = visit - now;

      if (diff <= 0) {
        setTimeUntilVisit({ passed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilVisit({ days, hours, minutes, seconds, passed: false });
    };

    calculateTimeElapsed();
    calculateTimeUntilVisit();

    const interval = setInterval(() => {
      calculateTimeElapsed();
      calculateTimeUntilVisit();
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.anniversaryDate, settings.nextVisitDate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get today's game results from Firebase
  const getTodayResults = (gameType) => {
    if (!coupleData?.games?.[gameType]?.[todayKey]) return { my: null, partner: null };

    const todayGames = coupleData.games[gameType][todayKey];
    const otherPartnerId = getOtherPartnerId();

    return {
      my: todayGames[partnerId] || null,
      partner: todayGames[otherPartnerId] || null,
    };
  };

  const wordleResults = getTodayResults('wordle');
  const connectionsResults = getTodayResults('connections');

  // Get overall scores
  const scores = coupleData?.scores || { partner1: 0, partner2: 0 };
  const myScore = scores[partnerId] || 0;
  const partnerScore = scores[getOtherPartnerId()] || 0;

  const today = new Date();
  const todayFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="stats-tab">
      <div className="stats-header">
        <h2>{myName} & {partnerName}</h2>
        <button className="settings-btn" onClick={onOpenSettings}>
          Settings
        </button>
      </div>

      {!isConnected() && (
        <div className="connection-status">
          <p>Waiting for {partnerName || 'partner'} to join...</p>
          <p className="share-code-hint">Share your couple code from Settings!</p>
        </div>
      )}

      {/* Scoreboard */}
      <div className="stat-card scoreboard-card">
        <h3>Game Scoreboard</h3>
        <div className="scoreboard">
          <div className="scoreboard-player">
            <span className="scoreboard-name">{myName}</span>
            <span className="scoreboard-wins">{myScore}</span>
            <span className="scoreboard-label">wins</span>
          </div>
          <span className="scoreboard-vs">vs</span>
          <div className="scoreboard-player">
            <span className="scoreboard-name">{partnerName}</span>
            <span className="scoreboard-wins">{partnerScore}</span>
            <span className="scoreboard-label">wins</span>
          </div>
        </div>
      </div>

      {!settings.anniversaryDate ? (
        <div className="setup-prompt">
          <p>Set your anniversary date to start tracking your journey together!</p>
          <button onClick={onOpenSettings} className="setup-btn">Get Started</button>
        </div>
      ) : (
        <>
          <div className="stat-card main-counter">
            <h3>Time Together</h3>
            <div className="time-display">
              <div className="time-unit">
                <span className="time-value">{timeElapsed.days}</span>
                <span className="time-label">days</span>
              </div>
              <div className="time-unit">
                <span className="time-value">{timeElapsed.hours}</span>
                <span className="time-label">hours</span>
              </div>
              <div className="time-unit">
                <span className="time-value">{timeElapsed.minutes}</span>
                <span className="time-label">minutes</span>
              </div>
              <div className="time-unit">
                <span className="time-value">{timeElapsed.seconds}</span>
                <span className="time-label">seconds</span>
              </div>
            </div>
            <p className="anniversary-text">Since {formatDate(settings.anniversaryDate)}</p>
          </div>

          <div className="stat-card countdown-card">
            <h3>Next Visit</h3>
            {timeUntilVisit === null ? (
              <div className="no-visit">
                <p>No upcoming visit scheduled</p>
                <button onClick={onOpenSettings} className="set-visit-btn">Set a date</button>
              </div>
            ) : timeUntilVisit.passed ? (
              <div className="visit-today">
                <p>The day is here! Enjoy your time together!</p>
              </div>
            ) : (
              <>
                <div className="time-display countdown">
                  <div className="time-unit">
                    <span className="time-value">{timeUntilVisit.days}</span>
                    <span className="time-label">days</span>
                  </div>
                  <div className="time-unit">
                    <span className="time-value">{timeUntilVisit.hours}</span>
                    <span className="time-label">hours</span>
                  </div>
                  <div className="time-unit">
                    <span className="time-value">{timeUntilVisit.minutes}</span>
                    <span className="time-label">minutes</span>
                  </div>
                  <div className="time-unit">
                    <span className="time-value">{timeUntilVisit.seconds}</span>
                    <span className="time-label">seconds</span>
                  </div>
                </div>
                <p className="visit-date-text">{formatDate(settings.nextVisitDate)}</p>
              </>
            )}
          </div>
        </>
      )}

      {/* Today's Games */}
      <div className="stat-card today-games">
        <h3>Today's Games - {todayFormatted}</h3>

        <div className="today-game-row">
          <span className="game-icon">🟩</span>
          <span className="game-name">Wordle</span>
          <div className="game-results-duo">
            <span className={`game-result ${wordleResults.my ? (wordleResults.my.won ? 'won' : 'lost') : 'pending'}`}>
              {wordleResults.my ? (wordleResults.my.won ? `${wordleResults.my.attempts}/6` : 'X/6') : '-'}
            </span>
            <span className="result-separator">|</span>
            <span className={`game-result ${wordleResults.partner ? (wordleResults.partner.won ? 'won' : 'lost') : 'pending'}`}>
              {wordleResults.partner ? (wordleResults.partner.won ? `${wordleResults.partner.attempts}/6` : 'X/6') : '-'}
            </span>
          </div>
        </div>

        <div className="today-game-row">
          <span className="game-icon">🔗</span>
          <span className="game-name">Connections</span>
          <div className="game-results-duo">
            <span className={`game-result ${connectionsResults.my ? (connectionsResults.my.completed ? 'won' : 'lost') : 'pending'}`}>
              {connectionsResults.my ? `${connectionsResults.my.groupsFound}/4` : '-'}
            </span>
            <span className="result-separator">|</span>
            <span className={`game-result ${connectionsResults.partner ? (connectionsResults.partner.completed ? 'won' : 'lost') : 'pending'}`}>
              {connectionsResults.partner ? `${connectionsResults.partner.groupsFound}/4` : '-'}
            </span>
          </div>
        </div>

        <div className="results-legend">
          <span>{myName}</span>
          <span>|</span>
          <span>{partnerName}</span>
        </div>

        <p className="games-reminder">
          Play daily puzzles together - fewer attempts wins!
        </p>
      </div>

      {settings.anniversaryDate && (
        <div className="stats-grid">
          <div className="stat-card mini-stat">
            <span className="mini-stat-value">{Math.floor(timeElapsed.days / 7)}</span>
            <span className="mini-stat-label">Weeks Together</span>
          </div>
          <div className="stat-card mini-stat">
            <span className="mini-stat-value">{Math.floor(timeElapsed.days / 30)}</span>
            <span className="mini-stat-label">Months Together</span>
          </div>
          <div className="stat-card mini-stat">
            <span className="mini-stat-value">{timeElapsed.days * 24 + timeElapsed.hours}</span>
            <span className="mini-stat-label">Total Hours</span>
          </div>
          <div className="stat-card mini-stat">
            <span className="mini-stat-value">{settings.visitsCount || 0}</span>
            <span className="mini-stat-label">Visits So Far</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsTab;
