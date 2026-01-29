import { useState } from 'react';

function TicTacToe({ settings }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const partner1Name = settings.partner1Name || 'Partner 1';
  const partner2Name = settings.partner2Name || 'Partner 2';

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const result = calculateWinner(board);
  const winner = result?.winner;
  const winningLine = result?.line || [];
  const isDraw = !winner && board.every((square) => square !== null);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const newResult = calculateWinner(newBoard);
    if (newResult) {
      setScores((prev) => ({
        ...prev,
        [newResult.winner]: prev[newResult.winner] + 1,
      }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
    resetGame();
  };

  const getStatus = () => {
    if (winner) {
      const winnerName = winner === 'X' ? partner1Name : partner2Name;
      return `${winnerName} wins!`;
    }
    if (isDraw) {
      return "It's a draw!";
    }
    const currentPlayer = isXNext ? partner1Name : partner2Name;
    return `${currentPlayer}'s turn (${isXNext ? 'X' : 'O'})`;
  };

  return (
    <div className="game-container tic-tac-toe">
      <h2>Tic Tac Toe</h2>
      <p className="game-subtitle">Winner picks the next date activity!</p>

      <div className="ttt-scores">
        <div className={`ttt-score ${isXNext && !winner ? 'active' : ''}`}>
          <span className="player-symbol">X</span>
          <span className="player-name">{partner1Name}</span>
          <span className="player-score">{scores.X}</span>
        </div>
        <div className={`ttt-score ${!isXNext && !winner ? 'active' : ''}`}>
          <span className="player-symbol">O</span>
          <span className="player-name">{partner2Name}</span>
          <span className="player-score">{scores.O}</span>
        </div>
      </div>

      <div className="game-status">
        <p>{getStatus()}</p>
      </div>

      <div className="ttt-board">
        {board.map((square, index) => (
          <button
            key={index}
            className={`ttt-cell ${square} ${winningLine.includes(index) ? 'winning' : ''}`}
            onClick={() => handleClick(index)}
            disabled={!!square || !!winner}
          >
            {square}
          </button>
        ))}
      </div>

      <div className="ttt-buttons">
        <button className="next-btn" onClick={resetGame}>
          {winner || isDraw ? 'Play Again' : 'Reset Board'}
        </button>
        <button className="reset-btn" onClick={resetScores}>
          Reset Scores
        </button>
      </div>

      {(winner || isDraw) && (
        <div className="game-over-message">
          {winner && (
            <p className="prize-reminder">
              {winner === 'X' ? partner1Name : partner2Name} gets to pick the next date activity!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default TicTacToe;
