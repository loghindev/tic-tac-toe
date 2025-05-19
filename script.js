const gameboard = document.querySelector(".gameboard");
const p1Spinner = document.querySelector(".scoreboard .player-1 .spinner");
const p2Spinner = document.querySelector(".scoreboard .player-2 .spinner");

const THREE = 3;
const player1 = ["X", "O"][Math.floor(Math.random() * 2)];
const player2 = player1 === "X" ? "0" : "X";
let current = [player1, player2][Math.floor(Math.random() * 2)];

document.addEventListener("DOMContentLoaded", () => {
  generateGameboard();
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
  event.target.textContent = current;
  updateCurrent();
}

function updateCurrent() {
  current === player1 ? (current = player2) : (current = player1);
  whichTurn(current);
}

function whichTurn(subject) {
  if (subject === player1) {
    p1Spinner.classList.replace("d-none", "thinking");
    p2Spinner.classList.replace("thinking", "d-none");
  } else {
    p2Spinner.classList.replace("d-none", "thinking");
    p1Spinner.classList.replace("thinking", "d-none");
  }
}
