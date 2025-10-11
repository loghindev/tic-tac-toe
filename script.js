const gameboard = document.querySelector(".gameboard");
const THREE = 3;
const players = ["X", "0"];
const player1 = players[Math.floor(Math.random() * 2)];
const player2 = player1 === "X" ? "0" : "X";
let current = [player1, player2][Math.floor(Math.random() * 2)];
let gameOver = false;
let moves = 0;

document.addEventListener("DOMContentLoaded", setGameboard);

function setGameboard() {
  for (let r = 0; r < THREE; ++r) {
    for (let c = 0; c < THREE; ++c) {
      const newCell = document.createElement("div");
      newCell.classList = "cell";
      gameboard.appendChild(newCell);
    }
  }
  gameboard.addEventListener("mousedown", setPiece);
}

function setPiece(event) {
  if (event.target.textContent !== "" || gameOver) return;
  event.target.textContent = current;
  event.target.classList.add("fade-in");
  ++moves;
  checkWinner();
  if (!gameOver) {
    updateCurrent();
  }
}

function updateCurrent() {
  current === player1 ? (current = player2) : (current = player1);
}

function checkWinner() {
  const cells = document.querySelectorAll(".gameboard .cell");
  for (let array of winnerCombos) {
    if (
      cells[array[0]].textContent === cells[array[1]].textContent &&
      cells[array[1]].textContent === cells[array[2]].textContent &&
      cells[array[0]].textContent !== ""
    ) {
      return endGame();
    }
  }
  // TIE
  if (moves === THREE * THREE && !gameOver) {
    endGame("tie");
  }
}

function endGame(status) {
  gameOver = true;
  setTimeout(() => {
    if (status === "tie") {
      alert(`TIE`);
    } else {
      alert(`Winner: ${current}`);
    }
  }, 100);
  setTimeout(restartGame, 1000);
}

function restartGame() {
  gameboard.innerHTML = null;
  gameOver = false;
  moves = 0;
  setGameboard();
}

const winnerCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
