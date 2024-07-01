import { forwardRef, useImperativeHandle, useRef } from "react";
import _ from "lodash";
import classNames from "classnames";
import { INNER_WIDTH, PLAY_MODE } from "../const";
import { Button } from "react-bootstrap";
import CustomButton from "src/components/CustomButton";

function CheckAnswer(
  {
    questions,
    onChangeQuestion,
    activeQuestionIndex,
    hasAnsweredChecking,
    isComplete,
    playMode
  },
  ref
) {
  const getStyleButtonQuestionOrder = (hasAnsweredCheck, status) => {
    const style = {
      color: "#000",
      background: "#ced4da",
    }
    if (!_.isNil(status)) {
      style.color = "#fff";
      style.background = "#ff7707";
      if (hasAnsweredCheck || isComplete) {
        style.background = status === true ? "#28a745" : "#dc3545";
      }
    }
    return style;
  };

  const refQuestions = useRef();
  useImperativeHandle(ref, () => ({
    questions: refQuestions.current,
  }));

  const handleClickNextQuestion = (index) => {
    if (!isComplete) {
      onChangeQuestion(index);
    }
  };

  return (
    <div
      ref={refQuestions}
      style={{ overflow: "auto" }}
      className={classNames("pb-3 mb-2 ml-2 ml-md-4 d-flex", {
        "d-flex justify-content-start flex-wrap":
          window.innerWidth > INNER_WIDTH.MOBILE,
      })}
    >
      {questions?.map((question, index) => {
        const buttonStyle = getStyleButtonQuestionOrder(hasAnsweredChecking, question.isCorrect);

        return (
          <div
            key={index}
            className={classNames("mx-2", {
              notLocked: !question?.is_locked,
              "active-question": activeQuestionIndex === index,
              "not-active": activeQuestionIndex !== index
            })}
            activeQuestion={activeQuestionIndex === index}
            isComplete={isComplete}
          >
            <CustomButton
              type="button"
              className="button-check-answer"
              onClick={() => handleClickNextQuestion(index)}
              isComplete={isComplete}
              backgroundColor={buttonStyle.background}
              color={buttonStyle.color}
              disabled={playMode === PLAY_MODE.PRACTICE_V2}
            >
            {index + 1}
          </CustomButton>
          </div>
        );
      })}
    </div>
  );
}

export default forwardRef(CheckAnswer);
