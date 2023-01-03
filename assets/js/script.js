// DOM Elements
const highScoreBtn = document.querySelector('#high-score-btn');
const startBtn = document.querySelector('#start-btn');
const timerDisplay = document.querySelector('#timer');
const mainSection = document.querySelector('main');
const headingText = document.querySelector('#heading-text');
const quizList = document.querySelector('#quiz-list');

// Declare variables and initialise quiz questions
const highscores = [];
const questions = [
  {
    question: '',
    answers: [],
  },
  {
    question: '',
    answers: [],
  },
  {
    question: '',
    answers: [],
  },
  {
    question: '',
    answers: [],
  },
];
// Add event listeners
highScoreBtn.addEventListener('click', (event) => {});
startBtn.addEventListener('click', startGame)

// Initialise game

// Start game
function startGame() {
  
}

// Local storage functions

// View Highscores functions
