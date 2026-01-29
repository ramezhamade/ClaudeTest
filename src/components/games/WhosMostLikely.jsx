import { useState } from 'react';
import { whosMostLikelyQuestions } from '../../data/gameData';

function WhosMostLikely({ settings }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState({ partner1: 0, partner2: 0 });
  const [showResult, setShowResult] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState([]);

  const getRandomQuestion = () => {
    const available = whosMostLikelyQuestions.filter((_, i) => !usedQuestions.includes(i));
    if (available.length === 0) {
      setUsedQuestions([]);
      return Math.floor(Math.random() * whosMostLikelyQuestions.length);
    }
    const randomIndex = whosMostLikelyQuestions.indexOf(
      available[Math.floor(Math.random() * available.length)]
    );
    return randomIndex;
  };

  const [questionIndex, setQuestionIndex] = useState(() => getRandomQuestion());

  const handleVote = (partner) => {
    setVotes((prev) => ({
      ...prev,
      [partner]: prev[partner] + 1,
    }));
    setShowResult(true);
  };

  const nextQuestion = () => {
    setUsedQuestions((prev) => [...prev, questionIndex]);
    setQuestionIndex(getRandomQuestion());
    setShowResult(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const resetGame = () => {
    setVotes({ partner1: 0, partner2: 0 });
    setCurrentIndex(0);
    setUsedQuestions([]);
    setQuestionIndex(getRandomQuestion());
    setShowResult(false);
  };

  const partner1Name = settings.partner1Name || 'Partner 1';
  const partner2Name = settings.partner2Name || 'Partner 2';

  return (
    <div className="game-container whos-most-likely">
      <h2>Who's Most Likely To...</h2>

      <div className="score-board">
        <div className="score">
          <span className="score-name">{partner1Name}</span>
          <span className="score-value">{votes.partner1}</span>
        </div>
        <div className="score">
          <span className="score-name">{partner2Name}</span>
          <span className="score-value">{votes.partner2}</span>
        </div>
      </div>

      <div className="question-card">
        <span className="question-number">Question {currentIndex + 1}</span>
        <p className="question-text">{whosMostLikelyQuestions[questionIndex]}</p>
      </div>

      {!showResult ? (
        <div className="vote-buttons">
          <button className="vote-btn partner1" onClick={() => handleVote('partner1')}>
            {partner1Name}
          </button>
          <button className="vote-btn partner2" onClick={() => handleVote('partner2')}>
            {partner2Name}
          </button>
        </div>
      ) : (
        <div className="result-section">
          <p className="result-text">Vote recorded!</p>
          <button className="next-btn" onClick={nextQuestion}>
            Next Question
          </button>
        </div>
      )}

      <button className="reset-btn" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}

export default WhosMostLikely;
