import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Tic Tac Toe Game - Modern Minimal React Implementation
 * Features:
 * - Player vs Player on same device
 * - 3x3 Board, restart button, game status, win/draw detection
 * - Winning combination highlight
 * - Responsive, centered layout, light minimal design
 * - Themed colors: primary (#1976d2), secondary (#424242), accent (#ff5722)
 */

// Theme color variables for custom theme (overrides main App.css)
const THEME = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ff5722",
  lightBg: "#f9fafe",
  boardBg: "#fff",
  border: "#e0e7ef",
  text: "#222",
  shadow: "0 2px 12px 0 rgba(25, 118, 210, 0.07)",
};

const initialSquares = Array(9).fill(null);

// PUBLIC_INTERFACE
function App() {
  // Board state
  const [squares, setSquares] = useState(initialSquares);
  // X is true if it's Player X turn, else Player O
  const [xIsNext, setXIsNext] = useState(true);
  // Array of indexes of the winning line, or null
  const [winningLine, setWinningLine] = useState(null);
  // Is draw?
  const [isDraw, setIsDraw] = useState(false);

  // Reset to initial state
  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(initialSquares);
    setXIsNext(true);
    setWinningLine(null);
    setIsDraw(false);
  }

  // Calculate winner and update winning state as board changes
  useEffect(() => {
    const res = calculateWinner(squares);
    if (res) {
      setWinningLine(res.line);
      setIsDraw(false);
    } else if (squares.every(Boolean)) {
      setWinningLine(null);
      setIsDraw(true);
    } else {
      setWinningLine(null);
      setIsDraw(false);
    }
  }, [squares]);

  // Click handler for squares
  function handleSquareClick(i) {
    if (squares[i] || winningLine) return; // Don't allow move if won or filled
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  // Prepare status message
  function getStatus() {
    if (winningLine) {
      const winner = squares[winningLine[0]];
      return (
        <span>
          <span style={{ color: THEME.accent, fontWeight: 600, letterSpacing: 0.5 }}>
            {winner}
          </span>{" "}
          wins!
        </span>
      );
    }
    if (isDraw) return <span>It's a Draw!</span>;
    return (
      <span>
        Turn:&nbsp;
        <span
          style={{
            color: THEME.primary,
            background: "rgba(25,118,210,0.07)",
            padding: "0.1em 0.6em",
            borderRadius: "0.8em",
            fontWeight: 600,
          }}
        >
          {xIsNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  // -- RENDER --
  return (
    <div style={styles.appBg}>
      <div style={styles.containerOuter}>
        <h1 style={styles.title}>Tic Tac Toe</h1>
        <div style={styles.statusBar}>{getStatus()}</div>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        <button style={styles.restartBtn} onClick={handleRestart} aria-label="Restart Game">
          Restart
        </button>
        <div style={styles.signature}>
          <span style={{ color: THEME.secondary, fontSize: "14px", opacity: 0.6 }}>
            Player vs Player • React
          </span>
        </div>
      </div>
    </div>
  );
}

// Board Component
function Board({ squares, onSquareClick, winningLine }) {
  function getSquareHighlight(i) {
    return winningLine && winningLine.includes(i);
  }
  return (
    <div style={styles.board}>
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          highlight={getSquareHighlight(i)}
          onClick={() => onSquareClick(i)}
        />
      ))}
    </div>
  );
}

// Square Component
function Square({ value, onClick, highlight }) {
  return (
    <button
      style={{
        ...styles.square,
        ...(highlight ? styles.squareHighlight : {}),
        color:
          value === "X"
            ? THEME.primary
            : value === "O"
            ? THEME.accent
            : THEME.secondary,
      }}
      onClick={onClick}
      aria-label={value ? `Square ${value}` : "Empty Square"}
    >
      {value}
    </button>
  );
}

// Calculate winner and return result {winner, line} or null
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Cols
    [0, 4, 8],
    [2, 4, 6], // Diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

/*
 * STYLES
 */
const styles = {
  appBg: {
    minHeight: "100vh",
    background: THEME.lightBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  containerOuter: {
    background: THEME.boardBg,
    border: `1.5px solid ${THEME.border}`,
    borderRadius: "22px",
    boxShadow: THEME.shadow,
    padding: "38px 22px 30px 22px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "340px",
    maxWidth: "94vw",
    margin: "auto",
    gap: 24,
  },
  title: {
    fontFamily: "inherit",
    fontWeight: 700,
    fontSize: "2rem",
    margin: "0 0 10px 0",
    color: THEME.primary,
    letterSpacing: 0.3,
    textAlign: "center",
    lineHeight: 1.2,
  },
  statusBar: {
    fontWeight: 500,
    fontSize: "1.18rem",
    minHeight: "2.1em",
    color: THEME.secondary,
    marginBottom: "2px",
    textAlign: "center",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(3, 1fr)",
    gap: "10px",
    width: "221px",
    height: "221px",
    margin: "16px 0",
    borderRadius: "16px",
    background: "#f5f8fe",
    boxShadow: "0 0.5px 1.5px rgba(25, 118, 210, 0.07)",
  },
  square: {
    width: "66px",
    height: "66px",
    fontSize: "2.1rem",
    fontWeight: "bold",
    background: "#fff",
    border: `2px solid ${THEME.border}`,
    borderRadius: "14px",
    outline: "none",
    cursor: "pointer",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    transition: "background .18s, color .11s, box-shadow .12s",
  },
  squareHighlight: {
    background: "linear-gradient(98deg, #fffbe9 80%, #ffe1b4 100%)",
    border: `2.5px solid ${THEME.accent}`,
    boxShadow: "0 0 0 2px #ff57221A",
    zIndex: 2,
    position: "relative",
  },
  restartBtn: {
    marginTop: "10px",
    background: THEME.primary,
    color: "#fff",
    border: "none",
    padding: "10px 36px",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "1.07rem",
    cursor: "pointer",
    boxShadow: "0 1.5px 7px 0 rgba(25,118,210,0.12)",
    transition: "background 0.16s, box-shadow 0.16s",
    letterSpacing: 0.4,
  },
  signature: {
    marginTop: "15px",
    opacity: 0.65,
    fontSize: "0.98em",
    letterSpacing: 0.06,
  },
};

export default App;
