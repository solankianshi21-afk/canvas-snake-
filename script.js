const board = document.querySelector('.board');
const blockHeight = 50;
const blockWidth = 50;
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const startButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const restartButton = document.querySelector('.btn-restart');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.textContent = highScore;

let score = 0;
let time = '00:00';
let intervalId = null;
let timeIntervalId = null;

board.style.gridTemplateColumns = `repeat(${cols}, ${blockWidth}px)`;
board.style.gridTemplateRows = `repeat(${rows}, ${blockHeight}px)`;

const blocks = {};
let snake = [{ x: 1, y: 5 }];
let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
};
let direction = 'down';

// Generate grid blocks
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row},${col}`] = block;
    }
}

function render() {
    let head = null;
    if (direction === 'left') head = { x: snake[0].x, y: snake[0].y - 1 };
    else if (direction === 'right') head = { x: snake[0].x, y: snake[0].y + 1 };
    else if (direction === 'up') head = { x: snake[0].x - 1, y: snake[0].y };
    else if (direction === 'down') head = { x: snake[0].x + 1, y: snake[0].y };

    // Wall Collision Check
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        clearInterval(timeIntervalId);
        modal.style.display = 'flex';
        startGameModal.style.display = 'none';
        gameOverModal.style.display = 'flex';
        return;
    }

    // Remove existing classes from board before updating
    Object.values(blocks).forEach(b => b.classList.remove('fill', 'food'));

    // Eat Food Check
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore.toString());
            highScoreElement.textContent = highScore;
        }
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
        snake.unshift(head); // Snake grows
    } else {
        snake.unshift(head);
        snake.pop(); // Snake moves forward
    }

    // Draw Food
    if (blocks[`${food.x},${food.y}`]) {
        blocks[`${food.x},${food.y}`].classList.add('food');
    }

    // Draw Snake
    snake.forEach(segment => {
        if (blocks[`${segment.x},${segment.y}`]) {
            blocks[`${segment.x},${segment.y}`].classList.add('fill');
        }
    });
}

function startTimers() {
    clearInterval(intervalId);
    clearInterval(timeIntervalId);

    intervalId = setInterval(render, 400);
    timeIntervalId = setInterval(() => {
        let [minutes, seconds] = time.split(':').map(Number);
        seconds += 1;
        if (seconds === 60) {
            minutes += 1;
            seconds = 0;
        }
        time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeElement.textContent = time;
    }, 1000);
}

startButton.addEventListener('click', () => {
    modal.style.display = 'none';
    startTimers();
});

restartButton.addEventListener("click", restartGame);

function restartGame() {
    score = 0;
    time = '00:00';
    scoreElement.textContent = score;
    timeElement.textContent = time;
    highScoreElement.textContent = highScore;

    direction = 'down';
    snake = [{ x: 1, y: 5 }];
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    modal.style.display = 'none';
    startTimers();
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    else if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    else if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    else if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});