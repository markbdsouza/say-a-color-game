import { isValidColor, invertColor } from "./colors.js";

export var score = 0;

function logwords(results) {
  console.log(results[results.length - 1][0].transcript);
  return results[results.length - 1][0].transcript;
}

export function handleResult(event) {
  const words = logwords(event.results);
  //check if valid color
  let color = words.toLowerCase();
  color = color.replace(/\s/g, "");
  if (!isValidColor(color)) return;
  setStyles(color);
}

function setStyles(color) {
  const invertedColor = invertColor(color) || "#000";
  const span = document.querySelector(`.${color}`);
  if (!span.classList.contains("got")) {
    score++;
  }
  span.classList.add("got");
  let root = document.documentElement;
  root.style.setProperty("--main-bg-color", color);
  root.style.setProperty("--secondary-bg-color", invertedColor);
}

export function resetScore() {
  score = 0;
}
