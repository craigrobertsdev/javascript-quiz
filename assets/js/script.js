// DOM Elements
const highScoreBtn = document.querySelector('#high-score-btn');
const startBtn = document.querySelector('#start-btn');
const timerDisplay = document.querySelector('#timer');
const mainSection = document.querySelector('main');
const headingText = document.querySelector('#-text');

// Declare variables and initialise quiz questions
let highscores = [];
let questionsLeft;
let questions = [];
let gameOver = false;
let currentQuestion, timer;
let timeRemaining = 0;

// provides the base set of questions for each round of the game. these will be randomly chosen based on what remains each time a new question is generated
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
highScoreBtn.addEventListener('click', displayHighScores);
startBtn.addEventListener('click', startGame);

// Initialise game
function init() {
  // get highscores from local storage
  getHighScores();
  console.log(localStorage.getItem('highscores'));
}

// Game loop
function startGame() {
  clearMainSection();
  setTimer();
  // in case of replay, ensure questions array is populated
  if (questions.length === 0) {
    questions = setQuestions();
    questionsLeft = questions.length;
    gameOver = false;
  }
  highScoreBtn.style.display = 'hidden';
  displayQuestion(questions[Math.floor(Math.random() * questions.length)]);
}

// clears main body of document for each screen
function clearMainSection() {
  mainSection.innerHTML = '';
}

// starts 60 second timer and
function setTimer() {
  timeRemaining = 60;
  timerDisplay.textContent = 'Time: ' + timeRemaining;

  timer = setInterval(() => {
    timeRemaining--;
    displayRemainingTime();
    if (timeRemaining <= 0 || gameOver) {
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
    const answerBtn = document.createElement('button');
    answerBtn.classList.add('answer-btn');
    answerBtn.textContent = `${i + 1}. ${option}`;
    // dataset.key to be read when checking to see if the answer is correct
    answerBtn.dataset.key = i + 1;
    answerBtn.addEventListener('click', selectAnswer);
    optionEl.append(answerBtn);
    quizList.append(optionEl);
    mainSection.append(quizList);
  }

  function selectAnswer(event) {
    event.preventDefault();
    // Determine whether the chosen answer was the correct one. if not, deduct 10 seconds from time remaining
    //  != used here instead of !== as this section relies on JavaScript's type coercion.
    if (event.target.dataset.key != currentQuestion.correct) {
      timeRemaining -= 10;
    }

    clearMainSection();

    // Remove question from questions
    let index = questions.indexOf(nextQuestion);
    questions.splice(index, 1);
    displayRemainingTime();

    // If no more questions, the game is over. Return to prevent continuing to access an empty array.
    if (questions.length === 0) {
      gameOver = true;
      clearInterval(timer);
      endGame();
      return;
    }
    displayQuestion(questions[Math.floor(Math.random() * questions.length)]);
  }
}

// displays a congratulations message, field to enter initials and the final score
function endGame() {
  clearMainSection();
  timerDisplay.textContent = '';
  const endMessage = document.createElement('h1');
  endMessage.classList.add('end-msg');
  endMessage.textContent = 'Game over, thanks for playing!';
  mainSection.append(endMessage);

  const scoreCard = document.createElement('h2');
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

  submitBtn.addEventListener('click', function (event) {
    event.preventDefault();

    // ensure initials field is not blank
    if (initialsInput.value) {
      setHighScores(initialsInput.value.toUpperCase(), timeRemaining);
      displayHighScores();
    }
  });
}

// called by both the setTimer and select answer function to ensure time is correct even if user clicks too quickly.
function displayRemainingTime() {
  timerDisplay.textContent = 'Time: ' + timeRemaining;
}
// additional event listener to enable enter key to be pressed once initials are entered.

function displayHighScores() {
  clearMainSection();
  clearInterval(timer);

  // display highscores only if they exist in local storage
  if (highscores) {
    // sort high scores from highest to lowest
    let sortedhighscores = highscores.sort((a, b) =>
      a.score < b.score ? 1 : a.score > b.score ? -1 : 0
    );

    // create elements for high score display
    const hsHeader = document.createElement('h1');
    hsHeader.textContent = 'High scores';

    const hsList = document.createElement('ul');
    hsList.classList.add('hs-list');

    // button with event handler to clear high scores
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear highscores';
    clearBtn.addEventListener('click', function () {
      localStorage.clear('highscores');
      highscores = null;
      displayHighScores();
      return;
    });

    mainSection.append(clearBtn);

    // iterate over high scores list and display them each as a list item
    sortedhighscores.forEach((score, i) => {
      const hsItem = document.createElement('li');
      hsItem.textContent = `${i + 1}. ${score.initials}: ${score.score}`;
      hsList.append(hsItem);
    });

    mainSection.append(hsHeader);
    mainSection.append(hsList);
  } else {
    // default display if no higjh scores exist
    noScores = document.createElement('h1');
    noScores.textContent = 'There are no scores to display.';
    mainSection.append(noScores);
  }
}

// Local storage functions

function getHighScores() {
  highscores = JSON.parse(localStorage.getItem('highscores'));
}
function setHighScores(initials, score) {
  // if highscores have been cleared, ensure an empty array is created to avoid calling push() on null
  if (!highscores) {
    highscores = [];
  }
  highscores.push({ initials: initials, score: score });
  localStorage.setItem('highscores', JSON.stringify(highscores));
}

// initialise game
init();
