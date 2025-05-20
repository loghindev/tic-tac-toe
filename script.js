const gameboard = document.querySelector(".gameboard");
const p1Name = document.querySelector(".scoreboard .player-1 .name");
const p2Name = document.querySelector(".scoreboard .player-2 .name");
const p1Spinner = document.querySelector(".scoreboard .player-1 .spinner");
const p2Spinner = document.querySelector(".scoreboard .player-2 .spinner");
const p1Score = document.querySelector(".scoreboard .player-1 .value");
const p2Score = document.querySelector(".scoreboard .player-2 .value");
const tieScore = document.querySelector(".scoreboard .tie .value");

const THREE = 3;
const player1 = ["X", "O"][Math.floor(Math.random() * 2)];
const player2 = player1 === "X" ? "0" : "X";
let current = [player1, player2][Math.floor(Math.random() * 2)];

let gameOver = false;

document.addEventListener("DOMContentLoaded", () => {
  generateGameboard();
  loadUsernames();
  whichTurn(current);
});

function generateGameboard() {
  for (let r = 0; r < THREE; ++r) {
    for (let c = 0; c < THREE; ++c) {
      const cell = document.createElement("div");
      cell.classList = "cell";
      cell.addEventListener("click", setCell);
      gameboard.appendChild(cell);
    }
  }
}

function setCell(event) {
  if (event.target.textContent !== "" || gameOver) return;
  event.target.textContent = current;
  updateCurrent();
}

function loadUsernames() {
  p1Name.textContent = `Player 1 (${player1})`;
  p2Name.textContent = `Player 2 (${player2})`;
}

function updateCurrent() {
  current === player1 ? (current = player2) : (current = player1);
  whichTurn(current);
}

function whichTurn(subject) {
  if (subject === player1) {
    p1Spinner.classList.replace("d-none", "thinking");
    p2Spinner.classList.replace("thinking", "d-none");
  } else if (subject === player2) {
    p2Spinner.classList.replace("d-none", "thinking");
    p1Spinner.classList.replace("thinking", "d-none");
  }
}
