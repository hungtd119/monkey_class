import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import HeaderQuestion from "./HeaderQuestion";
import GameContent from "./GameContent";
import { AUDIO_CORRECT, AUDIO_ERROR } from "src/modules/DoingExercise/const";

const DAD = (
  {
    gameData,
    hideResultAnswer = false,
    droppedAreasProp = [],
    showCorrectAnswer = false,
    isReadOnly = false,
    onPlaying = () => {},
    onComplete = () => {},
  },
  ref
) => {
  const { titleQuestion, question, answer } = gameData;
  const [droppedAreas, setDroppedAreas] = useState([]);
  const [isCheckedAnswer, setIsCheckedAnswer] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);

  /**---------- Show dropped areas answer result ----------**/
  useEffect(() => {
    if (droppedAreasProp.length > 0) {
      setDroppedAreas(droppedAreasProp);
    }
  }, [droppedAreasProp]);

  /**---------- Show all correct answers result ----------**/
  useEffect(() => {
    if (showCorrectAnswer) {
      const droppedCorrectAnswers = answer.answers.map((answerItem) => ({
        ...answerItem,
        questionId: answerItem.type,
        isCorrect: true,
      }));
      setDroppedAreas(droppedCorrectAnswers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCorrectAnswer]);

  useImperativeHandle(ref, () => ({
    handleCheck: handleCheckAnswer,
    handleReset: handleResetAnswer,
    handleOnlyView,
  }));

  const handleCheckAnswer = () => {
    setIsCheckedAnswer(true);

    let numberOfCorrectAnswers = 0;
    const shadowDroppedAreas = [...droppedAreas].map((area) => {
      const isCorrect = area.questionId === area.type;
      if (isCorrect) {
        numberOfCorrectAnswers++;
      }
      return {
        ...area,
        isCorrect,
      };
    });
    setDroppedAreas(shadowDroppedAreas);

    const isCorrect = numberOfCorrectAnswers === answer.answers.length;
    const audioSrc = isCorrect ? AUDIO_CORRECT : AUDIO_ERROR;
    const audioElement = new Audio(audioSrc);
    audioElement.play();
    
    onComplete({
      isCorrect,
      numberOfCorrectAnswers,
      droppedAreas: shadowDroppedAreas,
    });
  };

  const handleResetAnswer = () => {
    setIsCheckedAnswer(false);
    setIsViewOnly(false);
    setDroppedAreas([]);
  };

  const handleOnlyView = () => {
    setIsViewOnly(true);
  };

  const handleDropItem = ({ answerId, questionId }) => {
    let shadowDroppedAreas = [...droppedAreas];
    if (isCheckedAnswer) {
      shadowDroppedAreas = shadowDroppedAreas.map(area => ({  ...area, isCorrect: null }));
    }

    if (droppedAreas.some(area => area.answerId === answerId && area.questionId === questionId)) {
      return;
    }

    const droppedSameAnswerIndex = droppedAreas.findIndex(area => area.answerId === answerId);
    if (droppedSameAnswerIndex > -1) {
      shadowDroppedAreas[droppedSameAnswerIndex].questionId = questionId;
    } else {
      const droppedAnswerItem = answer.answers.find(
        (answerItem) => answerItem.answerId === answerId
      );
      shadowDroppedAreas.push({ ...droppedAnswerItem, questionId });
    }
    
    setDroppedAreas(shadowDroppedAreas);
    onPlaying(false);
  };

  return (
    <div className="DAD_wrapper">
      <HeaderQuestion titleQuestion={titleQuestion} />
      <DndProvider backend={HTML5Backend}>
        <GameContent
          question={question}
          answer={answer}
          droppedAreas={droppedAreas}
          isViewOnly={isReadOnly || isViewOnly}
          hideResultAnswer={hideResultAnswer}
          onDropItem={handleDropItem}
        />
      </DndProvider>
    </div>
  );
};

export default forwardRef(DAD);
