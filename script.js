// Memanggil elemen dari HTML
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.querySelector('.score');
const gameOverElement = document.querySelector('.gameOver');

// === Tambahan: High Score & Suara ===
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
const highScoreDisplay = document.createElement('p');
highScoreDisplay.className = 'highScore';
highScoreDisplay.textContent = `High Score: ${highScore}`;
document.querySelector('.info').appendChild(highScoreDisplay);

// === SUARA ===
const soundEat = new Audio("sounds/eat.mp3");
const soundGameOver = new Audio("sounds/gameover.mp3");
const soundPlay = new Audio("sounds/play.mp3");

// === PENGATURAN SUARA ===
soundPlay.loop = true;       // biar musik latar muter terus
soundPlay.volume = 0.3;      // musik latar lembut
soundEat.volume = 1.0;       // suara makan keras
soundGameOver.volume = 0.7;  // suara game over sedang

// === CEGAH AUTOPLAY ERROR ===
let musicStarted = false;
document.addEventListener("keydown", () => {
    if (!musicStarted) {
        soundPlay.play().catch(() => {}); // mulai musik pas pertama kali tekan tombol
        musicStarted = true;
    }
});


const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

let snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
let food = { x: 5, y: 5 };
let direction = 'right';
let score = 0;
let gameRunning = true;

// Fungsi untuk menggambar game
function draw() {
    // === Tambahan: background gradien biar nyatu warna canvas ===
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0d0d0d');
    gradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar makanan (lingkaran merah)
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2.5,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Gambar ular
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#00ff99';
        } else {
            let green = 200 - index * 5;
            ctx.fillStyle = `rgb(0, ${green > 50 ? green : 50}, 100)`;
        }

        ctx.shadowColor = '#003300';
        ctx.shadowBlur = 5;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        ctx.shadowBlur = 0;
    });
}

// Fungsi update logika game
function update() {
    if (!gameRunning) return;

    const head = { ...snake[0] };

    if (direction === 'up') head.y--;
    if (direction === 'down') head.y++;
    if (direction === 'left') head.x--;
    if (direction === 'right') head.x++;

    // Cek tabrakan dinding
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        endGame();
        return;
    }

    // Cek tabrakan dengan tubuh sendiri
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Cek apakah makan makanan
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;

        // === Tambahan: update high score & suara makan ===
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }

        soundEat.currentTime = 0;
        soundEat.play();

        generateFood();
    } else {
        snake.pop();
    }
}

// Fungsi untuk membuat makanan secara acak
function generateFood() {
    food = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight)
    };
}

// Fungsi saat game over
function endGame() {
    gameRunning = false;
    gameOverElement.style.display = 'block';

    // === Tambahan: mainkan suara game over ===
    soundPlay.pause();
    soundGameOver.currentTime = 0;
    soundGameOver.play();
}

// Fungsi reset game
function resetGame() {
    // === Tambahan: Cegah respawn sebelum game over ===
    if (gameRunning) return;

    snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    gameOverElement.style.display = 'none';
    generateFood();

    // === Tambahan: restart musik ===
    soundGameOver.pause();
    soundGameOver.currentTime = 0;
    soundPlay.currentTime = 0;
    soundPlay.play();
}

// Fungsi game loop
function gameLoop() {
    update();
    draw();
}

// Kontrol arah dengan keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
    if (e.key === ' ' && !gameRunning) resetGame(); // hanya bisa tekan spasi kalau mati
});

// Inisialisasi game
resetGame();
setInterval(gameLoop, 90);
