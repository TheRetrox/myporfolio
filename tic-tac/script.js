  // ================== ELEMENT SELECTION ==================
        const box = document.querySelectorAll(".box");
        const container = document.querySelector(".container");
        const containerS = document.querySelector(".container-2");
        const msg = document.querySelector("#w-won");
        const statusDisplay = document.querySelector(".status");
        const currentPlayerSpan = document.querySelector(".current-player");

        // ================== GAME VARIABLES ==================
        let move = "X";
        let smWon = false;
        let x = "X";
        let o = "O";
        let emptyBox = 0;

        let winCon = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        let arrX = [];
        let arrO = [];

        // ================== TURN SWITCHER ==================
        updateStatus(move);
        function moveChange() {
            if (move === "X") {
                move = "O";
            } else if (move === "O") {
                move = "X";
            } else {
                console.log("Invalid move state");
            }
            updateStatus(move);
        }

        // ================== UPDATE STATUS DISPLAY ==================
        function updateStatus(a) {
            if (a === "X") {
                a = "O";
            } else if (a === "O") {
                a = "X";
            }
            currentPlayerSpan.textContent = a;
            // Remove and re-add the class to restart the animation
            currentPlayerSpan.classList.remove('current-player');
            void currentPlayerSpan.offsetWidth; // Trigger reflow
            currentPlayerSpan.classList.add('current-player');
        }

        // ================== START NEW GAME ==================
        newGame();

        function newGame() {
            smWon = false;
            emptyBox = 0;
            arrX = [];
            arrO = [];
            move = "O";

            // Reset board display with animation
            for (let a = 0; a < 9; a++) {
                box[a].innerText = "";
                box[a].className = "box";
                box[a].style.animation = "fadeIn 0.5s ease-out";
            }

            container.style.display = "grid";
            containerS.style.display = "none";
            updateStatus();

            // Remove any existing win lines
            document.querySelectorAll('.win-line').forEach(el => el.remove());

            // Attach click events to each box
            for (let i = 0; i < 9; i++) {
                box[i].addEventListener("click", () => {
                    if (box[i].innerText === "" && !smWon) {
                        emptyBox++;

                        // Change move and display symbol
                        moveChange();
                        box[i].innerText = move;

                        // Add visual class for X or O
                        if (box[i].innerText === "X") {
                            box[i].classList.add("x");
                            arrX.push(i);
                            if (smWon == false) {
                                win(arrX, x);
                            }
                        }

                        if (box[i].innerText === "O") {
                            box[i].classList.add("o");
                            arrO.push(i);
                            if (smWon == false) {
                                win(arrO, o);
                            }
                        }

                        draw();
                    }
                });
            }
        }

        // ================== WIN CHECK ==================
        function win(array, a) {
            for (let j = 0; j < 8; j++) {
                let b = 0;

                for (let k = 0; k < array.length; k++) {
                    for (let l = 0; l < 3; l++) {
                        if (array[k] == winCon[j][l]) {
                            b++;
                            if (b >= 3) {
                                smWon = true;
                                emptyBox = 0;

                                // Highlight winning boxes
                                for (let m = 0; m < 3; m++) {
                                    box[winCon[j][m]].classList.add("win");
                                }

                                // Show result with delay for animation
                                setTimeout(() => {
                                    container.style.display = "none";
                                    containerS.style.display = "flex";
                                    msg.innerText = `${a} Won`;
                                }, 1000);

                                // Reset move turn
                                move = "O";
                                return;
                            }
                        }
                    }
                }
            }
        }

        // ================== DRAW CHECK ==================
        function draw() {
            if (emptyBox >= 9 && smWon == false) {
                setTimeout(() => {
                    container.style.display = "none";
                    containerS.style.display = "flex";
                    msg.innerText = `Draw`;
                }, 500);

                move = "O";
                smWon = true;
                emptyBox = 0;
            }
        }

        // ================== ADDITIONAL FUNCTIONS ==================
        function resetGame() {
            newGame();
        }

