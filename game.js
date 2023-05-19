// Initialise the needed variables
// Variable assignments for key elements of the web app's user interface and functionality
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const textstatus = document.getElementById('textstatus');

// Retrieve the value of "selectedOption" from the local storage and assign it to the selectedOption variable. This will be the games difficulty
const selectedOption = localStorage.getItem("selectedOption");

// Standard Variables
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let questions = [];

// Gather questions and answers from database API with changeable difficulty, type, category, amount
// Using string interpolation the direct value gathered from the local storage from index.html can be passed into the apilink directly
let apilink = `https://opentdb.com/api.php?amount=10&category=27&difficulty=${selectedOption}&type=multiple`;

fetch(
    apilink // Fetch Questions + Answers from the specified API link.
)
    .then((res) => {
        return res.json(); // Convert the response to JSON format.
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            }; // Map the loaded questions to a new formatted question object.

            const answerChoices = [...loadedQuestion.incorrect_answers]; // Create an array of answer choices including incorrect answers.
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1; // Randomly assign the correct answer index (1-4) to the formatted question.
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );
            // Insert the correct answer into the answer choices array at the correct index.

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });
            // Assign the answer choices to the formatted question object.

            return formattedQuestion; // Return the formatted question
        });

        startGame(); // Start the game
    })
    .catch((err) => { // Error Handling
        console.error(err); // Send Error to console to view what error was caught
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0; // Reset the question counter to 0, indicating the start of a new game.
    score = 0; // Reset the score to 0 at the beginning of a new game.
    availableQuesions = [...questions]; // Create a copy of the questions array and assign it to the availableQuesions variable.
    getNewQuestion(); // Call the getNewQuestion() function to display the first question.
    game.classList.remove('hidden');  // Remove the 'hidden' class from the game element to make it visible on the screen.
    loader.classList.add('hidden'); // Add the 'hidden' class to the loader element to hide it from the screen
};

getNewQuestion = () => {
    // If there are no more available questions or the maximum number of questions have been reached, store the user's score in the local storage as 'mostRecentScore'.
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('./end.html');
    }
    // Increase Question counter when called 0/10 -> 1/10
    questionCounter++;

    // Display question status in format eg. Question 1/10
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length); // Generate a random index within the range of available questions.
    currentQuestion = availableQuesions[questionIndex]; // Retrieve the current question object based on the generated index.
    question.innerHTML = currentQuestion.question; // Set the inner HTML of the question element to display the current question.
    // This code snippet selects a random question from the available questions array using a randomly generated index. The current question object is then assigned to the "currentQuestion" variable. Finally, the inner HTML of the question element is updated to display the question text.


    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number]; // Assign the choice text from currentQuestion to the choice element
    });

    availableQuesions.splice(questionIndex, 1); // Remove the current question from the available questions array
    acceptingAnswers = true; // Enable accepting answers for the next question
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {

         // If the application is not currently accepting answers, exit the function and do not proceed further.
        if (!acceptingAnswers) return;

        acceptingAnswers = false;

        // Create constants to store selected choice and current dataset
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        // Determine the CSS class to apply based on whether the selected answer matches the correct answer of the current question.
        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            textstatus.style.display = 'block';
            textstatus.classList.remove('incorrect');
            textstatus.textContent = "Correct! Good Job" // Display a message indicating that the selected choice is correct
            incrementScore(CORRECT_BONUS); // Increment the score for a correct answer
        }
        else{
            textstatus.style.display = 'block';
            textstatus.textContent = "Wrong! That's Ok" // Display a message indicating that the selected choice is incorrect
            textstatus.classList.add('incorrect');
        }

        selectedChoice.parentElement.classList.add(classToApply); // Apply a CSS class to visually indicate the correctness of the selected choice

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            textstatus.style.display = 'none'; // Hide the text status message after a certain delay
            getNewQuestion(); // Load the next question
        }, 1500); // Set a delay of 1.5 seconds before proceeding to the next question
    });
});

incrementScore = (num) => {
      score += num; // Increment the score by the given number
      scoreText.innerText = score; // Update the score text element with the new score
};
