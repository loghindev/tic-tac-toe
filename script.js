const gameboard = document.querySelector(".gameboard");
const player1Loader = document.querySelector(".scoreboard .player-1 .loader");
const player2Loader = document.querySelector(".scoreboard .player-2 .loader");
const player1Name = document.querySelector(".scoreboard .player-1 .name");
const player2Name = document.querySelector(".scoreboard .player-2 .name");
const player1Score = document.querySelector(".scoreboard .player-1 .value");
const player2Score = document.querySelector(".scoreboard .player-2 .value");
const tieScore = document.querySelector(".scoreboard .tie .value");
const pop1 = new Audio("./assets/audio_pop1.mp3");
const pop2 = new Audio("./assets/audio_pop2.mp3");
const pop3 = new Audio("./assets/audio_pop3.mp3");
const THREE = 3;
const players = ["X", "0"];
const player1 = players[Math.floor(Math.random() * 2)];
const player2 = player1 === "X" ? "0" : "X";
let current = [player1, player2][Math.floor(Math.random() * 2)];
let gameOver = false;
let moves = 0;
let opponent = localStorage.getItem("opponent") || "computer"; // default
let audio = localStorage.getItem("audio");

document.addEventListener("DOMContentLoaded", () => {
  setScoreboard();
  setGameboard();
  handleInteractions();
});

function updatePlayersNames() {
  player1Name.textContent = `Player 1 (${player1})`;
  player2Name.textContent = `${
    opponent === "computer" ? "Computer" : "Player"
  } (${player2})`;
}

function setScoreboard() {
  updatePlayersNames();
  updateSpinner();
}

function updateSpinner() {
  [player1Loader, player2Loader].forEach((loader) => {
    loader.style.visiblity = "hidden";
    loader.style.opacity = "0";
  });
  if (current === player1) {
    player1Loader.style.visibility = "visible";
    player1Loader.style.opacity = "1";
  } else {
    player2Loader.style.visibility = "visible";
    player2Loader.style.opacity = "1";
  }
}

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
  current === player1 ? runEffect(pop1) : runEffect(pop2);
  ++moves;
  checkWinner();
  if (!gameOver) {
    updateCurrent();
    updateSpinner();
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
      return endGame(cells[array[0]], cells[array[1]], cells[array[2]]);
    }
  }
  // TIE
  if (moves === THREE * THREE && !gameOver) {
    endGame(...cells);
  }
}

function increment(score) {
  let value = Number(score.textContent);
  score.textContent = (++value).toString();
}

function animateScore(score) {
  score.classList.add("animate-score");
  score.addEventListener("animationend", () => {
    score.classList.remove("animate-score");
  });
}

function animateGamePieces(pieces) {
  pieces.forEach((piece, index) =>
    setTimeout(
      () => {
        piece.classList.add("blink");
        runEffect([pop1, pop2, pop3][Math.floor(Math.random() * 3)]);
      },
      pieces.length === THREE * THREE ? 120 * index : 300 * index
    )
  );
}

function endGame(...pieces) {
  setTimeout(restartGame, 2500);
  setTimeout(() => {
    animateGamePieces(pieces);
  }, 300);
  gameOver = true;
  if (pieces.length === THREE * THREE) {
    increment(tieScore), animateScore(tieScore);
  } else {
    current === player1
      ? (increment(player1Score), animateScore(player1Score))
      : (increment(player2Score), animateScore(player2Score));
  }
}

function restartGame() {
  gameboard.innerHTML = null;
  gameOver = false;
  moves = 0;
  current = [player1, player2][Math.floor(Math.random() * 2)];
  setScoreboard();
  setGameboard();
}
function runEffect(sound) {
  if (!audio) return;
  sound.currentTime = 0;
  sound.play();
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

// header
function handleInteractions() {
  handleSwitchOpponents();
  handleSwitchAudio();
}
// localStorage.clear();
function handleSwitchOpponents() {
  const opponents = document.querySelector("header .opponents");
  // initial behavior - when page loads
  if (opponent === "computer") {
    opponents.children[1].classList.add("active-opponent");
  } else if (opponent === "human") {
    opponents.children[0].classList.add("active-opponent");
  }
  // click events
  opponents.addEventListener("click", (event) => {
    // fixed: accidentally clicking on parent node 'div.opponents'
    if (event.target.classList.contains("opponents")) return;
    [...opponents.children].forEach((type) =>
      type.classList.remove("active-opponent")
    );
    event.target.classList.add("active-opponent");
    let opponentToSet = event.target.getAttribute("class").split(" ")[0];
    opponent = opponentToSet;
    localStorage.setItem("opponent", opponentToSet);
    updatePlayersNames();
  });
}

function toggleAudioIcons(parent) {
  [...parent.children].forEach((icon) => (icon.style.display = "none"));
  if (audio) {
    parent.children[0].style.display = "block";
  } else {
    parent.children[1].style.display = "block";
  }
}

function handleSwitchAudio() {
  const audioIcons = document.querySelector(".audio");
  if (audio === null || localStorage.getItem("audio") === "true") {
    // if localStorage() is null, true (audio on) is deafult
    audio = true;
  } else {
    audio = false;
  }
  toggleAudioIcons(audioIcons);
  audioIcons.addEventListener("click", () => {
    audio = !audio;
    localStorage.setItem("audio", audio);
    toggleAudioIcons(audioIcons);
  });
}
