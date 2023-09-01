const themeToggle = document.getElementById("themeToggle");
const toggleText = document.querySelector(".toggleText");
const equal = document.querySelector("#equal");
const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");
const display = document.getElementById("display");
const body = document.body;

themeToggle.addEventListener("click", () => {
  if (body.classList.contains("light-theme")) {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    toggleText.innerHTML = "SWITCH TO LIGHT MODE";
  } else {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    toggleText.innerHTML = "SWITCH TO DARK MODE";
  }
});

form.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    equal.click();
  }
});
