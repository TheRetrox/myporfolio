
        // ===============================
        // Game Variables
        // ===============================
        let snakeArr = [{ x: 1, y: 1 }];       // Snake head starting position
        let snakePosition = [];                // Stores previous snake positions
        let newHeadArr = [{ m: 0, n: 0 }];     // Snake body segments
        let walls = [];                        // Wall positions
        let foodPosition = { x: 3, y: 4 };     // Food position

        let board = document.querySelector(".board");
        let scoreTxt = document.querySelector("#score");

        let score = 0;
        let xV = 1;                            // Movement unit
        let yV = 1;

        // Direction flags
        let a = true;  // Right
        let b = false; // Left
        let c = false; // Up
        let d = false; // Down

        let mstart = false;    // Game start flag
        let wallScore = 0;     // Wall counter for spawning walls

        // ===============================
        // Game Loop
        // ===============================
        let gameLoop = setInterval(() => {
            if (mstart) {
                gameOver();
                gameStart();
                eatChk();
            }
        }, 100);

        // ===============================
        // Create new snake segment
        // ===============================
        function newHead() {
            let newHead = document.createElement("div");
            newHead.classList.add("newHead");
            board.appendChild(newHead);
            newHeadArr.push(newHead);
        }

        // ===============================
        // Randomize food position
        // ===============================
        function randomFood() {
            foodPosition.x = Math.floor(Math.random() * 19);
            foodPosition.y = Math.floor(Math.random() * 19);

            // Avoid placing food on edges
            if (foodPosition.x == 0 || foodPosition.y == 0) {
                randomFood();
            }
        }

        // ===============================
        // Check if snake eats food
        // ===============================
        function eatChk() {
            if (snakeArr[0].x == foodPosition.x && snakeArr[0].y == foodPosition.y) {
                score++;
                wallScore++;
                scoreTxt.innerHTML = `<i class="fas fa-star"></i> Score: ${score}`;
                randomFood();
                newHead();

                // Avoid spawning food on walls
                walls.forEach(obg => {
                    if (foodPosition.x == obg.x && foodPosition.y == obg.y) randomFood();
                });

                new Audio('carrotnom-92106.mp3').play();
                // Avoid spawning food on snake body
                for (let r = 1; r < newHeadArr.length + 1; r++) {
                    if (
                        foodPosition.x == snakePosition[snakePosition.length - r].x &&
                        foodPosition.y == snakePosition[snakePosition.length - r].y
                    ) {
                        randomFood();
                    }
                }
            }
        }

        // ===============================
        // End game logic
        // ===============================
        function gameEnd() {
            // Create game over message
            const gameOverDiv = document.createElement("div");
            gameOverDiv.classList.add("game-over");
            gameOverDiv.innerHTML = `
                <h2>Game Over</h2>
                <p>Your Score: ${score}</p>
                <button class="restart-btn" onclick="location.reload()">Play Again</button>
            `;
            document.querySelector(".board-container").appendChild(gameOverDiv);

            new Audio('gameover.mp3').play();
            clearInterval(gameLoop);
        }

        // ===============================
        // Collision Detection
        // ===============================
        function gameOver() {
            // Wall collision (borders)
            if (snakeArr[0].x > 18 || snakeArr[0].y > 18) gameEnd();
            if (snakeArr[0].x < 1 || snakeArr[0].y < 1) gameEnd();

            // Wall collision (generated walls)
            walls.forEach(obg => {
                if (snakeArr[0].x == obg.x && snakeArr[0].y == obg.y) gameEnd();
            });

            // Self collision
            for (let index = 1; index < newHeadArr.length; index++) {
                if (
                    snakeArr[0].x == snakePosition[snakePosition.length - index].x &&
                    snakeArr[0].y == snakePosition[snakePosition.length - index].y
                ) {
                    gameEnd();
                }
            }
        }

        // ===============================
        // Generate new wall
        // ===============================
        function addWall() {
            let wallpositionX = Math.floor(Math.random() * 19);
            let wallpositionY = Math.floor(Math.random() * 19);

            // Avoid edges
            if (wallpositionX == 0) wallpositionX = Math.floor(Math.random() * 19);
            if (wallpositionY == 0) wallpositionY = Math.floor(Math.random() * 19);

            // Avoid overlapping walls
            walls.forEach(obg => {
                if (wallpositionX == obg.x && wallpositionY == obg.y) {
                    wallpositionX = Math.floor(Math.random() * 19);
                    wallpositionY = Math.floor(Math.random() * 19);
                }
            });

            // Avoid snake body overlap
            for (let i = 1; i < walls.length; i++) {
                if (
                    walls[i].x == snakePosition[snakePosition.length - i].x &&
                    walls[i].y == snakePosition[snakePosition.length - i].y
                ) {
                    wallpositionX = Math.floor(Math.random() * 19);
                    wallpositionY = Math.floor(Math.random() * 19);
                }
            }

            // Create and append wall
            let wall = document.createElement("div");
            board.appendChild(wall);
            wall.classList.add("wall");
            wall.style.gridColumnStart = wallpositionX;
            wall.style.gridRowStart = wallpositionY;
            walls.push({ x: wallpositionX, y: wallpositionY });
        }

        // ===============================
        // Main Game Loop: Snake Rendering & Movement
        // ===============================
        let Shead = document.querySelector(".snakeHead");
        let food = document.querySelector(".food");

        function gameStart() {
            // Draw snake head
            Shead.style.gridColumnStart = snakeArr[0].x;
            Shead.style.gridRowStart = snakeArr[0].y;

            // Draw food
            food.style.gridColumnStart = foodPosition.x;
            food.style.gridRowStart = foodPosition.y;

            // Store snake positions
            snakePosition.push({ x: snakeArr[0].x, y: snakeArr[0].y });

            // Movement logic
            if (a) snakeArr[0].x += xV;        // Right
            else if (b) snakeArr[0].x -= xV;   // Left
            else if (c) snakeArr[0].y += xV;   // Down
            else if (d) snakeArr[0].y -= xV;   // Up

            // Update snake body segments
            for (let i = 1; i < newHeadArr.length; i++) {
                newHeadArr[i].style.gridRowStart = snakePosition[snakePosition.length - i - 1].y;
                newHeadArr[i].style.gridColumnStart = snakePosition[snakePosition.length - i - 1].x;
            }

            // Add wall every 5 foods eaten
            if (wallScore == 5) {
                addWall();
                wallScore = 0;
            }
        }

        // ===============================
        // Keyboard Controls
        // ===============================
        document.addEventListener("keydown", event => {
            if (event.key.startsWith("Arrow")) {
                switch (event.key) {
                    case "ArrowUp":
                        new Audio('move.mp3').play();
                        Shead.classList.add("rotate2");
                        Shead.classList.remove("rotate", "rotate3", "rotate4");
                        a = false; b = false; c = false; d = true;
                        mstart = true;
                        break;
                    case "ArrowDown":
                        new Audio('move.mp3').play();
                        Shead.classList.add("rotate4");
                        Shead.classList.remove("rotate2", "rotate3", "rotate");
                        a = false; b = false; c = true; d = false;
                        mstart = true;
                        break;
                    case "ArrowLeft":
                        new Audio('move.mp3').play();
                        Shead.classList.add("rotate");
                        Shead.classList.remove("rotate3", "rotate2", "rotate4");
                        a = false; b = true; c = false; d = false;
                        mstart = true;
                        break;
                    case "ArrowRight":
                        new Audio('move.mp3').play();
                        Shead.classList.add("rotate3");
                        Shead.classList.remove("rotate2", "rotate", "rotate4");
                        a = true; b = false; c = false; d = false;
                        mstart = true;
                        break;
                }
            }
        });

        // ===============================
        // Touch Controls (Swipe for Mobile)
        // ===============================
        let touchStartX = 0, touchStartY = 0;
        let touchEndX = 0, touchEndY = 0;
        const minSwipeDistance = 30;

        // Record touch start
        document.addEventListener("touchstart", e => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });

        // Record touch end
        document.addEventListener("touchend", e => {
            const touch = e.changedTouches[0];
            touchEndX = touch.clientX;
            touchEndY = touch.clientY;
            handleSwipe();
        });

        // Handle swipe direction
        function handleSwipe() {
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) < minSwipeDistance && Math.abs(diffY) < minSwipeDistance) return;

            // Horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    new Audio('move.mp3').play();
                    Shead.classList.add("rotate3");
                    Shead.classList.remove("rotate2", "rotate", "rotate4");
                    a = true; b = false; c = false; d = false;
                } else {
                    new Audio('move.mp3').play();
                    Shead.classList.add("rotate");
                    Shead.classList.remove("rotate3", "rotate2");
                    a = false; b = true; c = false; d = false;
                }
            }
            // Vertical swipe
            else {
                if (diffY > 0) {

                    new Audio('move.mp3').play();
                    Shead.classList.add("rotate4");
                    Shead.classList.remove("rotate2", "rotate3", "rotate");
                    a = false; b = false; c = true; d = false;
                } else {

                    new Audio('move.mp3').play();
                    Shead.classList.add("rotate2");
                    Shead.classList.remove("rotate", "rotate3", "rotate4");
                    a = false; b = false; c = false; d = true;
                }
            }
            mstart = true;
        }