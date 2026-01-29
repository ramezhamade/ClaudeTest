import { useState, useEffect } from 'react';

function StatsTab({ settings, gameScores, onOpenSettings, onResetScores }) {
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timeUntilVisit, setTimeUntilVisit] = useState(null);

  const partner1Name = settings.partner1Name || 'Player 1';
  const partner2Name = settings.partner2Name || 'Player 2';

  useEffect(() => {
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

  const totalGames = (gameScores?.partner1?.wins || 0) + (gameScores?.partner2?.wins || 0);
  const p1WinRate = totalGames > 0 ? Math.round((gameScores?.partner1?.wins / totalGames) * 100) : 0;
  const p2WinRate = totalGames > 0 ? Math.round((gameScores?.partner2?.wins / totalGames) * 100) : 0;

  return (
    <div className="stats-tab">
      <div className="stats-header">
        <h2>{partner1Name} & {partner2Name}</h2>
        <button className="settings-btn" onClick={onOpenSettings}>
          Settings
        </button>
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

          {/* Game Scoreboard */}
          <div className="stat-card scoreboard-card">
            <h3>Game Scoreboard</h3>
            <div className="scoreboard">
              <div className="scoreboard-player">
                <span className="scoreboard-name">{partner1Name}</span>
                <span className="scoreboard-wins">{gameScores?.partner1?.wins || 0}</span>
                <span className="scoreboard-label">wins</span>
                <div className="win-rate-bar">
                  <div className="win-rate-fill p1" style={{ width: `${p1WinRate}%` }}></div>
                </div>
                <span className="win-rate-text">{p1WinRate}%</span>
              </div>
              <div className="scoreboard-vs">VS</div>
              <div className="scoreboard-player">
                <span className="scoreboard-name">{partner2Name}</span>
                <span className="scoreboard-wins">{gameScores?.partner2?.wins || 0}</span>
                <span className="scoreboard-label">wins</span>
                <div className="win-rate-bar">
                  <div className="win-rate-fill p2" style={{ width: `${p2WinRate}%` }}></div>
                </div>
                <span className="win-rate-text">{p2WinRate}%</span>
              </div>
            </div>

            {/* Game breakdown */}
            <div className="game-breakdown">
              <h4>By Game</h4>
              <div className="game-scores-list">
                <div className="game-score-row">
                  <span className="game-name">Wordle</span>
                  <span className="game-score-detail">
                    {gameScores?.games?.wordle?.partner1 || 0} - {gameScores?.games?.wordle?.partner2 || 0}
                  </span>
                </div>
                <div className="game-score-row">
                  <span className="game-name">Connections</span>
                  <span className="game-score-detail">
                    {gameScores?.games?.connections?.partner1 || 0} - {gameScores?.games?.connections?.partner2 || 0}
                  </span>
                </div>
                <div className="game-score-row">
                  <span className="game-name">Tic Tac Toe</span>
                  <span className="game-score-detail">
                    {gameScores?.games?.tictactoe?.partner1 || 0} - {gameScores?.games?.tictactoe?.partner2 || 0}
                  </span>
                </div>
              </div>
            </div>

            <button className="reset-scores-btn" onClick={onResetScores}>
              Reset All Scores
            </button>
          </div>

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
              <span className="mini-stat-value">{totalGames}</span>
              <span className="mini-stat-label">Games Played</span>
            </div>
            <div className="stat-card mini-stat">
              <span className="mini-stat-value">{settings.visitsCount || 0}</span>
              <span className="mini-stat-label">Visits So Far</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StatsTab;
