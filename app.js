//HTML ELements//
const appElement = document.getElementById("app");
const boardElement = document.createElement("div");
const scoreParentElement = document.createElement("div");
const showScoreElement = document.createElement("p");
const titleDivElement = document.createElement("div");
const titleParaElement = document.createElement("p");
const playButtonElement = document.createElement("button");
const gameEndedElement = document.createElement("div");
const gameEndedParagraphMessage = document.createElement("p");
const gameEndedParagraphScore = document.createElement("p");
const speedUpButton = document.createElement("button");
const speedDownButton = document.createElement("button");

// state / mode/
// const PBR(object=reference) vs PBV
// default values
const gameState = {
  board: [],
  currentScore: 0,
  highestScore: 0,
  gameInterval: null,
  food: [11, 8],
  snake: {
    body: [
      //[y,x]
      [10, 5],
      [10, 6],
      [10, 7],
      [10, 8],
    ],
    nextDirection: [[1, 0]], //down
  },
};

//establishing the state of my board
function buildInitialState() {
  gameState.board = [];
  for (let i = 0; i < 17; i++) {
    const row = [];
    //j is column (y-axis)//
    for (let j = 0; j < 17; j++) {
      row.push("");
    }
    gameState.board.push(row);
  }
  buildSnake();
  buildFood();
}

function buildSnake() {
  for (let i = 0; i < gameState.snake.body.length; i++) {
    const currentSnakeBody = gameState.snake.body[i];
    console.log("currentSnakeLocation:" + currentSnakeBody);
    const currentSnakeY = currentSnakeBody[0]; //Y-axis: row index
    const currentSnakeX = currentSnakeBody[1]; //X-axis: column index
    gameState.board[currentSnakeY][currentSnakeX] = "snake";
  }
  const currentSnakeHeadY = gameState.snake.body[0][0];
  const currentSnakeHeadX = gameState.snake.body[0][1];
  gameState.board[currentSnakeHeadY][currentSnakeHeadX] = "snakeHead";
}

function buildFood() {
  const currentFoodLocation = gameState.food;
  gameState.board[currentFoodLocation[0]][currentFoodLocation[1]] = "food";
  console.log("currentFoodLocation:" + currentFoodLocation);
}

// bootstrapping //
function bootStrap() {
  //HTML classes
  boardElement.classList.add("board");
  scoreParentElement.classList.add("score");
  titleDivElement.classList.add("title");
  playButtonElement.classList.add("play-button");
  gameEndedElement.classList.add("gameEndedPopUp");
  gameEndedParagraphMessage.classList.add("gameEndedPopUpMessage");
  gameEndedParagraphScore.classList.add("gameEndedPopUpScore");

  appElement.appendChild(titleDivElement);
  appElement.appendChild(scoreParentElement);
  appElement.appendChild(boardElement);
  scoreParentElement.appendChild(showScoreElement);
  titleDivElement.appendChild(titleParaElement);
  appElement.appendChild(playButtonElement);
  appElement.appendChild(speedUpButton);
  appElement.appendChild(speedDownButton);
  appElement.appendChild(gameEndedElement);

  playButtonElement.innerText = "Play";
  speedUpButton.innerText = "Speed Up";
  speedDownButton.innerText = "Speed Down";
  titleParaElement.innerText = "Snake";
  showScoreElement.innerText = `🍎 ${gameState.currentScore} 🏆 ${gameState.highestScore}`;

  // functions
  buildInitialState();
  renderBoard();
  moveSnake();
}

// render / views
function renderBoard() {
  boardElement.innerHTML = "";
  for (let i = 0; i < gameState.board.length; i++) {
    for (let j = 0; j < gameState.board[i].length; j++) {
      const tile = document.createElement("div");
      if (gameState.board[i][j] === "snake") {
        tile.classList.add("snake");
      } else if (gameState.board[i][j] === "food") {
        tile.classList.add("food");
        const foodContent = document.createElement("p");
        foodContent.classList.add("food-content");
        foodContent.innerText = "🍎";
        tile.appendChild(foodContent);
      } else if (gameState.board[i][j] === "snakeHead") {
        tile.classList.add("snake-head");
        const snakeHeadContent = document.createElement("p");
        snakeHeadContent.classList.add("snake-head-content");
        snakeHeadContent.innerText = "👀";
        tile.appendChild(snakeHeadContent);
      }
      tile.classList.add("tile");
      boardElement.appendChild(tile);
    }
  }
}

function moveSnake() {
  const snakeHead = [
    gameState.snake.body[0][0] + gameState.snake.nextDirection[0][0],
    gameState.snake.body[0][1] + gameState.snake.nextDirection[0][1],
  ];
  if (isGameEnded(snakeHead)) {
    console.log("game Ended!!!");
    gameEndedElement.appendChild(gameEndedParagraphMessage);
    gameEndedElement.appendChild(gameEndedParagraphScore);
    gameEndedParagraphMessage.innerText = "Game Over!";
    gameEndedParagraphScore.innerText = `Score: ${gameState.currentScore} \n Highest Score: ${gameState.highestScore}`;
    gameEndedElement.classList.toggle("showGameEndedPopUp");
    return;
  }
  gameState.snake.body.unshift(snakeHead); //adding the head to the snake body
  gameState.snake.body.pop(); //removing the tail
  const foodPosition = gameState.food;
  //if the snake hits the food
  if (snakeHead[0] === foodPosition[0] && snakeHead[1] === foodPosition[1]) {
    moveFood();
    gameState.currentScore += 1;
    if (gameState.highestScore < gameState.currentScore) {
      gameState.highestScore = gameState.currentScore;
    }
    console.log("currentScore: " + gameState.currentScore);
    console.log("newFoodPosition:" + foodPosition);
    const snakeBodyLength = gameState.snake.body.length;
    const snakeTail = gameState.snake.body[snakeBodyLength - 1];
    console.log("snakeTail:" + snakeTail);
    console.log("snakeTailLength:" + snakeBodyLength);
    //duplicating and adding the tail to the snake
    gameState.snake.body.push(snakeTail);
  }
  console.log("snakeHead:" + snakeHead);
}

function showScore() {
  showScoreElement.innerText = `🍎 ${gameState.currentScore} 🏆 ${gameState.highestScore}`;
}

//gets called in function moveSnake()
function moveFood() {
  //generate a random food location that's different from previous location or that's not part of the snake's body
  do {
    randomFoodX = Math.floor(Math.random() * gameState.board.length);
    randomFoodY = Math.floor(Math.random() * gameState.board.length);
  } while (
    (gameState.food[0] === randomFoodX && gameState.food[1] === randomFoodY) ||
    gameState.board[randomFoodX][randomFoodY] === "snake"
  );
  gameState.food = [randomFoodX, randomFoodY];
}

//gets called in function moveSnake()
function isGameEnded(snakeHead) {
  //check if snake goes outside vertically
  if (snakeHead[0] < 0 || snakeHead[0] > gameState.board.length - 1) {
    clearInterval(gameState.gameInterval);
    return true;
  }
  //check if snake goes outside horizontally
  if (snakeHead[1] < 0 || snakeHead[1] > gameState.board.length - 1) {
    clearInterval(gameState.gameInterval);
    return true;
  }
  //check if the snake touches its body
  for (let i = 0; i < gameState.snake.body.length; i++) {
    if (
      gameState.snake.body[i][0] === snakeHead[0] &&
      gameState.snake.body[i][1] === snakeHead[1]
    ) {
      clearInterval(gameState.gameInterval);
      return true;
    }
  }
}

// maybe a dozen or so helper functions for tiny pieces of the interface

// listeners
document.addEventListener("keydown", function (event) {
  event.preventDefault();
  const pressedKey = event.key;
  console.log(pressedKey);
  // const delayID = setTimeout(moveSnake,10);//check this
  //if the game hasn't started yet, start the interval
  // if (gameState.gameInterval === null){
  //   gameState.gameInterval = setInterval(tick, 300);
  // }
  const nextDirectionY = gameState.snake.nextDirection[0][0];
  const nextDirectionX = gameState.snake.nextDirection[0][1];
  // snake can't move towards the opposite directions //
  setTimeout(function () {
    switch (pressedKey) {
      case "ArrowUp":
        if (nextDirectionY === 1 && nextDirectionX === 0) {
          console.log("wrong direction");
          return;
        }
        gameState.snake.nextDirection = [[-1, 0]];
        break;
      case "ArrowDown":
        if (nextDirectionY === -1 && nextDirectionX === 0) {
          console.log("wrong direction");
          return;
        }
        gameState.snake.nextDirection = [[1, 0]];
        break;
      case "ArrowLeft":
        if (nextDirectionY === 0 && nextDirectionX === 1) {
          console.log("wrong direction");
          return;
        }
        gameState.snake.nextDirection = [[0, -1]];
        break;
      case "ArrowRight":
        if (nextDirectionY === 0 && nextDirectionX === -1) {
          console.log("wrong direction");
          return;
        }
        gameState.snake.nextDirection = [[0, 1]];
        break;
    }
  }, 20);
});

playButtonElement.addEventListener("click", function () {
  gameState.gameInterval = setInterval(tick, 150);
  gameState.currentScore = 0;
  gameState.snake.body = [
    //[y,x]
    [10, 5],
    [10, 6],
    [10, 7],
    [10, 8],
  ];
  gameState.food = [11, 8];
  gameState.snake.nextDirection = [[1, 0]];
});

// add to above
function tick() {
  moveSnake();
  buildInitialState();
  renderBoard();
  showScore();
}

// global function call //
bootStrap();
