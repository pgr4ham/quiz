 // Get the HTML element with the ID "highScoresList" and assign it to the highScoresList variable.
const highScoresList = document.getElementById("highScoresList");

// Retrieve high scores from local storage and parse the JSON data. If no high scores are found, initialize an empty array.
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; 

highScoresList.innerHTML = highScores
  .map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;  // Create an HTML list item for each high score, displaying the name and score.
  })
  .join(""); // Convert the array of list items to a string and assign it as the inner HTML of the highScoresList element.



