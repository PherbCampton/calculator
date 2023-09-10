// Get references to HTML elements
const themeToggle = document.getElementById("themeToggle");
const toggleText = document.querySelector(".toggleText");
const equal = document.querySelector("#equal");
const form = document.querySelector("form");
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");
const resultEL = document.querySelector(".result");
const body = document.body;
const root = document.documentElement;

// Initialize variables
let result = ""; // Stores the current mathematical expression
let current = ""; // Stores the current user input
let inputDisplay = ""; // Displays the user input and result
let evaluation = false; // Flag to indicate if an evaluation is in progress
let basicOperations = { "+": "+", "/": "/", "*": "*", "-": "-" }; // Basic arithmetic operations

// Set a CSS variable to match the width of the result element
root.style.setProperty("--width-to-match", `${resultEL.clientWidth}px`);

// Theme toggle functionality
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

// Retrieve saved theme from local storage
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  body.classList.add(savedTheme);
  if (savedTheme === "dark-theme") theme("dark");
  else theme("light");
}

// Handle Enter key to trigger evaluation
form.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    equal.click();
  }
});

// Function to format numbers with a digit threshold
function formatted(number, digitThreshold = 10) {
  const digitCount = `${number}`.replace(/^0+|\.+/g, "").length;
  if (digitCount > digitThreshold) {
    return number.toExponential(7).replace("+", "");
  } else {
    return number.toLocaleString();
  }
}

// Event listener for button clicks
buttons.addEventListener("click", function (e) {
  // Handle equal button click
  if (e.target.value === "=") {
    // Check for basic operations in the result
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

  // Handle clear button click
  if (e.target.value === "C") {
    inputDisplay = result = current = "";
    evaluation = false;
  }

  // Handle square root, percentage, and plus/minus button clicks
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

  // Handle backspace button click
  if (e.target.value === "DEL") {
    current = current.toString().slice(0, -1);
    inputDisplay = current;
  }

  // Handle number button clicks
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

  // Handle basic operation button clicks
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

  // Handle dot button click
  if (e.target.value === ".") {
    if (current === "") {
      inputDisplay = current = 0 + e.target.value;
    }
    if (!current.includes(".")) {
      inputDisplay += ".";
      current += ".";
    }
  }

  // Update result and display
  resultEL.textContent = result.replace(/^0+(?!\.)/, "");
  display.value = inputDisplay.startsWith(".")
    ? "0" + inputDisplay.replace(/^0+(?!\.)/, "")
    : inputDisplay.replace(/^0+(?!\.)/, "");
});
