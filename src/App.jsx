import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Question from "./Question";

export default function App() {
  // State variables initialization
  const [on, setOn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [count, setCount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [allCorrect, setAllCorrect] = useState(false);

  // Shuffle array elements
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Fetch questions from the API
  useEffect(() => {
    async function fetchQuestions() {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=5&category=18&type=multiple"
      );
      const data = await response.json();
      let questions = [];
      data.results.forEach((question) => {
        questions.push({
          id: nanoid(),
          answers: shuffleArray([
            ...question.incorrect_answers,
            question.correct_answer,
          ]),
          question: question.question,
          correctAnswer: question.correct_answer,
          selected: null,
          checked: false,
        });
      });
      setQuestions(questions);
    }
    fetchQuestions();
  }, [count]);

  // Handle checking the answers
  function handleCheck() {
    // Check if all questions are answered
    let selected = true;
    questions.forEach((question) => {
      if (question.selected === null) {
        selected = false;
        return;
      }
    });
    if (!selected) {
      return;
    }

    // Mark questions as checked
    setQuestions((questions) =>
      questions.map((question) => {
        return { ...question, checked: true };
      })
    );
    setChecked(true);

    // Count correct answers
    let correct = 0;
    questions.forEach((question) => {
      if (question.correctAnswer === question.selected) {
        correct += 1;
        if (correct === questions.length) {
          setAllCorrect(true);
        }
      }
    });
    setCorrect(correct);
  }

  // Handle clicking on an answer
  function handleAnswerClick(id, answer) {
    setQuestions((questions) =>
      questions.map((question) => {
        return question.id === id
          ? { ...question, selected: answer }
          : question;
      })
    );
  }

  // Reset the quiz
  function handlePlayAgain() {
    setCount((count) => count + 1);
    setChecked(false);
    setAllCorrect(false);
  }

  // Map questions to the Question component
  const quiz = questions
    ? questions.map((question) => {
        return (
          <Question
            key={question.id}
            question={question}
            handleAnswerClick={handleAnswerClick}
            id={question.id}
          />
        );
      })
    : [];

  // Start the quiz
  function startQuiz() {
    setOn((prevOn) => !prevOn);
  }

  // Render components based on the state
  return (
    <>
      {allCorrect && (
        <div className="confetti">
          <Confetti
            colors={[
              "#fef5d0",
              "#fef0b9",
              "#fdeba1",
              "#fde68a",
              "#fce073",
              "#fcdb5b",
              "#fbd644",
              "#fbd12c",
              "#facc15",
              "#e1b813",
              "#c8a311",
              "#af8f0f",
              "#967a0d",
              "#7d660b",
              "#645208",
              "#4b3d06",
              "#322904",
            ]}
          />
        </div>
      )}
      {on ? (
        <div className="quiz-container">
          {quiz}
          <div className="result">
            {checked && (
              <span className="score">
                You scored {correct}/5 correct answers
              </span>
            )}
            <button
              className="check-btn"
              onClick={checked ? handlePlayAgain : handleCheck}
            >
              {checked ? "Play again" : "Check answers"}
            </button>
          </div>
        </div>
      ) : (
        <div className="start-screen">
          <h1>Quzzle</h1>
          <p>Where curiosity meets challenges!</p>
          <button className="start-btn" onClick={startQuiz}>
            Start quiz
          </button>
        </div>
      )}
    </>
  );
}
