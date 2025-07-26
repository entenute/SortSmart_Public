const openBtn = document.getElementById("openNav");
const closeBtn = document.getElementById("closeNav");
const menu = document.getElementById("menu");
const headline = document.getElementById("headlinemenue");
const headerline = document.getElementById("headerline");
//Nur ein paar Eventlisteners für das Menue
openBtn.addEventListener("click", () => {
  menu.classList.add("show");
  content.classList.add("blur");
  headerline.classList.add("blur");

 headline.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" }); // <- Hier wird nach oben gescrollt
});

closeBtn.addEventListener("click", () => {
  menu.classList.remove("show");
  content.classList.remove("blur");
  headerline.classList.remove("blur");
});