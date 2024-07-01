import React from "react";
import classNames from "classnames";
import BoxAnswer from "./components/BoxAnswer";
import BoxQuestion from "./components/BoxQuestion";

const GameContent = ({
  question,
  answer,
  droppedAreas,
  isViewOnly = false,
  hideResultAnswer = false,
  onDropItem,
}) => {
  const { questions, typeQuestion } = question;
  const { answers, typeAnswer, widthImage, numberAnswersInRow } = answer;
  const columns = questions.length;

  const remainingAnswers = answers.filter(
    (answerItem) =>
      !droppedAreas.some((area) => area.answerId === answerItem.answerId)
  );

  return (
    <div className="game-content__wrapper">
      <div className="answer-content__wrapper">
        {remainingAnswers.map((answerItem) => {
          const boxAnswerContainClass = numberAnswersInRow ? `d-flex justify-content-center col-md-${12 / numberAnswersInRow}` : "";
          const boxAnswerContainStyle = { width: numberAnswersInRow > 4 ? `${100/numberAnswersInRow}%` : "auto" }
          return (
            <div key={answerItem.answerId} className={boxAnswerContainClass} style={boxAnswerContainStyle}>
              <BoxAnswer
                answerItem={answerItem}
                typeAnswer={typeAnswer}
                widthImage={widthImage}
                isViewOnly={isViewOnly}
              />
            </div>
          );
        })}
      </div>
      <div className="question-content__wrapper">
        {questions.map((questionItem) => (
          <div
            key={questionItem.questionId}
            columns={columns}
            className={classNames({
              [`col-md-${12 / columns}`]: columns < 5,
              "p-2 widthDrop": columns > 4,
            })}
            style={{padding: "0 16px"}}
          >
            <BoxQuestion
              questionItem={questionItem}
              typeQuestion={typeQuestion}
              typeAnswer={typeAnswer}
              widthImage={widthImage}
              droppedAreas={droppedAreas}
              isViewOnly={isViewOnly}
              hideResultAnswer={hideResultAnswer}
              onDropItem={onDropItem}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameContent;

