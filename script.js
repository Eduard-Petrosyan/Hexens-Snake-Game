// define HTML elements
const board = document.getElementById('game_board');
const instructionText = document.getElementById('instruction_text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('high_score');
const upButton = document.getElementById('control_arrows_up');
const rightButton = document.getElementById('control_arrows_right');
const downButton = document.getElementById('control_arrows_down');
const leftButton = document.getElementById('control_arrows_left');
const restartButton = document.getElementById('restart_button');

//Define game variables
const gridSize = 20;
let snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 125;
let gameStarted = false;

// Draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw snake
function drawSnake() {
    snake.forEach((segment, index) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        board.appendChild(snakeElement);
    });
}

// Create a snake of food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// Generate food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

// Moving the snake
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // Clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

// Start game function 
function startGame() {
    gameStarted = true; // Keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
    if(
        (!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.key === ' ')
    ) {
        startGame();
    } else {
        if (event.key === 'ArrowUp' && direction !== 'down') {
            direction = 'up';
        } else if (event.key === 'ArrowDown' && direction !== 'up') {
            direction = 'down';
        } else if (event.key === 'ArrowLeft' && direction !== 'right') {
            direction = 'left';
        } else if (event.key === 'ArrowRight' && direction !== 'left') {
            direction = 'right';
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ]
    food = generateFood();
    direction = 'right'
    gameSpeedDelay = 125;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length -3;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore() {
    const currentScore = snake.length - 3;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}

restartButton.addEventListener('click', () => {
    resetGame();
    startGame();
});

upButton.addEventListener('click', () => {
    if (gameStarted === false) {
        startGame();
    }
    if (direction !== 'down') {
        direction = 'up';
    }
});

rightButton.addEventListener('click', () => {
    if (gameStarted === false) {
        startGame();
    }
    if (direction !== 'left') {
        direction = 'right';
    }
});

downButton.addEventListener('click', () => {
    if (gameStarted === false) {
        startGame();
    }
    if (direction !== 'up') {
        direction = 'down';
    }
});

leftButton.addEventListener('click', () => {
    if (gameStarted === false) {
        startGame();
    }
    if (direction !== 'right') {
        direction = 'left';
    }
});