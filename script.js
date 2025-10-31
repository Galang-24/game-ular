// Memanggil elemen dari HTML
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.querySelector('.score');
const gameOverElement = document.querySelector('.gameOver');

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
    // Bersihkan canvas
    ctx.fillStyle = '#1a1a1a'; // Warna latar belakang yang lebih elegan
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

//     function draw() {
//     // Bersihkan canvas
//     ctx.fillStyle = 'black';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Gambar ular
//     ctx.fillStyle = 'blue';
//     snake.forEach(segment => {
//         ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
//     });

//     // Gambar makanan
//     ctx.fillStyle = 'red';
//     ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
// }

    // Gambar ular
    snake.forEach((segment, index) => {
        // Warna kepala ular
        if (index === 0) {
            ctx.fillStyle = '#00ff99';
        } else {
            // Gradasi warna tubuh
            let green = 200 - index * 5;
            ctx.fillStyle = `rgb(0, ${green > 50 ? green : 50}, 100)`;
        }

        // Efek bayangan untuk tubuh ular
        ctx.shadowColor = '#003300';
        ctx.shadowBlur = 5;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        ctx.shadowBlur = 0; // Reset bayangan
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
}

// Fungsi reset game
function resetGame() {
    snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    gameOverElement.style.display = 'none';
    generateFood();
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
});

// Inisialisasi game
resetGame();
setInterval(gameLoop, 90);
