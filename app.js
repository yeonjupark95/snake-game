// HTML Elements / Element structures
const appElement = document.getElementById("app");
const boardElement = document.createElement("div");
const boardWrapperElement = document.createElement("div");
const scoreParentElement = document.createElement("div");
const showScoreElement = document.createElement("p");
const titleElement = document.createElement("div");
const speedParentElement = document.createElement("div");
const showSpeedElement = document.createElement("p");
const gameStartElement = document.createElement("div");
const gameStartElementTitle = document.createElement("p");
const gameStartElementMessage = document.createElement("p");
const gameEndElement = document.createElement("div");
const gameEndParagraphMessage = document.createElement("p");
const arrowKeyElement = document.createElement("div");
const arrowKeyParagraphMessage = document.createElement("p");
const playButtonElement = document.createElement("button");
const speedUpButton = document.createElement("button");
const speedDownButton = document.createElement("button");

// State / Mode
// Default gameState values
const gameState = {
  board: [],
  currentScore: 0,
  highestScore: 0,
  gameInterval: null,
  currentSpeed: 150,
  food: [3, 12],
  superFood: [],
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

// Building the initial state of my board
function buildInitialState() {
  gameState.board = [];
  for (let i = 0; i < 17; i++) {
    const row = [];
    //j is column
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
    const currentSnakeY = currentSnakeBody[0]; //Y: row index
    const currentSnakeX = currentSnakeBody[1]; //X: column index
    gameState.board[currentSnakeY][currentSnakeX] = "snake";
  }
  const currentSnakeHeadY = gameState.snake.body[0][0];
  const currentSnakeHeadX = gameState.snake.body[0][1];
  gameState.board[currentSnakeHeadY][currentSnakeHeadX] = "snakeHead";
}

function buildFood() {
  const currentFoodLocation = gameState.food;
  gameState.board[currentFoodLocation[0]][currentFoodLocation[1]] = "food";
}

// Bootstrapping
function bootStrap() {
  // HTML classes
  boardElement.classList.add("board");
  boardWrapperElement.classList.add("board-wrapper");
  scoreParentElement.classList.add("score");
  speedParentElement.classList.add("speed");
  titleElement.classList.add("title");
  playButtonElement.classList.add("play-button");
  speedUpButton.classList.add("speed-up-button");
  speedDownButton.classList.add("speed-down-button");
  gameStartElement.classList.add("game-start-popup-modal");
  gameStartElementTitle.classList.add("game-start-popup-title");
  gameStartElementMessage.classList.add("game-start-popup-message");
  gameEndElement.classList.add("game-end-popup-modal");
  gameEndParagraphMessage.classList.add("game-end-popup-message");

  // HTML appendChild / app structure
  appElement.appendChild(titleElement);
  appElement.appendChild(speedParentElement);
  appElement.appendChild(arrowKeyElement);
  appElement.appendChild(arrowKeyParagraphMessage);
  appElement.appendChild(playButtonElement);
  appElement.appendChild(speedUpButton);
  appElement.appendChild(speedDownButton);
  // HTML appendChild / board structure
  appElement.appendChild(boardWrapperElement);
  boardWrapperElement.appendChild(boardElement);
  // HTML appendChild / score structure
  appElement.appendChild(scoreParentElement);
  scoreParentElement.appendChild(showScoreElement);
  speedParentElement.appendChild(showSpeedElement);
  // HTML appendChild / game start popup structure
  appElement.appendChild(gameStartElement);
  gameStartElement.appendChild(gameStartElementTitle);
  gameStartElement.appendChild(gameStartElementMessage);
  // HTML appendChild / game end popup structure
  appElement.appendChild(gameEndElement);
  gameEndElement.appendChild(gameEndParagraphMessage);

  // HTML innerText
  playButtonElement.innerText = "\nPlay";
  speedUpButton.innerText = `🔺🐇\nSpeed Up`;
  speedDownButton.innerText = `🔻🐢\nSpeed Down`;
  showScoreElement.innerText = `🍎 ${gameState.currentScore} 🏆 ${gameState.highestScore}`;
  showSpeedElement.innerText = `🐇`;
  gameStartElementTitle.innerText = `Let's play snake!`;
  gameStartElementMessage.innerText = `Press Play button to start\n Eat as many 🍎s you can to score\n Press 🔺🐇 Speed Up to go faster\n Press 🔻🐢 Speed Down to go slower`;

  // Bootstrapping functions
  buildInitialState();
  renderBoard();
  moveSnake();
}

// Render / Views
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
  // Decide the next direction of the snake based on the Keypress event listener
  const snakeHead = [
    gameState.snake.body[0][0] + gameState.snake.nextDirection[0][0],
    gameState.snake.body[0][1] + gameState.snake.nextDirection[0][1],
  ];
  if (isGameEnded(snakeHead)) {
    // HTML Elements / showing the play button for an option to replay
    playButtonElement.classList.add("show-play-button");
    playButtonElement.classList.remove("hide-play-button");
    // HTML Element / showing the Game End Pop Up with Score
    gameEndParagraphMessage.innerText = `Game Over! \n\n🍎: ${gameState.currentScore} \n 🏆: ${gameState.highestScore}`;
    gameEndElement.classList.add("show-game-end-popup");
    return;
  }
  gameState.snake.body.unshift(snakeHead);
  gameState.snake.body.pop();
  // Adding the food to move while snake is moving
  const foodPosition = gameState.food;
  if (snakeHead[0] === foodPosition[0] && snakeHead[1] === foodPosition[1]) {
    moveFood();
    gameState.currentScore += 1;
    if (gameState.highestScore < gameState.currentScore) {
      gameState.highestScore = gameState.currentScore;
    }
    const snakeBodyLength = gameState.snake.body.length;
    const snakeTail = gameState.snake.body[snakeBodyLength - 1];
    gameState.snake.body.push(snakeTail);
  }
  if (gameState.currentScore>3){
  }
  gameState.keyPressed = false;
}

function showScore() {
  showScoreElement.innerText = `🍎 ${gameState.currentScore} 🏆 ${gameState.highestScore}`;
}

function moveFood() {
  // generate a random food location
  let randomFoodY = 0;
  let randomFoodX = 0;
  do {
    randomFoodY = Math.floor(Math.random() * gameState.board.length);
    randomFoodX = Math.floor(Math.random() * gameState.board.length);
  } while ( // food location that's different from previous location or that's not part of the snake's body //
    (gameState.food[0] === randomFoodY && gameState.food[1] === randomFoodX) ||
    gameState.board[randomFoodY][randomFoodX] === "snake"
  );
  gameState.food = [randomFoodY, randomFoodX];
}

function isGameEnded(snakeHead) {
  // Check if snake goes outside the board vertically
  if (snakeHead[0] < 0 || snakeHead[0] > gameState.board.length - 1) {
    clearInterval(gameState.gameInterval);
    return true;
  }
  // Check if snake goes outside the board horizontally
  if (snakeHead[1] < 0 || snakeHead[1] > gameState.board.length - 1) {
    clearInterval(gameState.gameInterval);
    return true;
  }
  // Check if the snake touches its own body
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

// Listeners / keydown
document.addEventListener("keydown", function (event) {
  event.preventDefault();
  // Remove the arrow key messages to user once users press the keys
  arrowKeyElement.classList.remove("arrow-key");
  arrowKeyParagraphMessage.classList.remove("arrow-key-message");
  arrowKeyParagraphMessage.innerText = "";
  // If the game hasn't started yet, start the interval when users press the keys
  if (gameState.gameInterval === null) {
    gameState.gameInterval = setInterval(tick, gameState.currentSpeed);
  }
  const nextDirectionY = gameState.snake.nextDirection[0][0];
  const nextDirectionX = gameState.snake.nextDirection[0][1];
  // Changing next directions based on the keys, and snake can't move towards the opposite directions
  if (!gameState.keyPressed) {
    switch (event.key) {
      case "ArrowUp":
        if (nextDirectionY === 1 && nextDirectionX === 0) {
          return;
        }
        gameState.snake.nextDirection = [[-1, 0]];
        break;
      case "ArrowDown":
        if (nextDirectionY === -1 && nextDirectionX === 0) {
          return;
        }
        gameState.snake.nextDirection = [[1, 0]];
        break;
      case "ArrowLeft":
        if (nextDirectionY === 0 && nextDirectionX === 1) {
          return;
        }
        gameState.snake.nextDirection = [[0, -1]];
        break;
      case "ArrowRight":
        if (nextDirectionY === 0 && nextDirectionX === -1) {
          return;
        }
        gameState.snake.nextDirection = [[0, 1]];
        break;
    }
    gameState.keyPressed = true;
  }
});

// Listener / Play button
playButtonElement.addEventListener("click", function () {
  // HTML Element / Remove the arrow key messages to user once users press the play button
  arrowKeyElement.classList.add("arrow-key");
  arrowKeyParagraphMessage.classList.add("arrow-key-message");
  arrowKeyParagraphMessage.innerText = "Use your arrow keys to start moving";
  // HTML Element / Remove the play button to user once users press the play button
  playButtonElement.classList.remove("show-play-button");
  playButtonElement.classList.add("hide-play-button");
  // HTML Element / Remove the game start pop up
  gameStartElement.classList.add("hide-game-start-popup");
  gameEndElement.classList.remove("show-game-end-popup");

  // Reset the snake & the current score
  gameState.currentScore = 0;
  gameState.snake.body = [
    //[y,x]
    [10, 8],
    [10, 7],
    [10, 6],
    [10, 5],
  ];
  gameState.food = [3, 12];
  buildInitialState();
  renderBoard();
  gameState.snake.nextDirection = [[0, 1]];
  gameState.gameInterval = null;
});

// Incremental change that happens to the state every time
function tick() {
  moveSnake();
  buildInitialState();
  renderBoard();
  showScore();
}

// Listener / speed up button
speedUpButton.addEventListener("click", function () {
  // Max speed at 90, min speed at 240
  if (gameState.currentSpeed > 90 && gameState.currentSpeed <= 240) {
    gameState.currentSpeed -= 30;
  }
  // HTML Elements / updating the current speed for users to see
  if (gameState.currentSpeed === 240) {
    showSpeedElement.innerText = `🐢🐢🐢`;
  } else if (gameState.currentSpeed === 210) {
    showSpeedElement.innerText = `🐢🐢`;
  } else if (gameState.currentSpeed === 180) {
    showSpeedElement.innerText = `🐢`;
  } else if (gameState.currentSpeed === 150) {
    showSpeedElement.innerText = `🐇`;
  } else if (gameState.currentSpeed === 120) {
    showSpeedElement.innerText = `🐇🐇`;
  } else if (gameState.currentSpeed === 90) {
    showSpeedElement.innerText = `🐇🐇🐇`;
  }
  // If the game has already started, then update the interval
  if (gameState.gameInterval !== null) {
    clearInterval(gameState.gameInterval);
    gameState.gameInterval = setInterval(tick, gameState.currentSpeed);
  }
});

// Listener / speed down button
speedDownButton.addEventListener("click", function () {
  // Max speed at 90, min speed at 240
  if (gameState.currentSpeed >= 90 && gameState.currentSpeed < 240) {
    gameState.currentSpeed += 30;
  }
  // HTML Elements / updating the current speed for users to see
  if (gameState.currentSpeed === 240) {
    showSpeedElement.innerText = `🐢🐢🐢`;
  } else if (gameState.currentSpeed === 210) {
    showSpeedElement.innerText = `🐢🐢`;
  } else if (gameState.currentSpeed === 180) {
    showSpeedElement.innerText = `🐢`;
  } else if (gameState.currentSpeed === 150) {
    showSpeedElement.innerText = `🐇`;
  } else if (gameState.currentSpeed === 120) {
    showSpeedElement.innerText = `🐇🐇`;
  } else if (gameState.currentSpeed === 90) {
    showSpeedElement.innerText = `🐇🐇🐇`;
  }
  // If the game has already started, then update the interval
  if (gameState.gameInterval !== null) {
    clearInterval(gameState.gameInterval);
    gameState.gameInterval = setInterval(tick, gameState.currentSpeed);
  }
});

// Global Function Call /
bootStrap();