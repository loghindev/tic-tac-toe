const gameboard = document.querySelector(".gameboard");

const THREE = 3;

document.addEventListener("DOMContentLoaded", () => {
  generateGameboard();
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
  console.log(event.target);
}
