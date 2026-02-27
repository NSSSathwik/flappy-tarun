const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let score = 0;
let gravity = 0.5;
let velocity = 0;
let gameOver = false;
let gameState = "start";

// Load Images
let birdImg = new Image();
birdImg.src = "assets/bird.jpg";

let pipeImg = new Image();
pipeImg.src = "assets/pipe.jpg";

// Load Sounds
let flySound = new Audio("assets/fly.mp3");
let gameOverSound = new Audio("assets/gameover.mp3");

// Bird Object
let bird = {
    x: 80,
    y: 200,
    width: 40,
    height: 40
};

// Pipes Array
let pipes = [];
let pipeWidth = 90;
let gap = 150;
let pipeSpeed = 2;

// Create Pipes
function createPipe() {
    let topHeight = Math.random() * 250 + 50;

    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + gap,
        passed: false
    });
}

// Draw Bird
function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Draw Pipes
function drawPipes() {
    pipes.forEach(pipe => {

        // Top Pipe (full height)
        ctx.drawImage(
            pipeImg,
            pipe.x,
            0,
            pipeWidth,
            pipe.topHeight
        );

        // Bottom Pipe (full to bottom)
        ctx.drawImage(
            pipeImg,
            pipe.x,
            pipe.bottomY,
            pipeWidth,
            canvas.height - pipe.bottomY
        );
    });
}

// Update Game
function update() {
    if (gameState !== "playing") return;

    velocity += gravity;
    bird.y += velocity;

    // Bird falls to ground
    if (bird.y + bird.height >= canvas.height) {
        endGame();
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        // Collision
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight ||
             bird.y + bird.height > pipe.bottomY)
        ) {
            endGame();
        }

        // Score
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            score++;
            pipe.passed = true;
            document.getElementById("score").innerText = "Score: " + score;
        }
    });

    // Remove old pipes
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Draw Everything
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();

    if (gameState === "start") {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Bunk Kodadham ra!!", 70, 300);
    }

    if (gameState === "gameover") {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("anni classes podham ra!!", 50, 250);

        ctx.fillStyle = "black";
        ctx.font = "25px Arial";
        ctx.fillText("Press Space to Restart", 50, 300);
    }

}

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Make Bird Fly ONLY when clicking on Bird
document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {

        if (gameState === "start") {
            gameState = "playing";
        }

        else if (gameState === "playing") {
            velocity = -7;
        }

        else if (gameState === "gameover") {
            resetGame();
        }

    }

});

// Mobile Touch Support
document.addEventListener("touchstart", function() {
    if (!gameOver) {
        velocity = -10;
        flySound.currentTime = 0;
        flySound.play();
    }
});

// End Game
function endGame() {
    gameOver = true;
    gameOverSound.play();
    gameState = "gameover";
   
}

// Generate Pipes Every 2 Seconds
setInterval(createPipe, 2000);

gameLoop();

function resetGame() {
    bird.y = 200;
    velocity = 0;
    pipes = [];
    score = 0;
    document.getElementById("score").innerText = "Score: 0";
    gameState = "start";
}