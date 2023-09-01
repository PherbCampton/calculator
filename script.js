const themeToggle = document.getElementById("themeToggle");
const toggleText = document.querySelector(".toggleText");
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
