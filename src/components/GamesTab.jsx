import { useState } from 'react';
import WhosMostLikely from './games/WhosMostLikely';
import TruthOrDare from './games/TruthOrDare';
import WouldYouRather from './games/WouldYouRather';
import LoveLanguageQuiz from './games/LoveLanguageQuiz';
import TicTacToe from './games/TicTacToe';

function GamesTab({ settings }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'whos-most-likely',
      title: "Who's Most Likely To",
      description: 'Vote on who would be more likely to do different things',
      emoji: '🤔',
      component: WhosMostLikely,
    },
    {
      id: 'truth-or-dare',
      title: 'Truth or Dare',
      description: 'Classic game with a romantic twist',
      emoji: '💋',
      component: TruthOrDare,
    },
    {
      id: 'would-you-rather',
      title: 'Would You Rather',
      description: 'Make choices together and see if you match',
      emoji: '⚖️',
      component: WouldYouRather,
    },
    {
      id: 'love-language',
      title: 'Love Language Quiz',
      description: 'Discover how you prefer to give and receive love',
      emoji: '💝',
      component: LoveLanguageQuiz,
    },
    {
      id: 'tic-tac-toe',
      title: 'Tic Tac Toe',
      description: 'Classic PvP game - winner picks the next date activity!',
      emoji: '⭕',
      component: TicTacToe,
    },
  ];

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <div className="games-tab">
        <button className="back-btn" onClick={() => setSelectedGame(null)}>
          ← Back to Games
        </button>
        <GameComponent settings={settings} />
      </div>
    );
  }

  return (
    <div className="games-tab">
      <h2>Games & Questions</h2>
      <p className="games-subtitle">Have fun together, even from a distance!</p>

      <div className="games-grid">
        {games.map((game) => (
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
  );
}

export default GamesTab;
