const gameboard = document.querySelector(".gameboard");
const p1Name = document.querySelector(".scoreboard .player-1 .name");
const p2Name = document.querySelector(".scoreboard .player-2 .name");
const p1Spinner = document.querySelector(".scoreboard .player-1 .spinner");
const p2Spinner = document.querySelector(".scoreboard .player-2 .spinner");
const p1Score = document.querySelector(".scoreboard .player-1 .value");
const p2Score = document.querySelector(".scoreboard .player-2 .value");
const tieScore = document.querySelector(".scoreboard .tie .value");
const toggleOpponentBtn = document.querySelector(".toggle-opponent p");
const bulb = document.querySelector(".bulb");

const THREE = 3;
const player1 = ["X", "O"][Math.floor(Math.random() * 2)];
const player2 = player1 === "X" ? "0" : "X";
let current = [player1, player2][Math.floor(Math.random() * 2)];

let gameOver = false;
let moves = 0;

document.addEventListener("DOMContentLoaded", () => {
  generateGameboard();
  loadUsernames();
  whichTurn(current);
  handleOpponentToggler();
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
  ++moves;
  checkWinner();
  updateCurrent();
}

function loadUsernames() {
  p1Name.textContent = `Player 1 (${player1})`;
  p2Name.textContent = `Player 2 (${player2})`;
}

function updateCurrent() {
  if (!gameOver) {
    current === player1 ? (current = player2) : (current = player1);
    whichTurn(current);
  } else {
    whichTurn("END");
  }
}

function whichTurn(subject) {
  if (subject === player1) {
    p1Spinner.classList.replace("d-none", "thinking");
    p2Spinner.classList.replace("thinking", "d-none");
  } else if (subject === player2) {
    p2Spinner.classList.replace("d-none", "thinking");
    p1Spinner.classList.replace("thinking", "d-none");
  } else if (subject === "END") {
    // just get rid of both spinners
    [p1Spinner, p2Spinner].forEach((spinner) =>
      spinner.classList.replace("thinking", "d-none")
    );
  }
}

function checkWinner() {
  const cells = document.querySelectorAll(".gameboard .cell");
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
  for (let array of winnerCombos) {
    if (
      cells[array[0]].textContent === cells[array[1]].textContent &&
      cells[array[1]].textContent === cells[array[2]].textContent &&
      cells[array[0]].textContent !== ""
    ) {
      console.log("Check");
      gameOver = true;
      updateScore(cells[array[0]].textContent);
      return setTimeout(restart, 2500);
    }
  }
  if (moves === THREE * THREE && !gameOver) {
    gameOver = true;
    updateScore(tieScore);
    setTimeout(restart, 2500);
  }
}

function blink(text) {
  text.classList.add("blink");
  text.addEventListener("animationend", () => {
    text.classList.remove("blink");
  });
}

function increase(score) {
  let value = parseInt(score.textContent);
  score.textContent = (++value).toString();
  blink(score);
}

function updateScore(winner) {
  if (winner === player1) {
    increase(p1Score);
  } else if (winner === player2) {
    increase(p2Score);
  } else {
    increase(tieScore);
  }
}

function restart() {
  const usedCells = Array.from(
    document.querySelectorAll(".gameboard .cell")
  ).filter((cell) => cell.textContent !== "");
  usedCells.forEach((cell) => (cell.textContent = ""));
  gameOver = false;
  moves = 0;
}

function handleOpponentToggler() {
  toggleOpponentBtn.addEventListener("click", () => {
    bulb.classList.toggle("d-none");
  });
}
