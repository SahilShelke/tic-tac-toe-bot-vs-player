const board = document.getElementById('board');
const restartButton = document.getElementById('restart');
const status = document.getElementById('status');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const handleCellClick = (e) => {
  const cell = e.target;
  const index = parseInt(cell.getAttribute('data-cell'));

  if (gameState[index] !== '' || !gameActive) return;

  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);

  if (checkWin()) {
    status.textContent = `${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    status.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `${currentPlayer}'s turn`;

  if (currentPlayer === 'O' && gameActive) {
    setTimeout(botTurn, 500); // Adjusted delay for bot's response
  }
};

const checkWin = () => {
  return winningConditions.some(condition => {
    return condition.every(index => {
      return gameState[index] === currentPlayer;
    });
  });
};

const checkDraw = () => {
  return gameState.every(cell => cell !== '');
};

const botTurn = () => {
  let bestMove = getBestMove();

  gameState[bestMove] = currentPlayer;
  const botCell = document.querySelector(`[data-cell="${bestMove}"]`);
  botCell.textContent = currentPlayer;
  botCell.classList.add(currentPlayer);

  if (checkWin()) {
    status.textContent = `${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    status.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `${currentPlayer}'s turn`;
};

const getBestMove = () => {
  // Initialize best move with a very low score for maximizing bot's winning chances
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] === '') {
      gameState[i] = currentPlayer;
      let score = minimax(gameState, 0, false); // Depth starts from 0 for initial move
      gameState[i] = '';

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};

const minimax = (gameState, depth, isMaximizing) => {
  if (checkWinning(gameState, 'X')) {
    return -10 + depth; // Bot wins
  } else if (checkWinning(gameState, 'O')) {
    return 10 - depth; // Player wins
  } else if (checkDraw(gameState)) {
    return 0; // It's a draw
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < gameState.length; i++) {
      if (gameState[i] === '') {
        gameState[i] = 'O';
        let score = minimax(gameState, depth + 1, false);
        gameState[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < gameState.length; i++) {
      if (gameState[i] === '') {
        gameState[i] = 'X';
        let score = minimax(gameState, depth + 1, true);
        gameState[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const checkWinning = (gameState, player) => {
  return winningConditions.some(condition => {
    return condition.every(index => {
      return gameState[index] === player;
    });
  });
};

const restartGame = () => {
  currentPlayer = 'X';
  gameActive = true;
  gameState = ['', '', '', '', '', '', '', '', ''];
  status.textContent = `${currentPlayer}'s turn`;

  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');
  });
};

const emptyCells = (gameState) => {
  return gameState.reduce((acc, val, index) => {
    if (val === '') acc.push(index);
    return acc;
  }, []);
};

board.addEventListener('click', handleCellClick);
restartButton.addEventListener('click', restartGame);
status.textContent = `${currentPlayer}'s turn`;
