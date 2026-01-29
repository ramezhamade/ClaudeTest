import { useState } from 'react';
import { truthOrDareQuestions } from '../../data/gameData';

function TruthOrDare({ settings }) {
  const [currentType, setCurrentType] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [usedTruths, setUsedTruths] = useState([]);
  const [usedDares, setUsedDares] = useState([]);

  const getRandomQuestion = (type) => {
    const questions = truthOrDareQuestions[type];
    const used = type === 'truth' ? usedTruths : usedDares;
    const available = questions.filter((_, i) => !used.includes(i));

    if (available.length === 0) {
      if (type === 'truth') {
        setUsedTruths([]);
      } else {
        setUsedDares([]);
      }
      return questions[Math.floor(Math.random() * questions.length)];
    }

    const randomQ = available[Math.floor(Math.random() * available.length)];
    const index = questions.indexOf(randomQ);

    if (type === 'truth') {
      setUsedTruths((prev) => [...prev, index]);
    } else {
      setUsedDares((prev) => [...prev, index]);
    }

    return randomQ;
  };

  const handleChoice = (type) => {
    const question = getRandomQuestion(type);
    setCurrentType(type);
    setCurrentQuestion(question);
  };

  const reset = () => {
    setCurrentType(null);
    setCurrentQuestion('');
  };

  const partner1Name = settings.partner1Name || 'Partner 1';
  const partner2Name = settings.partner2Name || 'Partner 2';

  return (
    <div className="game-container truth-or-dare">
      <h2>Truth or Dare</h2>
      <p className="game-instruction">
        Take turns choosing between Truth or Dare!
      </p>

      {!currentType ? (
        <div className="choice-buttons">
          <button className="choice-btn truth-btn" onClick={() => handleChoice('truth')}>
            Truth
          </button>
          <button className="choice-btn dare-btn" onClick={() => handleChoice('dare')}>
            Dare
          </button>
        </div>
      ) : (
        <div className="question-display">
          <div className={`question-card ${currentType}`}>
            <span className="question-type">{currentType.toUpperCase()}</span>
            <p className="question-text">{currentQuestion}</p>
          </div>
          <div className="action-buttons">
            <button className="done-btn" onClick={reset}>
              Done! Next Turn
            </button>
            <button className="skip-btn" onClick={() => handleChoice(currentType)}>
              Skip (Get Another)
            </button>
          </div>
        </div>
      )}

      <div className="tod-tips">
        <h4>Tips:</h4>
        <ul>
          <li>Be honest with your truths!</li>
          <li>Actually do the dares (within reason)</li>
          <li>Have fun and don't take it too seriously</li>
        </ul>
      </div>
    </div>
  );
}

export default TruthOrDare;
