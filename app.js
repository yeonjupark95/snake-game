//HTML ELements//
const appElement = document.getElementById("app");
const boardElement = document.createElement("div");
const boardWrapperElement = document.createElement("div");
const scoreParentElement = document.createElement("div");
const showScoreElement = document.createElement("p");
const titleDivElement = document.createElement("div");
const titleParaElement = document.createElement("p");
const gameStartElement = document.createElement("div");
const gameStartElementMessage = document.createElement("p");
const gameEndElement = document.createElement("div");
const gameEndParagraphMessage = document.createElement("p");
const playButtonElement = document.createElement("button");
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
  food: [3, 12],
  snake: {
    body: [
      //[y,x]
      [10, 8],
      [10, 7],
      [10, 6],
      [10, 5],
    ],
    nextDirection: [[0, 1]], //right
  },
  keyPressed: false,
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
  boardWrapperElement.classList.add("board-wrapper");
  scoreParentElement.classList.add("score");
  titleDivElement.classList.add("title");
  playButtonElement.classList.add("play-button");
  speedUpButton.classList.add("speed-up-button");
  speedDownButton.classList.add("speed-down-button");
  gameStartElement.classList.add("game-start-popup-modal");
  gameStartElementMessage.classList.add("game-start-popup-message");
  gameEndElement.classList.add("game-end-popup-modal");
  gameEndParagraphMessage.classList.add("game-end-popup-message");

  appElement.appendChild(titleDivElement);
  appElement.appendChild(scoreParentElement);
  appElement.appendChild(boardWrapperElement);
  boardWrapperElement.appendChild(boardElement);
  scoreParentElement.appendChild(showScoreElement);
  titleDivElement.appendChild(titleParaElement);
  appElement.appendChild(playButtonElement);
  appElement.appendChild(speedUpButton);
  appElement.appendChild(speedDownButton);
  appElement.appendChild(gameStartElement);
  appElement.appendChild(gameEndElement);
  gameStartElement.appendChild(gameStartElementMessage);
  gameEndElement.appendChild(gameEndParagraphMessage);

  playButtonElement.innerText = "\nPlay";
  speedUpButton.innerText = `🔺🐇\nSpeed Up`;
  speedDownButton.innerText = `🔻🐢\nSpeed Down`;
  titleParaElement.innerText = "snake";
  showScoreElement.innerText = `🍎 ${gameState.currentScore} 🏆 ${gameState.highestScore}`;
  gameStartElement.innerText = `The Snake will start moving when you press Play\n Eat as many 🍎s you can to score\n Press 🔺🐇 Speed Up to go faster\n Press 🔻🐢 Speed Down to go slower`

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
        const foodEmoji = document.createElement("p");
        foodEmoji.classList.add("food-emoji");
        foodEmoji.innerText = "🍎";
        tile.appendChild(foodEmoji);
      } else if (gameState.board[i][j] === "snakeHead") {
        tile.classList.add("snake-head");
        const snakeHeadEmoji = document.createElement("p");
        snakeHeadEmoji.classList.add("snake-head-emoji");
        snakeHeadEmoji.innerText = "👀";
        tile.appendChild(snakeHeadEmoji);
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
    playButtonElement.classList.add("show-play-button");
    playButtonElement.classList.remove("hide-play-button");
   
    gameEndParagraphMessage.innerText = `Game Over! \n🍎: ${gameState.currentScore} \n 🏆: ${gameState.highestScore}`;
    gameEndElement.classList.add("show-game-end-popup");
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
    const snakeBodyLength = gameState.snake.body.length;
    const snakeTail = gameState.snake.body[snakeBodyLength - 1];
    //duplicating and adding the tail to the snake
    gameState.snake.body.push(snakeTail);
  }
  gameState.keyPressed = false;
}

function showScore() {
  showScoreElement.innerText = `🍎 ${gameState.currentScore} 🏆 ${gameState.highestScore}`;
}

//gets called in function moveSnake()
function moveFood() {
  //generate a random food location that's different from previous location or that's not part of the snake's body
  let randomFoodY = 0;
  let randomFoodX = 0;
  do {
    randomFoodY = Math.floor(Math.random() * gameState.board.length);
    randomFoodX = Math.floor(Math.random() * gameState.board.length);
  } while (
    (gameState.food[0] === randomFoodY && gameState.food[1] === randomFoodX) ||
    gameState.board[randomFoodY][randomFoodX] === "snake"
  );
  gameState.food = [randomFoodY, randomFoodX];
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

// listeners
document.addEventListener("keydown", function (event) {
  event.preventDefault();
  //if the game hasn't started yet, start the interval
  // if (gameState.gameInterval === null){
  //   gameState.gameInterval = setInterval(tick, 150);
  // }
  const nextDirectionY = gameState.snake.nextDirection[0][0];
  const nextDirectionX = gameState.snake.nextDirection[0][1];
  // snake can't move towards the opposite directions //
  if (!gameState.keyPressed){
  switch (event.key) {
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
  gameState.keyPressed = true;
}
});

playButtonElement.addEventListener("click", function () {
  playButtonElement.classList.remove("show-play-button");
  playButtonElement.classList.add("hide-play-button");
  gameStartElement.classList.add("hide-game-start-popup");
  gameEndElement.classList.remove("show-game-end-popup");
  gameState.gameInterval = setInterval(tick, 150);
  gameState.currentScore = 0;
  gameState.snake.body = [
    //[y,x]
    [10, 8],
    [10, 7],
    [10, 6],
    [10, 5],
  ];
  gameState.food = [3, 12];
  gameState.snake.nextDirection = [[0, 1]];
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
