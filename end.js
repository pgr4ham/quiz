// This code controls the backend for the END screen after user has completed the quiz.

const username = document.getElementById('username'); // Get the reference to the HTML element with id 'username'
const saveScoreBtn = document.getElementById('saveScoreBtn'); // Get the reference to the HTML element with id 'saveScoreBtn'
const finalScore = document.getElementById('finalScore'); // Get the reference to the HTML element with id 'finalScore'
const mostRecentScore = localStorage.getItem('mostRecentScore'); // Retrieve the value associated with the 'mostRecentScore' key from localStorage

// Retrieve high scores from local storage and parse the JSON data. If no high scores are found, initialize an empty array.
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Set the maximum number of high scores to be displayed
const MAX_HIGH_SCORES = 5;

// Set the text content of the 'finalScore' element to the value of 'mostRecentScore'
finalScore.innerText = mostRecentScore;

// Add an event listener to the 'username' input element for the 'keyup' event
username.addEventListener('keyup', () => {
    // Disable the 'saveScoreBtn' button if the 'username' input value is empty
    saveScoreBtn.disabled = !username.value;
});

// Function to save the high score
saveHighScore = (e) => {
    e.preventDefault();

    // Create an object to store the score and username
    const score = {
        score: mostRecentScore,
        name: username.value,
    };

    // Add the score to the 'highScores' array
    highScores.push(score);

    // Sort the 'highScores' array in descending order based on the score
    highScores.sort((a, b) => b.score - a.score);

    // Keep only the top 5 high scores
    highScores.splice(5);

    // Store the updated 'highScores' array in the local storage as a JSON string
    localStorage.setItem('highScores', JSON.stringify(highScores));

    // Redirect the user to the home page
    window.location.assign('/');
};
