// Variables
const burger = document.querySelector(".nav__burger");
const lines = document.querySelectorAll(".nav__line");
const list = document.querySelector(".nav__list");

burger.addEventListener("click", (e) => {
  lines.forEach((line, index) => {
    line.classList.toggle("nav__line" + (index + 1));
  });
  list.classList.toggle("nav__show");
});
