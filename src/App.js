import React from 'react';
import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  console.log(highlight)
  const className = `square ${highlight ? 'highlight' : ''}`;
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    let col = i % 3 + 1;
    let row = Math.floor(i / 3) + 1;
    const nextColRow = [col, row];
    onPlay(nextSquares, nextColRow);
  }

  const winner = calculateWinner(squares);
  const winnerInfo = calculateWinner(squares);

  let status;
  if (winner && winner.winner) {
    status = 'Winner: ' + winner.winner;
  } else if (winner && winner.isDraw) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

// 勝利マスをハイライトするための配列を生成
const highlight = squares.map((_, index) =>
  winnerInfo && winnerInfo.winningSquares.includes(index));

  // 2重ループでマス目を生成
  return (
    <div>
      <div className="status">{status}</div>
      {Array(3).fill(null).map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {Array(3).fill(null).map((col, colIndex) => {
            const squareIndex = rowIndex * 3 + colIndex;
            return (
              <Square key={squareIndex} value={squares[squareIndex]} onSquareClick={() => handleClick(squareIndex)} highlight={highlight[squareIndex]}/>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  // const [history, setHistory] = useState([Array(9).fill(null)]);
  const [history, setHistory] = useState([[Array(9).fill(null)]]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove][0];
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares, nextColRow) {
    const nextHistory = [...history.slice(0, currentMove + 1), [nextSquares, nextColRow]];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((position, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move +  '(' + position[1][0] + ',' + position[1][1] + ')';
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <a>You are at move #{move}</a>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });


  if (!isAscending) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div>
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? '昇順に表示' : '降順に表示'}
        </button>
      </div>
      <div className="game-info">
        <ol　className="moves-list">{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  // 引き分けの判定
  const isDraw = squares.every(square => square !== null);
  if (isDraw) {
    return { winner: null, winningSquares: [], isDraw: true };
  }

  return null;
}
