// Store Difficulty into local storage to access from game
const dropdown = document.getElementById("difficultyDropdown");
const startgame = document.getElementById("startgame");


// Store Selected Option
startgame.addEventListener("click", function() {
    const selectedOption = dropdown.value;
    localStorage.setItem("selectedOption", selectedOption);
  });