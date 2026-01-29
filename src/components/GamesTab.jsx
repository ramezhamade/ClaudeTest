import { useState } from 'react';
import WhosMostLikely from './games/WhosMostLikely';
import TruthOrDare from './games/TruthOrDare';
import WouldYouRather from './games/WouldYouRather';
import LoveLanguageQuiz from './games/LoveLanguageQuiz';
import TicTacToe from './games/TicTacToe';
import Wordle from './games/Wordle';
import Connections from './games/Connections';

function GamesTab({ settings, onGameEnd }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'wordle',
      title: 'Wordle',
      description: 'One sets the word, the other guesses - NY Times style!',
      emoji: '🟩',
      component: Wordle,
      tracked: true,
    },
    {
      id: 'connections',
      title: 'Connections',
      description: 'Find 4 groups of 4 related words - take turns!',
      emoji: '🔗',
      component: Connections,
      tracked: true,
    },
    {
      id: 'tic-tac-toe',
      title: 'Tic Tac Toe',
      description: 'Classic PvP game - winner picks the next date activity!',
      emoji: '⭕',
      component: TicTacToe,
      tracked: true,
    },
    {
      id: 'whos-most-likely',
      title: "Who's Most Likely To",
      description: 'Vote on who would be more likely to do different things',
      emoji: '🤔',
      component: WhosMostLikely,
      tracked: false,
    },
    {
      id: 'truth-or-dare',
      title: 'Truth or Dare',
      description: 'Classic game with a romantic twist',
      emoji: '💋',
      component: TruthOrDare,
      tracked: false,
    },
    {
      id: 'would-you-rather',
      title: 'Would You Rather',
      description: 'Make choices together and see if you match',
      emoji: '⚖️',
      component: WouldYouRather,
      tracked: false,
    },
    {
      id: 'love-language',
      title: 'Love Language Quiz',
      description: 'Discover how you prefer to give and receive love',
      emoji: '💝',
      component: LoveLanguageQuiz,
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
      <h2>Games & Questions</h2>
      <p className="games-subtitle">Have fun together, even from a distance!</p>

      <div className="games-section">
        <h3 className="section-title">Competitive Games</h3>
        <p className="section-subtitle">Win/loss tracked on scoreboard</p>
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
              <span className="tracked-badge">Tracked</span>
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
    </div>
  );
}

export default GamesTab;
