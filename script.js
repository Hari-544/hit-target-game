let score = 0;
let timeLeft = 30;
let moveInterval;
let timerInterval;
let gameRunning = false;
let imageUploaded = false;

const target = document.getElementById("target");
const targetImage = document.getElementById("targetImage");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const upload = document.getElementById("uploadImage");
const startButton = document.getElementById("startButton");
const statusText = document.getElementById("statusText");
const scoreBoard = document.getElementById("scoreBoard");
const finalScore = document.getElementById("finalScore");
const toast = document.getElementById("toast");

const hitsound = document.getElementById("hitsound");
const gameoverSound = document.getElementById("gameover");

const moveDelay = 100;
let toastTimeout;

upload.addEventListener("change", () => {
  const file = upload.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    targetImage.src = event.target.result;
    imageUploaded = true;
    scoreBoard.hidden = true;
    target.classList.add("toy-ready");
    statusText.textContent =
      "Your image is now wrapped into a bowling-pin toy target. Press Start Game and hit it to score.";
  };

  reader.readAsDataURL(file);
});

startButton.addEventListener("click", startGame);

function startGame() {
  if (!imageUploaded) {
    statusText.textContent =
      "Please upload an image first so it can become a toy target.";
    return;
  }

  clearInterval(moveInterval);
  clearInterval(timerInterval);

  score = 0;
  timeLeft = 30;
  gameRunning = true;

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  scoreBoard.hidden = true;
  statusText.textContent =
    "Game started! Hit the bowling-pin toy target to increase your score.";

  target.style.display = "flex";
  moveTarget();

  moveInterval = setInterval(moveTarget, moveDelay);
  timerInterval = setInterval(updateTimer, 1000);
}

function moveTarget() {
  const maxX = Math.max(gameArea.clientWidth - target.offsetWidth, 0);
  const maxY = Math.max(gameArea.clientHeight - target.offsetHeight, 0);

  const randomX = Math.floor(Math.random() * (maxX + 1));
  const randomY = Math.floor(Math.random() * (maxY + 1));

  target.style.left = randomX + "px";
  target.style.top = randomY + "px";
}

function hitTarget() {
  if (!gameRunning) {
    return;
  }

  score++;
  scoreDisplay.textContent = score;

  // 🔊 Play hit sound
  hitsound.currentTime = 0;
  hitsound.play();

  moveTarget();
}

target.addEventListener("click", hitTarget);

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
document.addEventListener("copy", (event) => {
  event.preventDefault();
});
document.addEventListener("cut", (event) => {
  event.preventDefault();
});
document.addEventListener("dragstart", (event) => {
  event.preventDefault();
});
document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const isModifierPressed = event.ctrlKey || event.metaKey;

  if (
    isModifierPressed &&
    (key === "c" || key === "x" || key === "a" || key === "s" || key === "u")
  ) {
    event.preventDefault();
  }

  if (key === "f12") {
    event.preventDefault();
  }
});

target.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
target.addEventListener("dragstart", (event) => {
  event.preventDefault();
});
target.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    hitTarget();
  }
});

function updateTimer() {
  timeLeft--;
  timeDisplay.textContent = timeLeft;

  if (timeLeft > 0) {
    return;
  }

  clearInterval(moveInterval);
  clearInterval(timerInterval);

  gameRunning = false;
  target.style.display = "none";

  // 🔊 Play game over sound
  gameoverSound.currentTime = 0;
  gameoverSound.play();

  finalScore.textContent = score;
  scoreBoard.hidden = false;

  showToast("Game Over! Your score: " + score);
  resetGameForNextRound();
}

function resetGameForNextRound() {
  score = 0;
  timeLeft = 30;
  imageUploaded = false;

  upload.value = "";
  targetImage.src = "";
  target.classList.remove("toy-ready");

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  statusText.textContent =
    "Time is up. Upload a new image to create the next bowling-pin toy target.";
}

function showToast(message) {
  clearTimeout(toastTimeout);

  toast.textContent = message;
  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}
