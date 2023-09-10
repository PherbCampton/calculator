const themeToggle = document.getElementById("themeToggle");
const toggleText = document.querySelector(".toggleText");
const equal = document.querySelector("#equal");
const form = document.querySelector("form");
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");
const resultEL = document.querySelector(".result");
const body = document.body;
const root = document.documentElement;

let result = "";
let current = "";
let inputDisplay = "";
let evaluation = false;
let basicOperations = { "+": "+", "/": "/", "*": "*", "-": "-" };

root.style.setProperty("--width-to-match", `${resultEL.clientWidth}px`);

// THEME TOGGLE FUNCTIONALITY

const theme = (theme, inverse = theme === "dark" ? "light" : "dark") => {
  themeToggle.checked = theme === "dark" ? true : false;
  body.classList.remove(`${inverse}-theme`);
  body.classList.add(`${theme}-theme`);
  localStorage.setItem("theme", `${theme}-theme`);
};

function themeSwitch() {
  if (this.checked === true) theme("dark");
  else theme("light");
}

themeToggle.addEventListener("click", themeSwitch);

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  body.classList.add(savedTheme);
  if (savedTheme === "dark-theme") theme("dark");
  else theme("light");
}

// ENTER BUTTON PERFORMS EVALUATION

form.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    equal.click();
  }
});

function formatted(number, digitThreshold = 10) {
  const digitCount = `${number}`.replace(/^0+|\.+/g, "").length;
  if (digitCount > digitThreshold) {
    return number.toExponential(7).replace("+", "");
  } else {
    return number.toLocaleString();
  }
}

buttons.addEventListener("click", function (e) {
  // TARGETTING EQUAL TO BUTTON
  if (e.target.value === "=") {
    Object.keys(basicOperations).forEach((n) => {
      if (result.split("").includes(n)) {
        if (basicOperations.hasOwnProperty(result.at(-1)) && current) {
          evaluation = true;
          result += current.replace(/^0+(?!\.)/, "") || "0";
          inputDisplay = `= ` + `${formatted(eval(result))}`;
          current = "";
        }
      }
    });
  }

  // TARGETTING CLEAR ALL (C) BUTTON
  if (e.target.value === "C") {
    inputDisplay = result = current = "";
    evaluation = false;
  }

  // TARGETTING SQUARE ROOT, PERCENTAGE AND MINUS/PLUS (√, %, ±) BUTTON
  if (
    (e.target.value === "√" ||
      e.target.value === "%" ||
      e.target.value === "±") &&
    inputDisplay !== "" &&
    inputDisplay !== "0"
  ) {
    if (evaluation === true) {
      current = eval(result);
      evaluation = false;
    }
    if (
      result.split("").includes(e.target.value) ||
      !basicOperations.hasOwnProperty(result.at(-1))
    ) {
      result =
        e.target.value === "√" || e.target.value === "±"
          ? e.target.value + current
          : current + e.target.value;
      current =
        e.target.value === "√"
          ? `${formatted(Math.sqrt(eval(current)))}`
          : e.target.value === "%"
          ? `${formatted(eval(current / 100))}`
          : `${formatted(eval(-current))}`;
      inputDisplay = `= ` + current;
    }
  }

  // TARGETTING BACKSPACE (DEL) TO BUTTON
  if (e.target.value === "DEL") {
    current = current.toString().slice(0, -1);
    inputDisplay = current;
  }

  // TARGETTING ALL NUMBER BUTTONS
  if (!isNaN(+e.target.value)) {
    if (
      result.split("").includes("√") ||
      result.split("").includes("%") ||
      result.split("").includes("±")
    ) {
      current = result = "";
    }
    if (result && basicOperations.hasOwnProperty(result.at(-1))) {
      inputDisplay = current;
      evaluation = false;
    }
    if (evaluation === true) {
      result = current;
    }
    current += e.target.value;
    inputDisplay = current;
    evaluation = false;
  }

  // TARGETTING BASIC OPERATION (+,-,/,*) BUTTONS
  if (e.target.classList.contains("b-operators")) {
    if (
      result.split("").includes("√") ||
      result.split("").includes("%") ||
      result.split("").includes("±")
    ) {
      result = "";
    }
    if (eval(current.replace(/^0+(?!\.)/, "") || "0") != "0") {
      result +=
        (current.replace(/^0+(?!\.)/, "") || "0") +
        `${e.target.dataset.operation}`;
      current = "";
    }
    if (result && !basicOperations.hasOwnProperty(result.at(-1))) {
      result += `${e.target.dataset.operation}`;
    }
    if (basicOperations.hasOwnProperty(result.at(-1))) {
      result = result.slice(0, -1) + `${e.target.dataset.operation}`;
    }
  }

  // TARGETTING DOT (.) BUTTON
  if (e.target.value === ".") {
    if (current === "") {
      inputDisplay = current = 0 + e.target.value;
    }
    if (!current.includes(".")) {
      inputDisplay += ".";
      current += ".";
    }
  }

  resultEL.textContent = result.replace(/^0+(?!\.)/, "");
  display.value = inputDisplay.startsWith(".")
    ? "0" + inputDisplay.replace(/^0+(?!\.)/, "")
    : inputDisplay.replace(/^0+(?!\.)/, "");
});
