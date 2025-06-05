let questions = [];
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let currentUser = "";

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

// --- Login functionality ---
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginContainer = document.getElementById("login-container");
  const quizContent = document.getElementById("quiz-content");
  const loginError = document.getElementById("login-error");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      // Simple check (replace with real authentication if needed)
      if (username && password) {
        currentUser = username;
        loginContainer.style.display = "none";
        quizContent.style.display = "block";
        startQuiz();
      } else {
        loginError.innerText = "Please enter username and password.";
        loginError.style.display = "block";
      }
    });
  }

  // Play again button
  const playAgainBtn = document.getElementById("play-again-btn");
  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", () => {
      document.getElementById("scoreboard").style.display = "none";
      document.getElementById("quiz-content").style.display = "block";
      startQuiz();
    });
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function fetchQuestions() {
  // Fetch 5 random programming questions (includes Python)
  const res = await fetch("https://opentdb.com/api.php?amount=5&category=18&type=multiple");
  const data = await res.json();
  // Convert API format to your format
  questions = data.results.map(q => {
    const answers = [
      ...q.incorrect_answers.map(ans => ({ text: decodeHTML(ans), correct: false })),
      { text: decodeHTML(q.correct_answer), correct: true }
    ];
    // Shuffle answers for each question
    return {
      question: decodeHTML(q.question),
      answers: shuffleArray(answers)
    };
  });
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

async function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerText = "Next";
  questionElement.innerText = "Loading questions...";
  await fetchQuestions();
  shuffledQuestions = questions;
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("wrong");
  }

  Array.from(answerButtons.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });

  nextButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

// Show scoreboard at the end
function showScore() {
  resetState();
  questionElement.innerText = `You scored ${score} out of ${shuffledQuestions.length}!`;
  nextButton.style.display = "none";

  // Save score to localStorage
  let scoreboard = JSON.parse(localStorage.getItem("scoreboard") || "[]");
  scoreboard.push({ user: currentUser, score: score, total: shuffledQuestions.length, time: new Date().toLocaleString() });
  localStorage.setItem("scoreboard", JSON.stringify(scoreboard));

  // Show scoreboard
  showScoreboard();
}

function showScoreboard() {
  document.getElementById("quiz-content").style.display = "none";
  const scoreboardDiv = document.getElementById("scoreboard");
  const scoreList = document.getElementById("score-list");
  scoreboardDiv.style.display = "block";
  scoreList.innerHTML = "";

  // Get and sort scores (latest first)
  let scoreboard = JSON.parse(localStorage.getItem("scoreboard") || "[]").reverse();
  scoreboard.forEach(entry => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${entry.user}</strong> - ${entry.score}/${entry.total} <span style="color:#888;font-size:0.9em;">(${entry.time})</span>`;
    scoreList.appendChild(li);
  });
}

nextButton.addEventListener("click", () => {
  if (nextButton.innerText === "Next") {
    handleNextButton();
  }
});

startQuiz();