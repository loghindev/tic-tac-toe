const gameboard = document.querySelector(".gameboard");
const startBtn = document.querySelector("#startBtn");
const p1Name = document.querySelector(".scoreboard .player-1 .name");
const p2Name = document.querySelector(".scoreboard .player-2 .name");
const p1Spinner = document.querySelector(".scoreboard .player-1 .spinner");
const p2Spinner = document.querySelector(".scoreboard .player-2 .spinner");
const p1Score = document.querySelector(".scoreboard .player-1 .value");
const p2Score = document.querySelector(".scoreboard .player-2 .value");
const tieScore = document.querySelector(".scoreboard .tie .value");
const toggleOpponentBtn = document.querySelector(".toggle-opponent p");
const bulb = document.querySelector(".bulb");
const audioContainer = document.querySelector(".audio-icons-wrapper");
const unmuted = document.querySelector("#unmuted");
const muted = document.querySelector("#muted");
const THREE = 3;
const restartDelay = 2500;
const player1 = ["X", "O"][Math.floor(Math.random() * 2)];
const player2 = player1 === "X" ? "0" : "X";
let current = [player1, player2][Math.floor(Math.random() * 2)];
let thinking = false;
let gameOver = false;
let gameStarted = false;
let moves = 0;
let botIsAwake = localStorage.getItem("awake") === "true" ? true : false;

const p1Bubble = new Audio("./effects/bubble-1.mp3");
const p2Bubble = new Audio("./effects/bubble-2.mp3");
const winnerBubble1 = new Audio("./effects/winner-bubble-1.mp3");
const winnerBubble2 = new Audio("./effects/winner-bubble-2.mp3");
const winnerBubble3 = new Audio("./effects/winner-bubble-3.mp3");
const effects = [
  p1Bubble,
  p2Bubble,
  winnerBubble1,
  winnerBubble2,
  winnerBubble3,
];

document.addEventListener("DOMContentLoaded", () => {
  generateGameboard();
  loadUsernames();
  handleOpponentToggler();
  handleAudioSettings();
  botIsAwake ? bulb.classList.remove("d-none") : bulb.classList.add("d-none");
  effects.forEach((effect) => {
    effect.addEventListener("canplaythrough", () => {});
    effect.load();
  });
  // start game button
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("fade-out");
    runEffect(winnerBubble3); // random choose
    startBtn.addEventListener("animationend", () => {
      startBtn.remove();
      gameStarted = true;
      whichTurn(current);
      botIsAwake && current === player2 && botMove();
    });
  });
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

function botMove() {
  thinking = true;
  ++moves;
  const botCell = chooseCell();
  setTimeout(() => {
    botCell.textContent = player2;
    botCell.classList.add("fade-in");
    runEffect(p2Bubble);
    checkWinner();
    updateCurrent();
    thinking = false;
  }, Math.random() * 888 + 666);
}

function setCell(event) {
  if (event.target.textContent !== "" || thinking || !gameStarted || gameOver)
    return;
  ++moves;
  event.target.classList.add("fade-in");
  if (current === player1) {
    event.target.textContent = player1;
    runEffect(p1Bubble);
  } else if (current === player2) {
    if (botIsAwake) {
      botMove();
    } else {
      event.target.textContent = player2;
      runEffect(p2Bubble);
    }
  }
  checkWinner();
  updateCurrent();
  botIsAwake && current === player2 && botMove();
}

function loadUsernames() {
  p1Name.textContent = `Player 1 (${player1})`;
  if (botIsAwake) {
    return (p2Name.textContent = `Computer (${player2})`);
  }
  p2Name.textContent = `Player 2 (${player2})`;
}

function updateCurrent() {
  if (gameOver) return whichTurn("END");
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
      gameOver = true;
      updateScore(cells[array[0]].textContent);
      setTimeout(() => {
        highlight(cells[array[0]], cells[array[1]], cells[array[2]]);
      }, 250);
      return setTimeout(restart, restartDelay);
    }
  }
  if (moves === THREE * THREE && !gameOver) {
    gameOver = true;
    updateScore(tieScore);
    setTimeout(() => {
      highlight(...cells);
    }, 250);
    setTimeout(restart, restartDelay);
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

function highlight(...pieces) {
  pieces.forEach((piece, index) => {
    setTimeout(() => {
      if (index === 1 && pieces.length === 3) runEffect(winnerBubble1);
      else if (index === 2 && pieces.length === 3) runEffect(winnerBubble2);
      else if (index === 3 && pieces.length === 3) runEffect(winnerBubble3);
      else {
        runEffect(
          [p1Bubble, p2Bubble, winnerBubble1, winnerBubble2, winnerBubble3][
            Math.floor(Math.random() * 3)
          ]
        );
      }
      piece.style.color = "#ff6600";
    }, 250 * index);
  }, restartDelay);
}

function restart() {
  const usedCells = Array.from(
    document.querySelectorAll(".gameboard .cell")
  ).filter((cell) => cell.textContent !== "");
  usedCells.forEach((cell) => {
    cell.classList.replace("fade-in", "fade-out");
    setTimeout(() => {
      cell.classList.remove("fade-out");
      cell.textContent = "";
      if (cell.hasAttribute("style")) {
        cell.removeAttribute("style");
      }
    }, 900);
  });
  setTimeout(() => {
    gameOver = false;
    moves = 0;
    current = [player1, player2][Math.floor(Math.random() * 2)];
    whichTurn(current);
    botIsAwake && current === player2 && botMove();
  }, 1000);
}

function handleOpponentToggler() {
  toggleOpponentBtn.addEventListener("click", () => {
    bulb.classList.toggle("d-none");
    botIsAwake = !botIsAwake;
    localStorage.setItem("awake", botIsAwake);
    loadUsernames();
    botIsAwake && current === player2 && botMove();
  });
}

function handleAudioSettings() {
  audioContainer.addEventListener("click", () => {
    [unmuted, muted].forEach((icon) => icon.classList.toggle("d-none"));
  });
}

function chooseCell() {
  const availableCells = Array.from(
    document.querySelectorAll(".gameboard .cell")
  ).filter((cell) => cell.textContent === "");
  return availableCells[Math.floor(Math.random() * availableCells.length)];
}

function runEffect(effect) {
  if (unmuted.classList.contains("d-none")) return;
  effect.currentTime = 0;
  effect.play();
}
