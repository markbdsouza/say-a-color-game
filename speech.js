import { handleResult, score, resetScore } from "./recognitionHandlers.js";
import { isDark, colorsByLength } from "./colors.js";
import {
  colorsEl,
  startButton,
  startButtonSpan,
  resultEl,
  highScoreAmount,
} from "./elements.js";

var recognition;
var timeoutForTimer;
const NUMBER_OF_SECONDS = 30;

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function displayColor(colors) {
  return colors
    .map((color) => {
      return `<span class="color ${color} ${
        isDark(color) ? "dark" : ""
      }" style="background:${color}; padding:5px;">${color}</span>`;
    })
    .join("");
}

function start() {
  if (!("SpeechRecognition" in window) || !window.SpeechRecognition) {
    resultEl.textContent = "Your browser does not support SpeechRecognition";
    resultEl.classList.remove("hide");
    return;
  }
  resultEl.classList.add("hide");
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onresult = handleResult;
  recognition.start();
  return recognition;
}

function stop() {
  recognition.stop();
  startButton.addEventListener("click", handleStartClick, { once: true });
  resultEl.classList.remove("hide");
  resultEl.textContent =
    score < 3
      ? `Were you even trying? You scored ${score}`
      : score > 13
      ? `Impressive you scored ${score} ! Thats really great. Try Again? `
      : `Not Bad! You have scored a total of ${score}! Think you can do better? Try Again!`;
  setHighScore(score);
  resetScore();
}

function counter(TimeCounterInMS, COUNT_PERIOD_IN_MS, element) {
  var seconds = parseInt(TimeCounterInMS / 1000);
  var milliSeconds = parseInt(TimeCounterInMS % 1000)
    .toString()
    .slice(0, 1);
  const span = element.querySelector("span");
  span.textContent = `${seconds}.${milliSeconds}`;
  TimeCounterInMS = TimeCounterInMS - COUNT_PERIOD_IN_MS;
  if (TimeCounterInMS < 0) {
    clearInterval(timeoutForTimer);
    stop();
    span.textContent = `Retry`;
    return;
  }
  return TimeCounterInMS;
}

function startTimer(durationSeconds, element) {
  const COUNT_PERIOD_IN_MS = 100;
  var TimeCounterInMS = durationSeconds * 1000;
  timeoutForTimer = setInterval(() => {
    TimeCounterInMS = counter(TimeCounterInMS, COUNT_PERIOD_IN_MS, element);
  }, COUNT_PERIOD_IN_MS);
}

function handleStartClick(e) {
  recognition = start();
  if (!!recognition) {
    startTimer(NUMBER_OF_SECONDS, e.currentTarget);
  }
}

function setHighScore(score) {
  var highScore = +highScoreAmount.textContent;
  highScore = score > highScore ? score : highScore;
  highScoreAmount.textContent = highScore;
  localStorage["highScore"] = `${highScore}`;
}

colorsEl.innerHTML = displayColor(colorsByLength);
startButton.addEventListener("click", handleStartClick, { once: true });
highScoreAmount.textContent = localStorage["highScore"] || "0";
