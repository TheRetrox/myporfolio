 const p1character = document.querySelector('.character');
        const board = document.querySelector('.board');
        const topPipe = document.querySelector('.pipeTop');
        const bottomPipe = document.querySelector('.pipeBottom');
        const scoreShow = document.querySelector('.score');
        const scoreShow2 = document.querySelector('.score2');
        const gameOverShow = document.querySelector('.gameover');


        let press = true;
        let gamest = false;
        let pipe = false;
        let a = 0;
        let mainScore = 0;
        let ratio = 1; // For responsive scaling

        // Calculate responsive ratio
        function calculateRatio() {
            const boardWidth = board.clientWidth;
            ratio = boardWidth / 500; // 500 is the original width
        }

        let p1 = {
            x: 0,
            y: 0,
            joind: true,
            jumpPower: 6,
            fall: true,
            goup: false,
            angle: 0,
            rotate: false,
            scored: false
        }

        let PipesPo = {
            pipeX: 0,
            pipeY: 0,
            pipe1: 0,
            pipe2: 0,
            gap: 0,
        }

        let gravity = {
            velocity: 0,
            bounceFactor: 0.9,
            g: 0.2,
        }

        // Initialize game
        function initGame() {
            calculateRatio();

            p1.x = board.clientWidth / 4 - p1character.clientHeight;
            p1.y = board.clientHeight / 2 - p1character.clientHeight / 2;
            PipesPo.pipeX = board.clientWidth;

            // Update character position
            p1character.style.top = p1.y + "px";
            p1character.style.left = p1.x + "px";

            // Update pipe positions
            topPipe.style.left = PipesPo.pipeX + "px";
            bottomPipe.style.left = PipesPo.pipeX + "px";
        }

        gameloop = () => {

            scoreShow.innerText = `Score: ${mainScore}`;
            scoreShow2.innerText = `Score: ${mainScore}`;

            // Animated background
            a -= 0.5;
            board.style.backgroundPosition = `${a}px`;

            if (p1.rotate) {
                p1.angle += 0.5;
                p1character.style.transform = `rotateZ(${p1.angle}deg)`;
                if (p1.angle > 60) {
                    p1.angle = 60;
                }
            }

            if (p1.joind) {
                p1character.style.top = p1.y + "px";
                p1character.style.left = p1.x + "px";
                topPipe.style.left = PipesPo.pipeX + "px";
                bottomPipe.style.left = PipesPo.pipeX + "px";
            }

            if (gamest) {
                addPipes();
                applyGravity();
                gameOver();
            }
            requestAnimationFrame(gameloop);
        }

        function applyGravity() {
            if (p1.fall) {
                p1.y += gravity.velocity;
                gravity.velocity += gravity.g;
            }
        }

        function gameOver() {
            if (p1.y >= board.clientHeight - p1character.clientHeight) {
                gamest = false;
                p1.rotate = false;
                new Audio('sfx_die.wav').play();
                gameOverPopup();
            }
            if (p1.y <= 0) {
                gamest = false;
                p1.rotate = false;
                new Audio('sfx_die.wav').play();
                gameOverPopup();
            }
            if (p1.y <= PipesPo.pipe1 && p1.x >= PipesPo.pipeX - p1character.clientHeight && p1.x <= PipesPo.pipeX + topPipe.clientWidth) {
                gamest = false;
                p1.rotate = false;
                new Audio('sfx_hit.wav').play();
                gameOverPopup();
            }
            if (p1.y >= PipesPo.pipe1 + PipesPo.gap - p1character.clientHeight && p1.x >= PipesPo.pipeX - p1character.clientHeight && p1.x <= PipesPo.pipeX + topPipe.clientWidth) {
                gamest = false;
                p1.rotate = false;
                new Audio('sfx_hit.wav').play();
                gameOverPopup();
            }
            // Bird passes the pipe safely (center point)
            if (!p1.scored && p1.x > PipesPo.pipeX + topPipe.clientWidth) {
                mainScore++;
                new Audio('scoresound.mp3').play();
                p1.scored = true; // prevents multiple scoring per pipe
            }

        }

        function gameOverPopup() {
            press = false;
            gameOverShow.style.display = "flex";
            p1character.style.display = "none";
            topPipe.style.display = "none";
            bottomPipe.style.display = "none";
        }

        function addPipes() {
            const gap = 230 * ratio; // Responsive gap size
            PipesPo.gap = gap;

            if (!pipe) {
                // Random height for top pipe within valid range
                let topHeight = Math.random() * (board.clientHeight - gap - 100) + 50;
                let bottomHeight = board.clientHeight - topHeight - gap;
                topPipe.style.height = topHeight + "px";
                bottomPipe.style.height = bottomHeight + "px";
                PipesPo.pipe1 = topHeight;
                PipesPo.pipe2 = bottomHeight;
                pipe = true;
                p1.scored = false;

            }

            // Move pipes
            PipesPo.pipeX -= 2 * ratio; // Responsive pipe speed

            if (PipesPo.pipeX <= -topPipe.clientWidth) {
                PipesPo.pipeX = board.clientWidth;
                pipe = false;
            }

            topPipe.style.left = PipesPo.pipeX + "px";
            bottomPipe.style.left = PipesPo.pipeX + "px";
        }

        function playa() {
            location.reload();
        }

     
            board.addEventListener("click", event => {
                if(press){
                    if (!gamest) {
                        gamest = true;
                        p1.rotate = true;
                    }
                    gravity.velocity = -p1.jumpPower * ratio; // Responsive jump power
                    p1.angle = -45;
                    new Audio('flappy_whoosh.mp3').play();
                }
            });
        

        
        // Handle window resize
        window.addEventListener('resize', initGame);

        // Initialize the game
        initGame();
        requestAnimationFrame(gameloop);