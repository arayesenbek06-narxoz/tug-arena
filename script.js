// =========================
// MATCH STATISTICS
// =========================

let wins = Number(localStorage.getItem("tugWins")) || 0;
let losses = Number(localStorage.getItem("tugLosses")) || 0;
let matches = Number(localStorage.getItem("tugMatches")) || 0;

function updateStatsDisplay() {
    document.getElementById("wins").textContent = wins;
    document.getElementById("losses").textContent = losses;
    document.getElementById("matches").textContent = matches;
}

function saveStats() {
    localStorage.setItem("tugWins", wins);
    localStorage.setItem("tugLosses", losses);
    localStorage.setItem("tugMatches", matches);

    updateStatsDisplay();
}

function recordWin() {
    wins++;
    matches++;
    saveStats();
}

function recordLoss() {
    losses++;
    matches++;
    saveStats();
}

updateStatsDisplay();
// ===============================
// ELEMENTS
// ===============================

const playButton = document.getElementById("playButton");
const mainMenu = document.getElementById("mainMenu");
const gameScreen = document.getElementById("gameScreen");

const pullButton = document.getElementById("pullButton");
const powerButton = document.getElementById("powerButton");

const rope = document.getElementById("rope");
const playerCharacter = document.getElementById("playerCharacter");
const botCharacter = document.getElementById("botCharacter");

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

let difficulty = localStorage.getItem("tugDifficulty") || "normal";

const WIN_POSITION = 280;

// =============================
// DIFFICULTY SELECTION
// =============================

const difficultyButtons = document.querySelectorAll(".difficulty-btn");

difficultyButtons.forEach(function (button) {

    // Show saved difficulty as active
    if (button.dataset.difficulty === difficulty) {
        difficultyButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    }

    button.addEventListener("click", function () {

        difficulty = button.dataset.difficulty;

        localStorage.setItem("tugDifficulty", difficulty);

        difficultyButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

    });

});
// ============================
// ROPE ANIMATION
// ============================

function animateRope(type) {
    rope.classList.remove("pull-effect", "power-effect");

    // Restart animation
    void rope.offsetWidth;

    if (type === "power") {
        rope.classList.add("power-effect");
    } else {
        rope.classList.add("pull-effect");
    }

    setTimeout(function () {
        rope.classList.remove("pull-effect", "power-effect");
    }, 400);
}
// ============================
// CHARACTER ANIMATION
// ============================

function animateCharacters(type) {

    playerCharacter.classList.remove(
        "player-pull",
        "player-power"
    );

    botCharacter.classList.remove(
        "bot-hit",
        "bot-power-hit"
    );

    void playerCharacter.offsetWidth;
    void botCharacter.offsetWidth;

    if (type === "power") {
        playerCharacter.classList.add("player-power");
        botCharacter.classList.add("bot-power-hit");
    } else {
        playerCharacter.classList.add("player-pull");
        botCharacter.classList.add("bot-hit");
    }

    setTimeout(function () {
        playerCharacter.classList.remove(
            "player-pull",
            "player-power"
        );

        botCharacter.classList.remove(
            "bot-hit",
            "bot-power-hit"
        );
    }, 450);
}

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

animateRope("normal");
animateCharacters("normal");

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

    animateRope("power");
    animateCharacters("power");

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


    // Bot behavior depends on difficulty

let powerChance;
let normalPull;
let powerPull;

if (difficulty === "easy") {
    powerChance = 0.10;   // 10% Power Pull
    normalPull = 2;
    powerPull = 8;
}

else if (difficulty === "hard") {
    powerChance = 0.40;   // 40% Power Pull
    normalPull = 4;
    powerPull = 12;
}

else {
    powerChance = 0.20;   // NORMAL: 20%
    normalPull = 3;
    powerPull = 10;
}

if (botStamina >= 25 && Math.random() < powerChance) {

    ropePosition += powerPull;
    botStamina -= 20;

} else {

    ropePosition += normalPull;
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

        document.body.classList.add("victory-effect");

setTimeout(function () {
    document.body.classList.remove("victory-effect");
}, 1000);

        recordWin();

        resultIcon.textContent = "🏆";

        resultTitle.textContent = "YOU WIN!";

        resultMessage.textContent =
            "Great timing! You pulled the bot across the line.";

    }


    if (winner === "bot") {

        document.body.classList.add("defeat-effect");

setTimeout(function () {
    document.body.classList.remove("defeat-effect");
}, 700);

        recordLoss();

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
