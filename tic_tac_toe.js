document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const statusDiv = document.getElementById("status");
    const restartButton = document.getElementById("restart");
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameOver = false;

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]  // Diagonals
    ];

    function checkWinner(player) {
        return winConditions.some(condition => {
            return condition.every(index => {
                return board[index] === player;
            });
        });
    }

    function isBoardFull() {
        return board.every(cell => cell !== "");
    }

    function handleCellClick(event) {
        const index = event.target.getAttribute("data-index");

        if (board[index] !== "" || gameOver) {
            return;
        }

        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;

        if (checkWinner(currentPlayer)) {
            statusDiv.textContent = `Player ${currentPlayer} wins!`;
            gameOver = true;
            restartButton.style.display = "block";
            return;
        }

        if (isBoardFull()) {
            statusDiv.textContent = "It's a tie!";
            gameOver = true;
            restartButton.style.display = "block";
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;

        if (currentPlayer === "O") {
            setTimeout(aiMove, 500);
        }
    }

    function aiMove() {
        if (gameOver) return;

        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, 0, false);
                board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        board[bestMove] = "O";
        cells[bestMove].textContent = "O";

        if (checkWinner("O")) {
            statusDiv.textContent = "Player O wins!";
            gameOver = true;
            restartButton.style.display = "block";
            return;
        }

        if (isBoardFull()) {
            statusDiv.textContent = "It's a tie!";
            gameOver = true;
            restartButton.style.display = "block";
            return;
        }

        currentPlayer = "X";
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    }

    function minimax(board, depth, isMaximizing) {
        if (checkWinner("O")) return 10 - depth;
        if (checkWinner("X")) return depth - 10;
        if (isBoardFull()) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));

    restartButton.addEventListener("click", () => {
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameOver = false;
        cells.forEach(cell => cell.textContent = "");
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
        restartButton.style.display = "none";
    });

    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
});
