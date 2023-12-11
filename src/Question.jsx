import { nanoid } from "nanoid";
import { decode } from "html-entities";
import PropTypes from "prop-types";

export default function Question(props) {
  let answers = props.question.answers;

  function handleClick(answer) {
    // Prevent further action if the answer is already checked
    if (props.question.checked) {
      return;
    }
    // Handle the clicked answer
    props.handleAnswerClick(props.id, answer);
  }

  // Map answer options to buttons
  const options = answers.map((answer) => {
    let type = null;
    if (props.question.checked) {
      if (props.question.correctAnswer === answer) {
        type = "correct";
      } else if (props.question.selected === answer) {
        type = "incorrect";
      } else {
        type = "non-selected";
      }
    }

    // Render answer button
    return (
      <button
        key={nanoid()}
        id={type}
        className={
          answer === props.question.selected ? "answer selected" : "answer"
        }
        onClick={() => handleClick(answer)}
      >
        {decode(answer)}
      </button>
    );
  });

  // Render the question and its options
  return (
    <div className="question-container">
      <p className="question">{decode(props.question.question)}</p>
      {options}
    </div>
  );
}

// Prop types definition
Question.propTypes = {
  question: PropTypes.shape({
    question: PropTypes.string,
    answers: PropTypes.array,
    checked: PropTypes.bool,
    correctAnswer: PropTypes.string,
    selected: PropTypes.string,
  }),
  handleAnswerClick: PropTypes.func,
  id: PropTypes.string,
};
