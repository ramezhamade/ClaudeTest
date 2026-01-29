import { useState } from 'react';
import { loveLanguageQuiz } from '../../data/gameData';

function LoveLanguageQuiz({ settings }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    words: 0,
    time: 0,
    gifts: 0,
    service: 0,
    touch: 0,
  });
  const [showResults, setShowResults] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Results, setPlayer1Results] = useState(null);

  const partner1Name = settings.partner1Name || 'Partner 1';
  const partner2Name = settings.partner2Name || 'Partner 2';

  const loveLanguageNames = {
    words: 'Words of Affirmation',
    time: 'Quality Time',
    gifts: 'Receiving Gifts',
    service: 'Acts of Service',
    touch: 'Physical Touch',
  };

  const loveLanguageDescriptions = {
    words: 'You feel most loved when your partner expresses love through spoken or written words, compliments, and encouragement.',
    time: 'You feel most loved when your partner gives you undivided attention and spends meaningful time with you.',
    gifts: 'You feel most loved when your partner gives you thoughtful gifts and remembers special occasions.',
    service: 'You feel most loved when your partner does helpful things for you and takes care of your needs.',
    touch: 'You feel most loved through physical affection, hugs, holding hands, and closeness.',
  };

  const handleAnswer = (type) => {
    setAnswers((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));

    if (currentQuestion < loveLanguageQuiz.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const getTopLanguage = (results) => {
    return Object.entries(results).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  };

  const handleNextPlayer = () => {
    setPlayer1Results({ ...answers });
    setAnswers({
      words: 0,
      time: 0,
      gifts: 0,
      service: 0,
      touch: 0,
    });
    setCurrentQuestion(0);
    setShowResults(false);
    setCurrentPlayer(2);
  };

  const resetQuiz = () => {
    setAnswers({
      words: 0,
      time: 0,
      gifts: 0,
      service: 0,
      touch: 0,
    });
    setCurrentQuestion(0);
    setShowResults(false);
    setCurrentPlayer(1);
    setPlayer1Results(null);
  };

  if (showResults && player1Results) {
    const p1TopLang = getTopLanguage(player1Results);
    const p2TopLang = getTopLanguage(answers);

    return (
      <div className="game-container love-language-quiz">
        <h2>Your Results</h2>

        <div className="both-results">
          <div className="result-card">
            <h3>{partner1Name}</h3>
            <div className="top-language">
              <span className="language-name">{loveLanguageNames[p1TopLang]}</span>
            </div>
            <p className="language-desc">{loveLanguageDescriptions[p1TopLang]}</p>
            <div className="all-scores">
              {Object.entries(player1Results).map(([lang, score]) => (
                <div key={lang} className="score-bar">
                  <span className="lang-label">{loveLanguageNames[lang]}</span>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ width: `${(score / loveLanguageQuiz.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="result-card">
            <h3>{partner2Name}</h3>
            <div className="top-language">
              <span className="language-name">{loveLanguageNames[p2TopLang]}</span>
            </div>
            <p className="language-desc">{loveLanguageDescriptions[p2TopLang]}</p>
            <div className="all-scores">
              {Object.entries(answers).map(([lang, score]) => (
                <div key={lang} className="score-bar">
                  <span className="lang-label">{loveLanguageNames[lang]}</span>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ width: `${(score / loveLanguageQuiz.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="compatibility-insight">
          <h4>Relationship Insight</h4>
          {p1TopLang === p2TopLang ? (
            <p>You both share the same primary love language! This can make understanding each other's needs easier.</p>
          ) : (
            <p>
              You have different primary love languages. {partner1Name} prefers {loveLanguageNames[p1TopLang].toLowerCase()},
              while {partner2Name} prefers {loveLanguageNames[p2TopLang].toLowerCase()}.
              Understanding these differences can help you love each other better!
            </p>
          )}
        </div>

        <button className="reset-btn" onClick={resetQuiz}>
          Take Quiz Again
        </button>
      </div>
    );
  }

  if (showResults && !player1Results) {
    return (
      <div className="game-container love-language-quiz">
        <h2>{partner1Name}'s Done!</h2>
        <p className="pass-instruction">
          Pass the phone to {partner2Name} for their turn!
        </p>
        <button className="next-btn" onClick={handleNextPlayer}>
          Start {partner2Name}'s Quiz
        </button>
      </div>
    );
  }

  const question = loveLanguageQuiz[currentQuestion];

  return (
    <div className="game-container love-language-quiz">
      <h2>Love Language Quiz</h2>
      <div className="player-indicator">
        <span>{currentPlayer === 1 ? partner1Name : partner2Name}'s turn</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentQuestion + 1) / loveLanguageQuiz.length) * 100}%` }}
        />
      </div>
      <span className="progress-text">
        Question {currentQuestion + 1} of {loveLanguageQuiz.length}
      </span>

      <div className="question-card">
        <p className="question-text">{question.question}</p>
      </div>

      <div className="options-list">
        {question.options.map((option, index) => (
          <button
            key={index}
            className="option-btn"
            onClick={() => handleAnswer(option.type)}
          >
            {option.text}
          </button>
        ))}
      </div>

      <button className="reset-btn" onClick={resetQuiz}>
        Start Over
      </button>
    </div>
  );
}

export default LoveLanguageQuiz;
