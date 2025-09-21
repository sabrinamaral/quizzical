import { decode } from "html-entities";
import { useEffect, useState } from "react";
import { shuffleArray } from "./utils";

export default function Questions() {
  const [data, setData] = useState([]);
  const [shuffledAnswer, setShuffledAnswer] = useState([]);
  const [userAnswer, setUserAnswer] = useState({});
  const [showCorrects, setShowCorrects] = useState(false);
  const [answerCheck, setAnswerCheck] = useState([]);

  // FETCH DATA IN THE TRIVIA API
  useEffect(() => {
    fetchQuestions();
  }, []);

  function fetchQuestions() {
    fetch(
      "https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple"
      // "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
    )
      .then((respond) => respond.json())
      .then((data) => {
        const decodedData = data.results.map((result) => ({
          question: decode(result.question),
          correctAnswer: decode(result.correct_answer),
          incorrectAnswers: result.incorrect_answers.map((inc_answer) =>
            decode(inc_answer)
          ),
        }));
        setData(decodedData);
      });
  }

  // SHUFFLE THE ANSWERS
  useEffect(() => {
    const arrAnswers = data.map((elem) => {
      return shuffleArray([...elem.incorrectAnswers, elem.correctAnswer]);
    });
    setShuffledAnswer(arrAnswers);
  }, [data]);

  // SAVE THE USER ANSWER IN STATE
  function chooseAnswer(answer, questionIndex) {
    setUserAnswer((prev) => ({ ...prev, [questionIndex]: answer }));
  }

  // CHECK WHICH ANSWER IS CORRECT
  function checkAnswers() {
    setShowCorrects(true);
    const results = data.map((elem, questionIndex) => {
      elem.correctAnswer === userAnswer[questionIndex];
      return userAnswer[questionIndex];
    });
    setAnswerCheck(results);
  }

  // RESET THE GAME
  function resetGame() {
    setUserAnswer({});
    setShowCorrects(false);
    setAnswerCheck([]);
    fetchQuestions();
  }
  // RENDER DATA FROM THE API
  const questionsElements = data.map((elem, index) => {
    const answers = shuffledAnswer[index]; // answers for each question

    return (
      <section className="quiz-content" key={elem.correctAnswer}>
        <p>{elem.question}</p>
        <section className="answers">
          {answers?.map((answer) => {
            const isSelected = userAnswer[index] === answer;
            const isCorrect = answerCheck[index] === elem.correctAnswer;
            const isAnySelected = userAnswer[index] !== undefined;

            let classColor;
            if (showCorrects && isSelected) {
              if (isCorrect) {
                classColor = "correct";
              } else {
                classColor = "incorrect";
              }
            } else if (isSelected) {
              classColor = "selected";
            }

            return (
              <button
                disabled={isAnySelected && !isSelected}
                className={classColor}
                onClick={() => chooseAnswer(answer, index)}
                key={answer}
              >
                {answer}
              </button>
            );
          })}
        </section>
        {showCorrects && (
          <span className="correct-answer">
            {" "}
            Correct answer: {elem.correctAnswer}
          </span>
        )}
      </section>
    );
  });

  return (
    <>
      <section>{questionsElements}</section>
      {showCorrects ? (
        <button className="check-answers" onClick={resetGame}>
          Play again
        </button>
      ) : (
        <button onClick={checkAnswers} className="check-answers">
          Check answers
        </button>
      )}
    </>
  );
}
