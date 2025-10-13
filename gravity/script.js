 // ================== SETUP ==================
        // Select the board 
        let board = document.querySelector(".board");

        // Set window height (playable area height)
        let windowH = board.clientHeight;

        // Get control elements
        const gravityInput = document.getElementById("gravity");
        const bounceInput = document.getElementById("bounce");
        const ballCountElement = document.getElementById("ballCount");
        const activeBallsElement = document.getElementById("activeBalls");
        const maxVelocityElement = document.getElementById("maxVelocity");
        const clearBallsButton = document.getElementById("clearBalls");
        const addRandomButton = document.getElementById("addRandom");

        // Initialize values from inputs
        let g = parseFloat(gravityInput.value);
        let f = parseFloat(bounceInput.value);

        // Update values when inputs change
        gravityInput.addEventListener("input", function () {
            g = parseFloat(this.value);
        });

        bounceInput.addEventListener("input", function () {
            f = parseFloat(this.value);
        });

        // Flags for falling/bouncing behavior
        let fall = true;
        let goUp = false;

        // Tracks if at least one item is clicked/added
        let clickd = false;

        // Arrays to manage multiple items
        let allitemz = [];     // Stores item elements
        let allitemzY = [];    // Stores Y position of each item
        let arrFall = [];      // Stores fall state (true = falling, false = bouncing up)
        let arrvelo = [];      // Stores velocity of each item
        let arrColors = [];    // Stores ball colors

        // Statistics
        let maxVelocity = 0;

        // Color palette for balls
        const colors = [
            'radial-gradient(circle at 30% 30%, #ff9a9e, #fad0c4)',
            'radial-gradient(circle at 30% 30%, #a1c4fd, #c2e9fb)',
            'radial-gradient(circle at 30% 30%, #ffecd2, #fcb69f)',
            'radial-gradient(circle at 30% 30%, #84fab0, #8fd3f4)',
            'radial-gradient(circle at 30% 30%, #d4fc79, #96e6a1)',
            'radial-gradient(circle at 30% 30%, #fbc2eb, #a6c1ee)',
            'radial-gradient(circle at 30% 30%, #fdcbf1, #e6dee9)',
            'radial-gradient(circle at 30% 30%, #e0c3fc, #8ec5fc)'
        ];

        // ================== GAME LOOP ==================
        function gameloop() {
            if (clickd == true) {
                for (let i = 0; i < allitemz.length; i++) {
                    let ay = allitemzY[i]; // Current Y position of item

                    // If item is falling
                    if (arrFall[i] == true) {
                        arrvelo[i] += g;             // Increase velocity by gravity
                        allitemzY[i] += arrvelo[i];  // Update Y position
                    }

                    // If item is going up (bounce)
                    if (arrFall[i] == false) {
                        arrvelo[i] = -arrvelo[i];    // Reverse velocity
                        allitemzY[i] += arrvelo[i];  // Update Y position
                    }

                    // If velocity becomes zero or less, switch to falling
                    if (arrvelo[i] <= 0) {
                        arrFall[i] = true;
                    }

                    // If item touches bottom of window, switch to bounce (go up)
                    if (allitemzY[i] >= windowH - 50) {
                        allitemzY[i] = windowH - 50; // Keep inside boundary
                        arrvelo[i] = arrvelo[i] * f; // Apply bounce factor
                        arrFall[i] = false;          // Start bouncing upward
                    }

                    // Update max velocity
                    if (Math.abs(arrvelo[i]) > maxVelocity) {
                        maxVelocity = Math.abs(arrvelo[i]);
                        maxVelocityElement.textContent = maxVelocity.toFixed(2);
                    }

                    // Apply updated Y position to item 
                    allitemz[i].style.top = ay + "px";

                    // Add visual effect based on velocity
                    const velocityFactor = Math.min(Math.abs(arrvelo[i]) / 10, 1);
                    allitemz[i].style.opacity = 0.7 + (velocityFactor * 0.3);

                    // Add slight rotation based on movement
                    allitemz[i].style.transform = `rotate(${ay / 5}deg) scale(${1 + velocityFactor * 0.1})`;
                }

                // Update active balls count
                activeBallsElement.textContent = allitemz.length;
            }

            // Keep looping the game
            requestAnimationFrame(gameloop);
        }

        // ================== CREATE BALL FUNCTION ==================
        function createBall(x, y, randomColor = false) {
            // Create a new div for the item
            let newItem = document.createElement('div');
            board.appendChild(newItem);
            newItem.classList.add("newItemz");

            // Center item around coordinates
            let h = newItem.clientHeight;
            newItem.style.top = (y - h / 2) + "px";
            newItem.style.left = (x - h / 2) + "px";

            // Assign a random color from the palette
            const colorIndex = randomColor ? Math.floor(Math.random() * colors.length) :
                (allitemz.length % colors.length);
            const ballColor = colors[colorIndex];
            newItem.style.background = ballColor;

            // Add visual effect for new ball
            newItem.classList.add("added");
            setTimeout(() => {
                newItem.classList.remove("added");
            }, 500);

            // Mark that at least one item is active
            clickd = true;

            // Store item properties in arrays
            allitemz.push(newItem);
            allitemzY.push(y - h / 2);
            arrFall.push(true); // Start falling
            arrvelo.push(0);    // Initial velocity
            arrColors.push(ballColor);

            // Update ball count
            ballCountElement.textContent = allitemz.length;
        }

        // ================== EVENT HANDLERS ==================
        // On mouse click, create a new bouncing item
        board.addEventListener("click", (e) => {
            let rect = board.getBoundingClientRect();
            let mx = e.clientX - rect.left; // Mouse X position relative to board
            let my = e.clientY - rect.top;  // Mouse Y position relative to board

            createBall(mx, my);
        });

        // Clear all balls
        clearBallsButton.addEventListener("click", () => {
            // Remove all ball elements from DOM
            allitemz.forEach(ball => {
                ball.remove();
            });

            // Reset arrays
            allitemz = [];
            allitemzY = [];
            arrFall = [];
            arrvelo = [];
            arrColors = [];

            // Reset statistics
            ballCountElement.textContent = "0";
            activeBallsElement.textContent = "0";
            maxVelocityElement.textContent = "0";
            maxVelocity = 0;

            // Reset flag
            clickd = false;
        });

        // Add random balls
        addRandomButton.addEventListener("click", () => {
            for (let i = 0; i < 5; i++) {
                const x = Math.random() * (board.clientWidth - 50) + 25;
                const y = Math.random() * (board.clientHeight / 2);
                createBall(x, y, true);
            }
        });

        // ================== RESIZE HANDLER ==================
        // Adjust board height on window resize
        window.addEventListener("resize", function () {
            windowH = board.clientHeight;

            // Reposition balls if they're outside the new boundaries
            for (let i = 0; i < allitemzY.length; i++) {
                if (allitemzY[i] > windowH - 50) {
                    allitemzY[i] = windowH - 50;
                }
            }
        });

        // ================== START ==================
        // Begin the animation loop
        requestAnimationFrame(gameloop);