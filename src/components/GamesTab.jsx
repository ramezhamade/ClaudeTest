import { useState } from 'react';
import WhosMostLikely from './games/WhosMostLikely';
import Wordle from './games/Wordle';
import Connections from './games/Connections';

function GamesTab({ settings, onGameEnd }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'wordle',
      title: 'Daily Wordle',
      description: 'Same word for both - compete on fewer guesses!',
      emoji: '🟩',
      component: Wordle,
      tracked: true,
    },
    {
      id: 'connections',
      title: 'Daily Connections',
      description: 'Same puzzle for both - compete on fewer mistakes!',
      emoji: '🔗',
      component: Connections,
      tracked: true,
    },
    {
      id: 'whos-most-likely',
      title: "Who's Most Likely To",
      description: 'Fun questions to discuss together - not competitive',
      emoji: '🤔',
      component: WhosMostLikely,
      tracked: false,
    },
  ];

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <div className="games-tab">
        <button className="back-btn" onClick={() => setSelectedGame(null)}>
          ← Back to Games
        </button>
        <GameComponent
          settings={settings}
          onGameEnd={selectedGame.tracked ? onGameEnd : undefined}
        />
      </div>
    );
  }

  return (
    <div className="games-tab">
      <h2>Games</h2>
      <p className="games-subtitle">Play together from anywhere!</p>

      <div className="games-section">
        <h3 className="section-title">Daily Challenges</h3>
        <p className="section-subtitle">New puzzle every day - share results to compare!</p>
        <div className="games-grid">
          {games.filter(g => g.tracked).map((game) => (
            <div
              key={game.id}
              className="game-card competitive"
              onClick={() => setSelectedGame(game)}
            >
              <span className="game-emoji">{game.emoji}</span>
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <span className="tracked-badge">Daily</span>
            </div>
          ))}
        </div>
      </div>

      <div className="games-section">
        <h3 className="section-title">Just for Fun</h3>
        <div className="games-grid">
          {games.filter(g => !g.tracked).map((game) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => setSelectedGame(game)}
            >
              <span className="game-emoji">{game.emoji}</span>
              <h3>{game.title}</h3>
              <p>{game.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="how-to-play">
        <h3>How to Play Together</h3>
        <ol>
          <li>Both of you play the daily puzzle on your own phones</li>
          <li>When finished, tap "Share Result with Partner"</li>
          <li>Compare results - fewer attempts/mistakes wins!</li>
        </ol>
      </div>
    </div>
  );
}

export default GamesTab;
