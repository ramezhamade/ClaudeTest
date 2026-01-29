import { useState, useEffect } from 'react';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// Common 5-letter words for validation
const VALID_WORDS = [
  'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again',
  'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alike', 'alive', 'allow', 'alone',
  'along', 'alter', 'among', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena',
  'argue', 'arise', 'array', 'aside', 'asset', 'audio', 'audit', 'avoid', 'award', 'aware',
  'badly', 'baker', 'bases', 'basic', 'basis', 'beach', 'began', 'begin', 'begun', 'being',
  'below', 'bench', 'billy', 'birth', 'black', 'blame', 'blind', 'block', 'blood', 'board',
  'boost', 'booth', 'bound', 'brain', 'brand', 'bread', 'break', 'breed', 'brief', 'bring',
  'broad', 'broke', 'brown', 'build', 'built', 'buyer', 'cable', 'calif', 'carry', 'catch',
  'cause', 'chain', 'chair', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child',
  'china', 'chose', 'civil', 'claim', 'class', 'clean', 'clear', 'click', 'clock', 'close',
  'coach', 'coast', 'could', 'count', 'court', 'cover', 'crack', 'craft', 'crash', 'cream',
  'crime', 'cross', 'crowd', 'crown', 'curve', 'cycle', 'daily', 'dance', 'dated', 'dealt',
  'death', 'debut', 'delay', 'depth', 'doing', 'doubt', 'dozen', 'draft', 'drama', 'drank',
  'dream', 'dress', 'drink', 'drive', 'drove', 'dying', 'early', 'earth', 'eight', 'elite',
  'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error', 'event', 'every', 'exact',
  'exist', 'extra', 'faith', 'false', 'fault', 'fiber', 'field', 'fifth', 'fifty', 'fight',
  'final', 'first', 'fixed', 'flash', 'fleet', 'floor', 'fluid', 'focus', 'force', 'forth',
  'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny', 'giant',
  'given', 'glass', 'globe', 'going', 'grace', 'grade', 'grand', 'grant', 'grass', 'great',
  'green', 'gross', 'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'harry',
  'heart', 'heavy', 'hence', 'henry', 'horse', 'hotel', 'house', 'human', 'ideal', 'image',
  'index', 'inner', 'input', 'issue', 'japan', 'jimmy', 'joint', 'jones', 'judge', 'juice',
  'known', 'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least',
  'leave', 'legal', 'level', 'lewis', 'light', 'limit', 'links', 'lives', 'local', 'logic',
  'loose', 'lower', 'lucky', 'lunch', 'lying', 'magic', 'major', 'maker', 'march', 'maria',
  'match', 'maybe', 'mayor', 'meant', 'media', 'metal', 'might', 'minor', 'minus', 'mixed',
  'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'movie', 'music',
  'needs', 'never', 'newly', 'night', 'noise', 'north', 'noted', 'novel', 'nurse', 'occur',
  'ocean', 'offer', 'often', 'order', 'other', 'ought', 'outer', 'owned', 'owner', 'oxide',
  'panel', 'paper', 'party', 'peace', 'peter', 'phase', 'phone', 'photo', 'piece', 'pilot',
  'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'point', 'pound', 'power', 'press',
  'price', 'pride', 'prime', 'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen',
  'quick', 'quiet', 'quite', 'radio', 'raise', 'range', 'rapid', 'ratio', 'reach', 'ready',
  'refer', 'right', 'rival', 'river', 'robin', 'roger', 'roman', 'rough', 'round', 'route',
  'royal', 'rural', 'scale', 'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall',
  'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shirt', 'shock', 'shoot',
  'shore', 'short', 'shown', 'sight', 'simon', 'since', 'sixth', 'sixty', 'sized', 'skill',
  'sleep', 'slide', 'small', 'smart', 'smile', 'smith', 'smoke', 'solid', 'solve', 'sorry',
  'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend', 'spent', 'split', 'spoke',
  'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam', 'steel', 'stick',
  'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story', 'strip', 'stuck', 'study',
  'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'table', 'taken', 'taste', 'taxes',
  'teach', 'teeth', 'terry', 'texas', 'thank', 'theft', 'their', 'theme', 'there', 'these',
  'thick', 'thing', 'think', 'third', 'those', 'three', 'threw', 'throw', 'tight', 'times',
  'tired', 'title', 'today', 'topic', 'total', 'touch', 'tough', 'tower', 'track', 'trade',
  'train', 'treat', 'trend', 'trial', 'tribe', 'trick', 'tried', 'tries', 'truck', 'truly',
  'trust', 'truth', 'twice', 'under', 'undue', 'union', 'unity', 'until', 'upper', 'upset',
  'urban', 'usage', 'usual', 'valid', 'value', 'video', 'virus', 'visit', 'vital', 'voice',
  'waste', 'watch', 'water', 'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose',
  'width', 'woman', 'women', 'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wound',
  'write', 'wrong', 'wrote', 'yield', 'young', 'youth', 'loved', 'lover', 'heart', 'sweet',
  'honey', 'angel', 'bless', 'bliss', 'charm', 'cuddy', 'darla', 'flame', 'flirt', 'happy',
];

function Wordle({ settings, onGameEnd }) {
  const [gamePhase, setGamePhase] = useState('setup'); // setup, playing, gameover
  const [secretWord, setSecretWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [setter, setSetter] = useState(1); // which player sets the word

  const partner1Name = settings.partner1Name || 'Player 1';
  const partner2Name = settings.partner2Name || 'Player 2';
  const setterName = setter === 1 ? partner1Name : partner2Name;
  const guesserName = setter === 1 ? partner2Name : partner1Name;

  const handleSetWord = (e) => {
    e.preventDefault();
    const word = secretWord.toLowerCase().trim();

    if (word.length !== WORD_LENGTH) {
      setMessage(`Word must be ${WORD_LENGTH} letters`);
      return;
    }

    if (!/^[a-z]+$/.test(word)) {
      setMessage('Word must contain only letters');
      return;
    }

    setMessage('');
    setGamePhase('playing');
  };

  const getLetterStatus = (guess, index) => {
    const letter = guess[index];
    if (secretWord[index] === letter) {
      return 'correct';
    }
    if (secretWord.includes(letter)) {
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

    if (guess === secretWord) {
      setGamePhase('gameover');
      if (onGameEnd) {
        onGameEnd(setter === 1 ? 'partner2' : 'partner1', 'wordle');
      }
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGamePhase('gameover');
      if (onGameEnd) {
        onGameEnd(setter === 1 ? 'partner1' : 'partner2', 'wordle');
      }
    }
  };

  const resetGame = (switchPlayers = true) => {
    setGamePhase('setup');
    setSecretWord('');
    setGuesses([]);
    setCurrentGuess('');
    setMessage('');
    if (switchPlayers) {
      setSetter(setter === 1 ? 2 : 1);
    }
  };

  const won = guesses.length > 0 && guesses[guesses.length - 1] === secretWord;

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

  const keyboardStatus = getKeyboardStatus();
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  if (gamePhase === 'setup') {
    return (
      <div className="game-container wordle-game">
        <h2>Wordle</h2>
        <p className="game-subtitle">One sets the word, one guesses!</p>

        <div className="wordle-setup">
          <div className="player-indicator">
            <strong>{setterName}</strong> sets the word
          </div>
          <p className="pass-instruction">Pass the phone to {setterName} to set a secret word</p>

          <form onSubmit={handleSetWord}>
            <input
              type="text"
              value={secretWord}
              onChange={(e) => setSecretWord(e.target.value.slice(0, WORD_LENGTH))}
              placeholder="Enter 5-letter word"
              className="wordle-input"
              autoComplete="off"
              maxLength={WORD_LENGTH}
            />
            {message && <p className="error-message">{message}</p>}
            <button type="submit" className="next-btn">Set Word</button>
          </form>
        </div>
      </div>
    );
  }

  if (gamePhase === 'playing') {
    return (
      <div className="game-container wordle-game">
        <h2>Wordle</h2>
        <div className="player-indicator">
          <strong>{guesserName}</strong> is guessing
        </div>

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
      </div>
    );
  }

  return (
    <div className="game-container wordle-game">
      <h2>Wordle</h2>

      <div className={`result-card ${won ? 'match' : 'no-match'}`}>
        <h3>{won ? `${guesserName} got it!` : `${setterName} wins!`}</h3>
        <p>The word was: <strong>{secretWord.toUpperCase()}</strong></p>
        <p>{won ? `Guessed in ${guesses.length} tries` : 'Better luck next time!'}</p>
      </div>

      <div className="wordle-board">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="wordle-row">
            {guess.split('').map((letter, colIndex) => (
              <div
                key={colIndex}
                className={`wordle-cell ${getLetterStatus(guess, colIndex)}`}
              >
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="next-btn" onClick={() => resetGame(true)}>
          Play Again (Switch Roles)
        </button>
        <button className="skip-btn" onClick={() => resetGame(false)}>
          Play Again (Same Roles)
        </button>
      </div>
    </div>
  );
}

export default Wordle;
