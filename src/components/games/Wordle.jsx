import { useState, useEffect } from 'react';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// Word list for daily puzzles
const WORD_LIST = [
  'loved', 'heart', 'sweet', 'honey', 'angel', 'dream', 'happy', 'smile', 'trust', 'faith',
  'bliss', 'charm', 'flame', 'grace', 'peace', 'spark', 'light', 'shine', 'bloom', 'adore',
  'music', 'dance', 'laugh', 'share', 'touch', 'close', 'warm', 'cozy', 'hugs', 'kiss',
  'roses', 'stars', 'moon', 'sunny', 'beach', 'ocean', 'waves', 'breeze', 'cloud', 'rain',
  'magic', 'lucky', 'wish', 'hopes', 'plans', 'trips', 'visit', 'calls', 'texts', 'video',
  'movie', 'songs', 'dates', 'gifts', 'cards', 'notes', 'poems', 'story', 'books', 'games',
  'pizza', 'pasta', 'sushi', 'tacos', 'fries', 'juice', 'latte', 'mocha', 'cakes', 'candy',
  'puppy', 'kitty', 'bunny', 'panda', 'bears', 'birds', 'plant', 'trees', 'leafs', 'grass',
  'paris', 'italy', 'tokyo', 'spain', 'dubai', 'bali', 'miami', 'vegas', 'river', 'hills',
  'world', 'globe', 'earth', 'space', 'solar', 'lunar', 'comet', 'north', 'south', 'west',
];

function Wordle({ settings, onGameEnd }) {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [dailyWord, setDailyWord] = useState('');
  const [todayKey, setTodayKey] = useState('');
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [todayResult, setTodayResult] = useState(null);

  const partner1Name = settings.partner1Name || 'Player 1';
  const partner2Name = settings.partner2Name || 'Player 2';

  useEffect(() => {
    // Generate daily word based on date
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    setTodayKey(dateKey);

    // Use date as seed for consistent daily word
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const wordIndex = seed % WORD_LIST.length;
    setDailyWord(WORD_LIST[wordIndex]);

    // Check if already played today
    const savedResult = localStorage.getItem(`wordle-${dateKey}`);
    if (savedResult) {
      const result = JSON.parse(savedResult);
      setHasPlayedToday(true);
      setTodayResult(result);
      setGuesses(result.guesses);
      setGameOver(true);
    }
  }, []);

  const getLetterStatus = (guess, index) => {
    const letter = guess[index];
    if (dailyWord[index] === letter) {
      return 'correct';
    }
    if (dailyWord.includes(letter)) {
      return 'present';
    }
    return 'absent';
  };

  const handleGuess = (e) => {
    e.preventDefault();
    const guess = currentGuess.toLowerCase().trim();

    if (guess.length !== WORD_LENGTH) {
      setMessage(`Guess must be ${WORD_LENGTH} letters`);
      return;
    }

    if (!/^[a-z]+$/.test(guess)) {
      setMessage('Guess must contain only letters');
      return;
    }

    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    setMessage('');

    const won = guess === dailyWord;
    const lost = !won && newGuesses.length >= MAX_GUESSES;

    if (won || lost) {
      setGameOver(true);
      const result = {
        guesses: newGuesses,
        won,
        attempts: newGuesses.length,
        date: todayKey,
      };
      setTodayResult(result);
      localStorage.setItem(`wordle-${todayKey}`, JSON.stringify(result));

      if (onGameEnd) {
        onGameEnd(won ? newGuesses.length : 'X', 'wordle');
      }
    }
  };

  const getKeyboardStatus = () => {
    const status = {};
    guesses.forEach(guess => {
      guess.split('').forEach((letter, i) => {
        const letterStatus = getLetterStatus(guess, i);
        if (letterStatus === 'correct') {
          status[letter] = 'correct';
        } else if (letterStatus === 'present' && status[letter] !== 'correct') {
          status[letter] = 'present';
        } else if (!status[letter]) {
          status[letter] = 'absent';
        }
      });
    });
    return status;
  };

  const shareResult = () => {
    const emojiGrid = guesses.map(guess =>
      guess.split('').map((_, i) => {
        const status = getLetterStatus(guess, i);
        if (status === 'correct') return '🟩';
        if (status === 'present') return '🟨';
        return '⬛';
      }).join('')
    ).join('\n');

    const text = `Our Love App - Wordle\n${todayKey}\n${todayResult?.won ? guesses.length : 'X'}/${MAX_GUESSES}\n\n${emojiGrid}`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      setMessage('Copied to clipboard! Send to your partner!');
    }
  };

  const keyboardStatus = getKeyboardStatus();
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  const won = guesses.length > 0 && guesses[guesses.length - 1] === dailyWord;

  return (
    <div className="game-container wordle-game">
      <h2>Daily Wordle</h2>
      <p className="game-subtitle">Same word for both of you - who gets it in fewer tries?</p>
      <p className="date-indicator">{todayKey}</p>

      <div className="wordle-board">
        {Array(MAX_GUESSES).fill(null).map((_, rowIndex) => (
          <div key={rowIndex} className="wordle-row">
            {Array(WORD_LENGTH).fill(null).map((_, colIndex) => {
              const guess = guesses[rowIndex];
              const letter = guess ? guess[colIndex] : '';
              const status = guess ? getLetterStatus(guess, colIndex) : '';

              return (
                <div
                  key={colIndex}
                  className={`wordle-cell ${status}`}
                >
                  {letter.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {!gameOver ? (
        <>
          <form onSubmit={handleGuess} className="wordle-form">
            <input
              type="text"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value.slice(0, WORD_LENGTH))}
              placeholder="Enter guess"
              className="wordle-input"
              autoComplete="off"
              maxLength={WORD_LENGTH}
              autoFocus
            />
            {message && <p className="error-message">{message}</p>}
            <button type="submit" className="next-btn">Guess</button>
          </form>

          <div className="wordle-keyboard">
            {keyboardRows.map((row, i) => (
              <div key={i} className="keyboard-row">
                {row.map(key => (
                  <button
                    key={key}
                    className={`keyboard-key ${keyboardStatus[key] || ''}`}
                    onClick={() => setCurrentGuess(prev => (prev + key).slice(0, WORD_LENGTH))}
                  >
                    {key.toUpperCase()}
                  </button>
                ))}
              </div>
            ))}
            <div className="keyboard-row">
              <button
                className="keyboard-key wide"
                onClick={() => setCurrentGuess(prev => prev.slice(0, -1))}
              >
                DEL
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="result-section">
          <div className={`result-card ${won ? 'match' : 'no-match'}`}>
            <h3>{won ? 'You got it!' : 'Better luck tomorrow!'}</h3>
            <p>The word was: <strong>{dailyWord.toUpperCase()}</strong></p>
            <p className="attempts-display">
              {won ? `${guesses.length}/${MAX_GUESSES} attempts` : `X/${MAX_GUESSES}`}
            </p>
          </div>

          <button className="share-btn" onClick={shareResult}>
            Share Result with Partner
          </button>
          {message && <p className="success-message">{message}</p>}

          <div className="compare-section">
            <h4>Compare Results</h4>
            <p>Both play today's puzzle, then share your results to see who won!</p>
            <p className="compare-note">Fewer attempts = Winner</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wordle;
