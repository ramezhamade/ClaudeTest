import { useState } from 'react';
import { wouldYouRatherQuestions } from '../../data/gameData';

function WouldYouRather({ settings }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [matchCount, setMatchCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const partner1Name = settings.partner1Name || 'Partner 1';
  const partner2Name = settings.partner2Name || 'Partner 2';

  const currentQuestion = wouldYouRatherQuestions[currentIndex];
  const options = currentQuestion.replace('Would you rather ', '').split(' or ');

  const handleChoice = (choice) => {
    if (currentPlayer === 1) {
      setPlayer1Choice(choice);
      setCurrentPlayer(2);
    } else {
      setPlayer2Choice(choice);
    }
  };

  const nextQuestion = () => {
    if (player1Choice === player2Choice) {
      setMatchCount((prev) => prev + 1);
    }
    setTotalAnswered((prev) => prev + 1);
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setCurrentPlayer(1);
    setCurrentIndex((prev) => (prev + 1) % wouldYouRatherQuestions.length);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setCurrentPlayer(1);
    setMatchCount(0);
    setTotalAnswered(0);
  };

  const bothAnswered = player1Choice !== null && player2Choice !== null;
  const isMatch = bothAnswered && player1Choice === player2Choice;

  return (
    <div className="game-container would-you-rather">
      <h2>Would You Rather</h2>

      {totalAnswered > 0 && (
        <div className="compatibility-score">
          <span className="score-label">Compatibility</span>
          <span className="score-percent">
            {Math.round((matchCount / totalAnswered) * 100)}%
          </span>
          <span className="score-detail">
            {matchCount} / {totalAnswered} matches
          </span>
        </div>
      )}

      <div className="current-player-indicator">
        {!bothAnswered && (
          <p>
            {currentPlayer === 1 ? partner1Name : partner2Name}'s turn to choose
            <span className="pass-phone">(pass the phone after choosing!)</span>
          </p>
        )}
      </div>

      <div className="question-card">
        <p className="question-text">{currentQuestion}</p>
      </div>

      {!bothAnswered ? (
        <div className="option-buttons">
          <button
            className="option-btn"
            onClick={() => handleChoice('option1')}
          >
            {options[0]}
          </button>
          <span className="or-divider">OR</span>
          <button
            className="option-btn"
            onClick={() => handleChoice('option2')}
          >
            {options[1]?.replace('?', '')}
          </button>
        </div>
      ) : (
        <div className="result-display">
          <div className={`result-card ${isMatch ? 'match' : 'no-match'}`}>
            <h3>{isMatch ? 'You matched!' : 'Different choices!'}</h3>
            <div className="choices-display">
              <div className="player-choice">
                <span className="player-name">{partner1Name}</span>
                <span className="chosen-option">
                  {player1Choice === 'option1' ? options[0] : options[1]?.replace('?', '')}
                </span>
              </div>
              <div className="player-choice">
                <span className="player-name">{partner2Name}</span>
                <span className="chosen-option">
                  {player2Choice === 'option1' ? options[0] : options[1]?.replace('?', '')}
                </span>
              </div>
            </div>
          </div>
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

export default WouldYouRather;
