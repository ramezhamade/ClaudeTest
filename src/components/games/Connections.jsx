import { useState, useEffect } from 'react';
import { useCouple } from '../../context/CoupleContext';

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
  {
    groups: [
      { category: 'Flowers', words: ['TULIP', 'DAISY', 'LILY', 'ORCHID'], color: '#f9df6d' },
      { category: 'Desserts', words: ['PIE', 'TART', 'BROWNIE', 'SUNDAE'], color: '#a0c35a' },
      { category: 'Romantic Comedies', words: ['CLUELESS', 'PRETTY', 'NOTTING', 'SLEEPLESS'], color: '#b0c4ef' },
      { category: 'Text Abbreviations', words: ['ILY', 'XOXO', 'BAE', 'BFF'], color: '#ba81c5' },
    ]
  },
  {
    groups: [
      { category: 'Precious Stones', words: ['DIAMOND', 'RUBY', 'EMERALD', 'SAPPHIRE'], color: '#f9df6d' },
      { category: 'Seasons', words: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'], color: '#a0c35a' },
      { category: 'Music Genres', words: ['JAZZ', 'BLUES', 'SOUL', 'ROCK'], color: '#b0c4ef' },
      { category: 'Zodiac Signs', words: ['LEO', 'VIRGO', 'LIBRA', 'ARIES'], color: '#ba81c5' },
    ]
  },
];

const MAX_MISTAKES = 4;

function Connections({ settings }) {
  const { coupleData, partnerId, saveGame, getMyName, getPartnerName, getOtherPartnerId, incrementScore } = useCouple();
  const [words, setWords] = useState([]);
  const [selected, setSelected] = useState([]);
  const [found, setFound] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [shakeWords, setShakeWords] = useState([]);
  const [todayKey, setTodayKey] = useState('');
  const [puzzle, setPuzzle] = useState(null);
  const [myResult, setMyResult] = useState(null);
  const [partnerResult, setPartnerResult] = useState(null);

  useEffect(() => {
    // Generate daily puzzle based on date
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    setTodayKey(dateKey);

    // Use date as seed for consistent daily puzzle
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const puzzleIndex = seed % PUZZLE_SETS.length;
    const dailyPuzzle = PUZZLE_SETS[puzzleIndex];
    setPuzzle(dailyPuzzle);

    // Shuffle words for new game
    const allWords = dailyPuzzle.groups.flatMap(g => g.words);
    setWords(shuffleArray([...allWords]));
  }, []);

  // Load results from Firebase
  useEffect(() => {
    if (!coupleData?.games?.connections || !todayKey || !puzzle) return;

    const todayGames = coupleData.games.connections[todayKey];
    if (todayGames) {
      if (todayGames[partnerId]) {
        const result = todayGames[partnerId];
        setMyResult(result);
        setFound(result.found || []);
        setMistakes(result.mistakes || 0);
        setGameOver(true);

        // Set up remaining words
        const foundWords = (result.found || []).flatMap(g => g.words);
        const allWords = puzzle.groups.flatMap(g => g.words);
        setWords(allWords.filter(w => !foundWords.includes(w)));
      }
      const otherPartnerId = getOtherPartnerId();
      if (todayGames[otherPartnerId]) {
        setPartnerResult(todayGames[otherPartnerId]);
      }
    }
  }, [coupleData, todayKey, partnerId, puzzle, getOtherPartnerId]);

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
    if (selected.length !== 4 || !puzzle) {
      setMessage('Select exactly 4 words');
      return;
    }

    const matchedGroup = puzzle.groups.find(group =>
      selected.every(word => group.words.includes(word)) &&
      group.words.every(word => selected.includes(word))
    );

    if (matchedGroup) {
      const newFound = [...found, matchedGroup];
      setFound(newFound);
      setSelected([]);
      setMessage(`Correct! "${matchedGroup.category}"`);

      if (newFound.length === 4) {
        endGame(newFound, mistakes);
      }
    } else {
      // Check for "one away"
      const closeGroup = puzzle.groups.find(group => {
        const matchCount = selected.filter(word => group.words.includes(word)).length;
        return matchCount === 3 && !found.some(f => f.category === group.category);
      });

      setShakeWords([...selected]);
      setTimeout(() => setShakeWords([]), 500);

      if (closeGroup) {
        setMessage('One away...');
      } else {
        setMessage('Not quite!');
      }

      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setSelected([]);

      if (newMistakes >= MAX_MISTAKES) {
        endGame(found, newMistakes);
      }
    }
  };

  const endGame = async (finalFound, finalMistakes) => {
    setGameOver(true);
    const result = {
      found: finalFound,
      mistakes: finalMistakes,
      groupsFound: finalFound.length,
      date: todayKey,
      completed: finalFound.length === 4,
    };
    setMyResult(result);

    // Save to Firebase
    await saveGame('connections', todayKey, result);

    // Check if we should update scores
    if (partnerResult) {
      determineWinner(result, partnerResult);
    }
  };

  const determineWinner = async (myRes, partnerRes) => {
    if (!myRes || !partnerRes) return;

    // Winner: completed with fewer mistakes, or completed when other didn't
    if (myRes.completed && !partnerRes.completed) {
      await incrementScore(partnerId);
    } else if (!myRes.completed && partnerRes.completed) {
      await incrementScore(getOtherPartnerId());
    } else if (myRes.completed && partnerRes.completed) {
      if (myRes.mistakes < partnerRes.mistakes) {
        await incrementScore(partnerId);
      } else if (partnerRes.mistakes < myRes.mistakes) {
        await incrementScore(getOtherPartnerId());
      }
      // Tie - no score update
    }
  };

  // Check for winner when partner result comes in
  useEffect(() => {
    if (myResult && partnerResult) {
      determineWinner(myResult, partnerResult);
    }
  }, [partnerResult]);

  const handleShuffle = () => {
    const remainingWords = words.filter(w => !found.some(g => g.words.includes(w)));
    const foundWords = words.filter(w => found.some(g => g.words.includes(w)));
    setWords([...foundWords, ...shuffleArray(remainingWords)]);
  };

  const shareResult = () => {
    if (!myResult || !puzzle) return;

    const emojiGrid = puzzle.groups.map(group => {
      const wasFound = myResult.found.some(f => f.category === group.category);
      const color = group.color;
      let emoji = '⬜';
      if (color === '#f9df6d') emoji = '🟨';
      else if (color === '#a0c35a') emoji = '🟩';
      else if (color === '#b0c4ef') emoji = '🟦';
      else if (color === '#ba81c5') emoji = '🟪';
      return wasFound ? emoji.repeat(4) : '⬛⬛⬛⬛';
    }).join('\n');

    const text = `Our Love App - Connections\n${todayKey}\n${myResult.groupsFound}/4 groups | ${myResult.mistakes} mistakes\n\n${emojiGrid}`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      setMessage('Copied to clipboard!');
    }
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

  const getWinnerDisplay = () => {
    if (!myResult || !partnerResult) return null;

    if (myResult.completed && !partnerResult.completed) {
      return <p className="winner-text you-won">{getMyName()} wins!</p>;
    } else if (!myResult.completed && partnerResult.completed) {
      return <p className="winner-text partner-won">{getPartnerName()} wins!</p>;
    } else if (myResult.completed && partnerResult.completed) {
      if (myResult.mistakes < partnerResult.mistakes) {
        return <p className="winner-text you-won">{getMyName()} wins! ({myResult.mistakes} vs {partnerResult.mistakes} mistakes)</p>;
      } else if (partnerResult.mistakes < myResult.mistakes) {
        return <p className="winner-text partner-won">{getPartnerName()} wins! ({partnerResult.mistakes} vs {myResult.mistakes} mistakes)</p>;
      } else {
        return <p className="winner-text tie">It's a tie!</p>;
      }
    } else {
      return <p className="winner-text tie">Both lost - try again tomorrow!</p>;
    }
  };

  if (!puzzle) return <div>Loading...</div>;

  return (
    <div className="game-container connections-game">
      <h2>Daily Connections</h2>
      <p className="game-subtitle">Same puzzle for both - who solves it with fewer mistakes?</p>
      <p className="date-indicator">{todayKey}</p>

      <div className="mistakes-display">
        Mistakes: {Array(MAX_MISTAKES).fill(null).map((_, i) => (
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
      {!gameOver && (
        <div className="connections-grid">
          {words.filter(w => !found.some(g => g.words.includes(w))).map((word) => (
            <button
              key={word}
              className={`conn-word ${selected.includes(word) ? 'selected' : ''} ${shakeWords.includes(word) ? 'shake' : ''}`}
              style={getWordStyle(word)}
              onClick={() => handleWordClick(word)}
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {message && <p className="conn-message">{message}</p>}

      {!gameOver && (
        <>
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

          {partnerResult && (
            <div className="partner-status">
              <p>{getPartnerName()} has already played today!</p>
            </div>
          )}
        </>
      )}

      {gameOver && (
        <div className="result-section">
          <div className={`result-card ${myResult?.completed ? 'match' : 'no-match'}`}>
            <h3>{myResult?.completed ? 'Puzzle Complete!' : 'Out of Guesses!'}</h3>
            <p>{myResult?.groupsFound}/4 groups found</p>
            <p>{myResult?.mistakes} mistakes</p>
          </div>

          {/* Show remaining groups if not completed */}
          {!myResult?.completed && (
            <div className="remaining-groups">
              <p>Remaining groups:</p>
              {puzzle.groups.filter(g => !found.some(f => f.category === g.category)).map((group, i) => (
                <div key={i} className="found-group small" style={{ backgroundColor: group.color }}>
                  <strong>{group.category}</strong>
                  <span>{group.words.join(', ')}</span>
                </div>
              ))}
            </div>
          )}

          <button className="share-btn" onClick={shareResult}>
            Share Result
          </button>
          {message && <p className="success-message">{message}</p>}

          <div className="compare-section">
            <h4>Results</h4>
            <div className="results-comparison">
              <div className="player-result">
                <span className="player-name">{getMyName()}</span>
                <span className="result-score">
                  {myResult?.completed ? `${myResult.groupsFound}/4 (${myResult.mistakes} mistakes)` : 'X'}
                </span>
              </div>
              <span className="vs">vs</span>
              <div className="player-result">
                <span className="player-name">{getPartnerName()}</span>
                <span className="result-score">
                  {partnerResult ? (partnerResult.completed ? `${partnerResult.groupsFound}/4 (${partnerResult.mistakes} mistakes)` : 'X') : 'Waiting...'}
                </span>
              </div>
            </div>
            {getWinnerDisplay()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Connections;
