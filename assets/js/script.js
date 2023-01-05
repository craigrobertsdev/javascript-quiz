// DOM Elements
const highScoreBtn = document.querySelector('#high-score-btn');
const startBtn = document.querySelector('#start-btn');
const timerDisplay = document.querySelector('#timer');
const mainSection = document.querySelector('main');
const headingText = document.querySelector('#heading-text');

// Declare variables and initialise quiz questions
const highscores = [];
let questions = setQuestions();
let gameOver = false;
let questionsLeft = questions.length;
let currentQuestion, timer;
let timeRemaining = 0;

function setQuestions() {
  return [
    {
      question:
        'What array function returns a new array after performing the same action on each element?',
      options: ['array.map', 'array.forEach', 'array.filter', 'array.reduce'],
      correct: 1,
    },
    {
      question: 'What is the spread syntax for iterable objects?',
      options: ['?', '...', ';', '!'],
      correct: 2,
    },
    {
      question: 'Which company designed the React.js library?',
      options: ['Google', 'Amazon', 'Meta', 'Apple'],
      correct: 3,
    },
    {
      question:
        'How would you describe a function that calls itself repeatedly until a certain condition is met?',
      options: ['reflective', 'recursive', 'infinite', 'introspective'],
      correct: 2,
    },
  ];
}

// Add event listeners
highScoreBtn.addEventListener('click', (event) => {});
startBtn.addEventListener('click', startGame);

// Initialise game
function init() {
  // get highscores from local storage
  getHighScores();
}

// Game loop
function startGame() {
  clearMainSection();
  setTimer();
  displayQuestion(questions[Math.floor(Math.random() * questions.length)]);
}

function clearMainSection() {
  mainSection.innerHTML = '';
}

function setTimer() {
  timeRemaining = 60;
  timerDisplay.textContent = 'Time: ' + timeRemaining;

  timer = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = 'Time: ' + timeRemaining;
    if (timeRemaining === 0 || gameOver) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function displayQuestion(nextQuestion) {
  currentQuestion = nextQuestion;
  const quizList = document.createElement('ul');
  const questionTextEl = document.createElement('h1');
  questionTextEl.textContent = nextQuestion.question;
  mainSection.appendChild(questionTextEl);

  // Create a new <li> for each option for the nextQuestion. Add event handler to it then append it to the quizList
  for (let i = 0; i < nextQuestion.options.length; i++) {
    const option = nextQuestion.options[i];
    // Create empty list item for each question
    const optionEl = document.createElement('li');

    // Create button for answer and add text to it
    const answerBtn = document.createElement('btn');
    answerBtn.textContent = `${i + 1}. ${option}`;
    // dataset.key to be read when checking to see if the answer is correct
    answerBtn.dataset.key = i + 1;
    optionEl.append(answerBtn);
    optionEl.addEventListener('click', selectAnswer);
    quizList.append(optionEl);
    mainSection.append(quizList);
  }

  function selectAnswer(event) {
    event.preventDefault();
    console.log(event);
    /* Need to determine whether the chosen answer was the correct one. if not, deduct 10 seconds from time remaining*/
    if (event.target.dataset.key !== currentQuestion.correct) {
      timeRemaining -= 10;
    }

    clearMainSection();

    let index = questions.indexOf(nextQuestion);
    questions.splice(index, 1);

    if (questions.length === 0) {
      gameOver = true;
      return;
    }
    displayQuestion(questions[Math.floor(Math.random() * questions.length)]);
  }
}

// displays a congratulations message, field to enter initials and the final score
function endGame() {
  clearMainSection();
  clearInterval(timer);
  const endMessage = document.createElement('h1');
  endMessage.textContent = 'Game over, thanks for playing!';
  mainSection.append(endMessage);

  const scoreCard = document.createElement('p');
  scoreCard.textContent = `Your final score is: ${timeRemaining}`;
  mainSection.append(scoreCard);

  const label = document.createElement('label');
  label.textContent = 'Enter your initials';

  const initialsInput = document.createElement('input');
  mainSection.append(initialsInput);
  // button that handles the accepting of the initials and saves the score to local storage
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit';
  mainSection.append(submitBtn);

  submitBtn.addEventListener('click', handleSubmit);
  // additional event listener to enable enter key to be pressed once initials are entered.
  submitBtn.addEventListener('keyup', handleSubmit);

  function handleSubmit(event) {
    event.preventDefault();

    // Only respond to enter or clicking of button with mouse
    if (event.keyCode === 13 || event instanceof PointerEvent) {
    }
  }
}

// Local storage functions

function getHighScores() {
  highscores = JSON.parse(localStorage.getItem('highscores'));
}

function setHighScores(initials, score) {
  highscores.push({ initials: initials, score: score });
  localStorage.setItem('highscores', JSON.stringify(highscores));
}
