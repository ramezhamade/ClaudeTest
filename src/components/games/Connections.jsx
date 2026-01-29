import { useState, useEffect } from 'react';

const PUZZLE_SETS = [
  {
    groups: [
      { category: 'Types of Dates', words: ['BLIND', 'DOUBLE', 'FIRST', 'DINNER'], color: '#f9df6d' },
      { category: 'Terms of Endearment', words: ['HONEY', 'SUGAR', 'SWEETIE', 'DARLING'], color: '#a0c35a' },
      { category: 'Love Songs', words: ['CRAZY', 'ENDLESS', 'PERFECT', 'ETERNAL'], color: '#b0c4ef' },
      { category: '_____ Heart', words: ['BROKEN', 'PURPLE', 'BRAVE', 'WHOLE'], color: '#ba81c5' },
    ]
  },
  {
    groups: [
      { category: 'Things That Are Red', words: ['ROSE', 'APPLE', 'CHERRY', 'HEART'], color: '#f9df6d' },
      { category: 'Romantic Getaways', words: ['PARIS', 'VENICE', 'HAWAII', 'MALDIVES'], color: '#a0c35a' },
      { category: 'Anniversary Gifts', words: ['FLOWERS', 'JEWELRY', 'CHOCOLATE', 'PERFUME'], color: '#b0c4ef' },
      { category: 'Ways to Say I Love You', words: ['AMORE', 'AMOR', 'LIEBE', 'SARANG'], color: '#ba81c5' },
    ]
  },
  {
    groups: [
      { category: 'Romantic Movies', words: ['TITANIC', 'NOTEBOOK', 'CASABLANCA', 'GHOST'], color: '#f9df6d' },
      { category: 'Wedding Things', words: ['VEIL', 'BOUQUET', 'RING', 'CAKE'], color: '#a0c35a' },
      { category: 'Pet Names', words: ['BABY', 'BABE', 'LOVE', 'DEAR'], color: '#b0c4ef' },
      { category: 'Couple Activities', words: ['DANCING', 'COOKING', 'TRAVELING', 'CUDDLING'], color: '#ba81c5' },
    ]
  },
  {
    groups: [
      { category: 'Things in the Sky', words: ['STAR', 'MOON', 'CLOUD', 'RAINBOW'], color: '#f9df6d' },
      { category: 'Sweet Treats', words: ['CANDY', 'COOKIE', 'CUPCAKE', 'MUFFIN'], color: '#a0c35a' },
      { category: 'Romantic Gestures', words: ['KISS', 'HUG', 'WINK', 'SMILE'], color: '#b0c4ef' },
      { category: 'Love Story Elements', words: ['CHAPTER', 'BEGINNING', 'ENDING', 'FOREVER'], color: '#ba81c5' },
    ]
  },
  {
    groups: [
      { category: 'Coffee Drinks', words: ['LATTE', 'MOCHA', 'ESPRESSO', 'CAPPUCCINO'], color: '#f9df6d' },
      { category: 'Date Night Foods', words: ['SUSHI', 'PASTA', 'STEAK', 'PIZZA'], color: '#a0c35a' },
      { category: 'Relationship Stages', words: ['CRUSH', 'DATING', 'ENGAGED', 'MARRIED'], color: '#b0c4ef' },
      { category: 'Valentine Symbols', words: ['CUPID', 'ARROW', 'DOVE', 'RIBBON'], color: '#ba81c5' },
    ]
  },
];

function Connections({ settings, onGameEnd }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [selected, setSelected] = useState([]);
  const [found, setFound] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [shakeWords, setShakeWords] = useState([]);

  const partner1Name = settings.partner1Name || 'Player 1';
  const partner2Name = settings.partner2Name || 'Player 2';
  const currentPlayerName = currentPlayer === 1 ? partner1Name : partner2Name;

  const puzzle = PUZZLE_SETS[puzzleIndex];
  const MAX_MISTAKES = 4;

  useEffect(() => {
    initGame();
  }, [puzzleIndex]);

  const initGame = () => {
    const allWords = puzzle.groups.flatMap(g => g.words);
    setWords(shuffleArray([...allWords]));
    setSelected([]);
    setFound([]);
    setMistakes(0);
    setGameOver(false);
    setMessage('');
    setScores({ player1: 0, player2: 0 });
    setCurrentPlayer(1);
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleWordClick = (word) => {
    if (gameOver || found.some(g => g.words.includes(word))) return;

    if (selected.includes(word)) {
      setSelected(selected.filter(w => w !== word));
    } else if (selected.length < 4) {
      setSelected([...selected, word]);
    }
    setMessage('');
  };

  const handleSubmit = () => {
    if (selected.length !== 4) {
      setMessage('Select exactly 4 words');
      return;
    }

    const matchedGroup = puzzle.groups.find(group =>
      selected.every(word => group.words.includes(word)) &&
      group.words.every(word => selected.includes(word))
    );

    if (matchedGroup) {
      setFound([...found, matchedGroup]);
      setSelected([]);
      setMessage(`Correct! "${matchedGroup.category}"`);

      const newScores = { ...scores };
      if (currentPlayer === 1) {
        newScores.player1++;
      } else {
        newScores.player2++;
      }
      setScores(newScores);

      if (found.length + 1 === 4) {
        setGameOver(true);
        const winner = newScores.player1 > newScores.player2 ? 'partner1' :
                      newScores.player2 > newScores.player1 ? 'partner2' : 'tie';
        if (onGameEnd && winner !== 'tie') {
          onGameEnd(winner, 'connections');
        }
      }
    } else {
      // Check for "one away"
      const closeGroup = puzzle.groups.find(group => {
        const matchCount = selected.filter(word => group.words.includes(word)).length;
        return matchCount === 3 && !found.includes(group);
      });

      setShakeWords([...selected]);
      setTimeout(() => setShakeWords([]), 500);

      if (closeGroup) {
        setMessage('One away...');
      } else {
        setMessage('Not quite!');
      }

      setMistakes(mistakes + 1);
      setSelected([]);

      if (mistakes + 1 >= MAX_MISTAKES) {
        setGameOver(true);
        const winner = scores.player1 > scores.player2 ? 'partner1' :
                      scores.player2 > scores.player1 ? 'partner2' : 'tie';
        if (onGameEnd && winner !== 'tie') {
          onGameEnd(winner, 'connections');
        }
      } else {
        // Switch players on mistake
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    }
  };

  const handleShuffle = () => {
    const remainingWords = words.filter(w => !found.some(g => g.words.includes(w)));
    const foundWords = words.filter(w => found.some(g => g.words.includes(w)));
    setWords([...foundWords, ...shuffleArray(remainingWords)]);
  };

  const nextPuzzle = () => {
    setPuzzleIndex((puzzleIndex + 1) % PUZZLE_SETS.length);
  };

  const getWordStyle = (word) => {
    const foundGroup = found.find(g => g.words.includes(word));
    if (foundGroup) {
      return { backgroundColor: foundGroup.color, color: '#000' };
    }
    if (selected.includes(word)) {
      return { backgroundColor: '#5a5a5a', color: '#fff' };
    }
    return {};
  };

  return (
    <div className="game-container connections-game">
      <h2>Connections</h2>
      <p className="game-subtitle">Find 4 groups of 4 related words!</p>

      <div className="connections-scores">
        <div className={`conn-score ${currentPlayer === 1 && !gameOver ? 'active' : ''}`}>
          <span className="player-name">{partner1Name}</span>
          <span className="player-score">{scores.player1}</span>
        </div>
        <div className={`conn-score ${currentPlayer === 2 && !gameOver ? 'active' : ''}`}>
          <span className="player-name">{partner2Name}</span>
          <span className="player-score">{scores.player2}</span>
        </div>
      </div>

      {!gameOver && (
        <div className="current-turn">
          <strong>{currentPlayerName}'s turn</strong>
        </div>
      )}

      <div className="mistakes-display">
        {Array(MAX_MISTAKES).fill(null).map((_, i) => (
          <span key={i} className={`mistake-dot ${i < mistakes ? 'used' : ''}`}>●</span>
        ))}
      </div>

      {/* Found groups */}
      {found.map((group, i) => (
        <div key={i} className="found-group" style={{ backgroundColor: group.color }}>
          <strong>{group.category}</strong>
          <span>{group.words.join(', ')}</span>
        </div>
      ))}

      {/* Word grid */}
      <div className="connections-grid">
        {words.filter(w => !found.some(g => g.words.includes(w))).map((word, i) => (
          <button
            key={word}
            className={`conn-word ${selected.includes(word) ? 'selected' : ''} ${shakeWords.includes(word) ? 'shake' : ''}`}
            style={getWordStyle(word)}
            onClick={() => handleWordClick(word)}
            disabled={gameOver}
          >
            {word}
          </button>
        ))}
      </div>

      {message && <p className="conn-message">{message}</p>}

      {!gameOver && (
        <div className="connections-buttons">
          <button className="shuffle-btn" onClick={handleShuffle}>Shuffle</button>
          <button className="deselect-btn" onClick={() => setSelected([])}>Deselect All</button>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={selected.length !== 4}
          >
            Submit
          </button>
        </div>
      )}

      {gameOver && (
        <div className="game-over-section">
          <div className={`result-card ${scores.player1 !== scores.player2 ? 'match' : ''}`}>
            {scores.player1 > scores.player2 ? (
              <h3>{partner1Name} wins!</h3>
            ) : scores.player2 > scores.player1 ? (
              <h3>{partner2Name} wins!</h3>
            ) : (
              <h3>It's a tie!</h3>
            )}
            <p>{partner1Name}: {scores.player1} | {partner2Name}: {scores.player2}</p>
          </div>

          {/* Show remaining groups */}
          {found.length < 4 && (
            <div className="remaining-groups">
              <p>Remaining groups:</p>
              {puzzle.groups.filter(g => !found.includes(g)).map((group, i) => (
                <div key={i} className="found-group small" style={{ backgroundColor: group.color }}>
                  <strong>{group.category}</strong>
                  <span>{group.words.join(', ')}</span>
                </div>
              ))}
            </div>
          )}

          <div className="action-buttons">
            <button className="next-btn" onClick={nextPuzzle}>Next Puzzle</button>
            <button className="skip-btn" onClick={initGame}>Replay This Puzzle</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Connections;
