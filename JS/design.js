let container = document.querySelector(".game-container");
let row = document.querySelectorAll(".row");
let box = document.querySelectorAll(".box");
let itemText = document.querySelectorAll(".item-text");
let test = document.querySelector(".test-btn");
let gameOverModal = document.querySelector(".gameOver");
let restartBtn = document.querySelector(".restart-btn");

let filled = [];
let empty = [];

class Game {
  constructor() {
    this.grid = [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""]
    ];

    this.emptyCells = [];
    this.gameOver = false;
    this.startGame = false;
    this.prevMove = "";
    this.currentMove = "";
    this.cellMerged = false;
  }

  resetGame() {
    this.gameOver = false;

    this.grid = [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""]
    ];
    this.prevMove = "";
    this.currentMove = "";
    this.emptyCells = [];
    this.startingCells();
    this.updateGrid();
    gameOverModal.style.display = "none";
  }
  getRandom(x) {
    let randX = Math.floor(Math.random() * x);
    let randY = Math.floor(Math.random() * x);
    let value;
    Math.random() > 0.8 ? (value = 4) : (value = 2);
    return { x: randX, y: randY, value: value };
  }
  startingCells() {
    let value = "";
    let coors = [];
    for (let i = 0; i < 2; i++) {
      let { x, y, value } = this.getRandom(this.grid.length);

      coors.push({ x, y, val: value });
    }

    let { x, y, val } = coors[0];

    // if coor are same, change one of the coordinates
    if (x === coors[1].x && y === coors[1].y) {
      let result = this.getRandom(this.grid.length);
      coors[1].x = result.x;
      coors[1].y = result.y;
    } else {
    }
    // plug values into grid. Since theres only 2, no need to use for loop
    this.grid[x][y] = val;
    this.grid[coors[1].x][coors[1].y] = coors[1].val;
  }

  checkGameOver() {
    // CHECK FOR ROWS
    let cellPairs = [];
    this.grid.forEach(row => {
      utils.GameOverUtil(row, cellPairs);
    });

    // CHECK FOR VERTICAL
    let vertGrid = [];

    for (let i = 0; i < this.grid.length; i++) {
      let vert = this.changeDirection(this.grid, i);
      vertGrid.push(vert);
    }

    vertGrid.forEach(row => {
      utils.GameOverUtil(row, cellPairs);
    });

    console.log(cellPairs);
    cellPairs.length > 0 ? (this.gameOver = false) : (this.gameOver = true);
    console.log(this.gameOver);
    if (this.gameOver) {
      gameOverModal.style.display = "block";
    }
  }

  updateGrid() {
    // function to update dom grid after other grid updates.
    let col = "";
    let empties = 0;

    for (var a = 0; a < this.grid.length; a++) {
      for (var b = 0; b < this.grid.length; b++) {
        if (this.grid[a][b] !== "") {
          this.emptyCells = [];

          if (this.grid[a][b] > 2048) {
            row[a].children[
              b
            ].innerHTML = `<div class='box-inner filled-super'><p  class='value'>${this.grid[a][b]}</p></div>`;
          } else {
            row[a].children[
              b
            ].innerHTML = `<div class='box-inner filled-${this.grid[a][b]}'><p  class='value'>${this.grid[a][b]}</p></div>`;
          }
        } else {
          row[a].children[b].innerHTML = "";
        }
      }
    }
  }
  addNewCell() {
    console.log("hi");
    let { value } = this.getRandom();

    this.grid.forEach((row, a) => {
      row.forEach((cell, b) => {
        if (this.grid[a][b] === "") {
          this.emptyCells.push({ x: a, y: b, value: value });
        }
      });
    });

    let rand = Math.floor(Math.random() * this.emptyCells.length);

    let empty = this.emptyCells[rand];

    if (this.emptyCells.length > 0) {
      this.grid[empty.x][empty.y] = empty.value;
    } else {
    }
    console.log(this.emptyCells.length);
    if (this.emptyCells.length - 1 === 0 || this.emptyCells.length === 0) {
      this.checkGameOver();
    }
    this.updateGrid();
  }
  moveCells(direction) {
    let test = [2, 4, "", 4];

    let rows = [];
    let filteredRows = [];

    this.grid.forEach((row, index) => {
      row.forEach(r => {
        if (r !== "") {
          rows.push({ row, index });
        }
      });
    });

    rows.forEach(row => {
      this.merge(row.row);
      let mergedCells = this.merge(row.row, direction).filtered;

      this.grid[row.index] = mergedCells;
    });
    this.updateGrid();
  }

  merge(arr, direction) {
    let filtered = arr.filter(num => num !== "");
    let missing = arr.length - filtered.length;
    let zeros = Array(missing).fill("");
    let canMerge = { direction: direction, merge: false };

    switch (direction) {
      case "DOWN":
        filtered = zeros.concat(filtered);

        for (let i = 0; i < filtered.length; i++) {
          utils.mergeUtil(i, 0, filtered, -1);
        }
        this.prevMove = "DOWN";
        break;
      case "LEFT":
        filtered = filtered.concat(zeros);
        for (let i = 0; i < filtered.length; i++) {
          utils.mergeUtil(i, filtered.length - 1, filtered, 1);
        }
        this.prevMove = "LEFT";
        break;
      case "RIGHT":
        filtered = zeros.concat(filtered);
        for (let i = filtered.length; i >= 0; i--) {
          utils.mergeUtil(i, 0, filtered, -1);
        }

        this.prevMove = "RIGHT";
        break;
      case "UP":
        filtered = filtered.concat(zeros);

        for (let i = 0; i < filtered.length; i++) {
          utils.mergeUtil(i, filtered.length - 1, filtered, 1);
        }

        this.prevMove = "UP";
    }

    return { filtered };
  }

  // VERTICAL MOVEMENTS
  changeDirection(arr, n) {
    let result = [];
    arr.map(item => {
      result.push(item[n]);
    });
    return result;
  }
  moveCellsVert(direction) {
    let verticalGrid = [];
    let convertedGrid = [];
    for (let i = 0; i < this.grid.length; i++) {
      let res = this.changeDirection(this.grid, i);
      let mergedRes = this.merge(res, direction).filtered;

      verticalGrid.push(mergedRes);
    }

    for (let v = 0; v < verticalGrid.length; v++) {
      let converted = this.changeDirection(verticalGrid, v);
      convertedGrid.push(converted);
    }

    for (let g = 0; g < this.grid.length; g++) {
      this.grid[g] = convertedGrid[g];
    }
    this.updateGrid();
  }
}

let GameManager = new Game();
GameManager.startingCells();
GameManager.updateGrid();

document.addEventListener("keydown", e => {
  // 38 UP
  // 40 DOWN
  // 37 LEFT
  // 39 RIGHT
  //   GameManager.addNewCell();

  let prev = GameManager.prevMove;
  let current = GameManager.currentMove;
  if (e.keyCode === 37) {
    current = "LEFT";

    GameManager.moveCells("LEFT");

    GameManager.updateGrid();
  } else if (e.keyCode === 39) {
    current = "RIGHT";
    GameManager.moveCells("RIGHT");
  } else if (e.keyCode === 40) {
    current = "DOWN";
    GameManager.moveCellsVert("DOWN");
  } else if (e.keyCode === 38) {
    current = "UP";
    GameManager.moveCellsVert("UP");
  }
  console.log({
    prev,
    current
  });
  prev === current ? null : GameManager.addNewCell();

  GameManager.updateGrid();
});
restartBtn.addEventListener("click", () => {
  GameManager.resetGame();
});
