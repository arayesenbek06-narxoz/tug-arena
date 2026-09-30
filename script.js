// ===============================
// ELEMENTS
// ===============================

const playButton = document.getElementById("playButton");
const mainMenu = document.getElementById("mainMenu");
const gameScreen = document.getElementById("gameScreen");

const pullButton = document.getElementById("pullButton");
const powerButton = document.getElementById("powerButton");

const rope = document.getElementById("rope");

const playerStaminaBar = document.getElementById("playerStamina");
const staminaText = document.getElementById("staminaText");

const timerText = document.getElementById("timer");

const resultOverlay = document.getElementById("resultOverlay");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

const rematchButton = document.getElementById("rematchButton");
const countdownOverlay = document.getElementById("countdownOverlay");
const countdownNumber = document.getElementById("countdownNumber");


// ===============================
// GAME VARIABLES
// ===============================

let ropePosition = 0;

let playerStamina = 100;
let botStamina = 100;

let timeLeft = 30;

let gameActive = false;

const WIN_POSITION = 280;


// ===============================
// START BUTTON
// ===============================

playButton.addEventListener("click", function () {

    mainMenu.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    startGame();
});


// ===============================
// START / RESET GAME
// ===============================

function startGame() {

    ropePosition = 0;

    playerStamina = 100;
    botStamina = 100;

    timeLeft = 30;

    gameActive = false;

    resultOverlay.classList.add("hidden");

    pullButton.disabled = false;
    powerButton.disabled = false;

    updateGame();
    startCountdown();
}
// ===============================
// COUNTDOWN
// ===============================

function startCountdown() {

    let count = 3;

    countdownNumber.textContent = count;

    countdownOverlay.classList.remove("hidden");

    const countdownInterval = setInterval(function () {

        count--;

        if (count > 0) {

            countdownNumber.textContent = count;

        } else if (count === 0) {

            countdownNumber.textContent = "PULL!";

        } else {

            clearInterval(countdownInterval);

            countdownOverlay.classList.add("hidden");

            gameActive = true;
        }

    }, 1000);
}


// ===============================
// PLAYER NORMAL PULL
// ===============================

pullButton.addEventListener("click", normalPull);

function normalPull() {

    if (!gameActive) {
        return;
    }

    if (playerStamina < 5) {
        return;
    }

    ropePosition -= 4;
    playerStamina -= 5;

    updateGame();
    checkWinner();
}


// ===============================
// PLAYER POWER PULL
// ===============================

powerButton.addEventListener("click", powerPull);

function powerPull() {

    if (!gameActive) {
        return;
    }

    if (playerStamina < 20) {
        return;
    }

    ropePosition -= 12;
    playerStamina -= 20;

    updateGame();
    checkWinner();
}


// ===============================
// PLAYER STAMINA RECOVERY
// ===============================

setInterval(function () {

    if (!gameActive) {
        return;
    }

    if (playerStamina < 100) {

        playerStamina += 2;

        if (playerStamina > 100) {
            playerStamina = 100;
        }

        updateGame();
    }

}, 500);


// ===============================
// BOT
// ===============================

setInterval(function () {

    if (!gameActive) {
        return;
    }


    // Bot rests when tired

    if (botStamina < 15) {

        botStamina += 12;

        if (botStamina > 100) {
            botStamina = 100;
        }

        return;
    }


    // 20% chance of Power Pull

    if (botStamina >= 25 && Math.random() < 0.20) {

        ropePosition += 10;
        botStamina -= 20;

    } else {

        ropePosition += 3;
        botStamina -= 5;
    }


    updateGame();
    checkWinner();

}, 700);


// ===============================
// BOT STAMINA RECOVERY
// ===============================

setInterval(function () {

    if (!gameActive) {
        return;
    }

    if (botStamina < 100) {

        botStamina += 1;

        if (botStamina > 100) {
            botStamina = 100;
        }
    }

}, 500);


// ===============================
// TIMER
// ===============================

setInterval(function () {

    if (!gameActive) {
        return;
    }

    timeLeft--;

    timerText.textContent = timeLeft;


    if (timeLeft <= 0) {

        finishByTime();
    }

}, 1000);


// ===============================
// WIN CONDITION
// ===============================

function checkWinner() {

    if (!gameActive) {
        return;
    }


    if (ropePosition <= -WIN_POSITION) {

        endGame("player");
    }


    if (ropePosition >= WIN_POSITION) {

        endGame("bot");
    }
}


// ===============================
// TIME IS OVER
// ===============================

function finishByTime() {

    if (ropePosition < 0) {

        endGame("player");

    } else if (ropePosition > 0) {

        endGame("bot");

    } else {

        endGame("draw");
    }
}


// ===============================
// END GAME
// ===============================

function endGame(winner) {

    if (!gameActive) {
        return;
    }

    gameActive = false;

    pullButton.disabled = true;
    powerButton.disabled = true;


    if (winner === "player") {

        resultIcon.textContent = "🏆";

        resultTitle.textContent = "YOU WIN!";

        resultMessage.textContent =
            "Great timing! You pulled the bot across the line.";

    }


    if (winner === "bot") {

        resultIcon.textContent = "🤖";

        resultTitle.textContent = "BOT WINS";

        resultMessage.textContent =
            "Almost! Recover your stamina and choose your Power Pull carefully.";

    }


    if (winner === "draw") {

        resultIcon.textContent = "🤝";

        resultTitle.textContent = "DRAW";

        resultMessage.textContent =
            "Perfect balance. Time for a rematch.";
    }


    resultOverlay.classList.remove("hidden");
}


// ===============================
// REMATCH
// ===============================

rematchButton.addEventListener("click", function () {

    startGame();
});


// ===============================
// KEYBOARD CONTROLS
// ===============================

document.addEventListener("keydown", function (event) {

    if (!gameActive) {
        return;
    }


    if (event.code === "Space") {

        event.preventDefault();

        normalPull();
    }


    if (event.code === "KeyE") {

    powerPull();
}
});


// ===============================
// UPDATE SCREEN
// ===============================

function updateGame() {

    rope.style.transform =
        "translateX(" + ropePosition + "px)";

    playerStaminaBar.style.width =
        playerStamina + "%";

    staminaText.textContent =
        Math.round(playerStamina) + "%";

    timerText.textContent = timeLeft;
}