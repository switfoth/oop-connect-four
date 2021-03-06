import Game from "./game.js";

let game = undefined;
const gameBoard = document.getElementById("board-holder");
const playArea = document.getElementById("click-targets");

const checkAllSquares = () => {
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      let selectSquare = document.getElementById(`square-${row}-${col}`);
      selectSquare.innerHTML = "";
      let checkSquare = game.getTokenAt(col, row);

      if (checkSquare === 1) {
        let tempDiv = document.createElement("div");
        tempDiv.classList.add("token", "red");
        selectSquare.appendChild(tempDiv);
      } else if (checkSquare === 2) {
        let tempDiv = document.createElement("div");
        tempDiv.classList.add("token", "black");
        selectSquare.appendChild(tempDiv);
      }
    }
  }
};

const revealBoard = () => {
  game === undefined
    ? gameBoard.classList.add("is-invisible")
    : (gameBoard.classList.remove("is-invisible"),
      (document.getElementById(
        "game-name"
      ).innerHTML = `<h1>${game.getName()}</h1>`));
};

const changePlayerColor = () => {
  let currentPlayer = game.currentPlayer;
  currentPlayer === 1
    ? (playArea.classList.remove("black"), playArea.classList.add("red"))
    : (playArea.classList.remove("red"), playArea.classList.add("black"));
};

const handlePlayerMove = (index, invalidMove) => {
  !invalidMove
    ? changePlayerColor()
    : document.getElementById(`column-${index}`).classList.add("full");
};

const updateUI = (index) => {
  let invalidMove = false;
  game.checkForWinConditions();
  checkAllSquares();
  index === undefined || game.winnerNumber !== 0
    ? revealBoard()
    : ((invalidMove = game.isColumnFull(index)),
      handlePlayerMove(index, invalidMove));
};

window.addEventListener("DOMContentLoaded", () => {
  const P1 = document.getElementById("player-1-name");
  const P2 = document.getElementById("player-2-name");
  const newGameButton = document.getElementById("new-game");
  const disableNewGameButton = () => {
    newGameButton.disabled = P1.value === "" && P2.value === "" ? true : false;
  };

  P1.addEventListener("keyup", disableNewGameButton);
  P2.addEventListener("keyup", disableNewGameButton);

  newGameButton.addEventListener("click", () => {
    game = new Game(P1.value, P2.value);
    P1.value = "";
    P2.value = "";
    newGameButton.disabled = true;

    updateUI();
  });

  playArea.addEventListener("click", (event) => {
    if (game.winnerNumber !== 0) return;

    let element = event.target.id;
    if (!element.startsWith("column-")) return;
    let columnIndex = Number.parseInt(element[element.length - 1]);

    game.playInColumn(columnIndex);
    updateUI(columnIndex);
  });
});
