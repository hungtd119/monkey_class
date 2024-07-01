import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { useRouter } from "next/router";

import Footer from "./Footer";
import DoingExerciseWrapper from "./DoingExerciseWrapper";
import {
  onFormatDataGameConfig,
} from "./selection";
import OverviewQuestionSet from "./OverviewQuestionSet";
import {
  PLAY_MODE,
  TOTAL_QUESTIONS_CORRECT,
} from "./const";
import { getListQuestion } from "src/services/common";


export default function ExerciseContainer(props) {
  const router = useRouter();

  const gameRef = useRef();
  const QuestionsRef = useRef();
  const { id } = router.query;
  const [questionListResponse, setQuestionListResponse] = useState({});
  const [originQuestions, setOriginQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isButtonNext, setIsButtonNext] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isDone, setIsDone] = useState(false);

  let percentDoing;
  let percentage = 0;
  let countSelectedAnswer = 0;
  const playMode = PLAY_MODE.PRACTICE

  if (playMode === PLAY_MODE.EXAM || playMode === PLAY_MODE.PRACTICE) {
    const selectedQuestions = questions.filter(
      (question) => !_.isNil(question.isCorrect)
    );
    countSelectedAnswer = selectedQuestions.length;
    percentDoing = `${countSelectedAnswer}/${questions?.length}`;
    percentage = (countSelectedAnswer / questions?.length) * 100;
  }

  if (playMode === PLAY_MODE.PRACTICE_V2) {
    isReadOnly = activeQuestionIndex + 1 !== questions.length;

    if (!_.isEmpty(questions)) {
      const selectedQuestions = questions.filter((item) => item?.isCorrect);
      countSelectedAnswer = selectedQuestions.length;
      percentage = (countSelectedAnswer / TOTAL_QUESTIONS_CORRECT) * 100;
    }
    percentDoing = `${_.round(percentage, 2)}%`;
    resultQuestion = `${TOTAL_QUESTIONS_CORRECT}/${questions.length}`;
  }


  useEffect(() => {
    const data = { question_set_id: props.id };
    onGetData(data, PLAY_MODE.PRACTICE);
  }, [id]);

  useEffect(() => {
    const arrQuestionDone = questions.filter((question) => question?.isCorrect);
    const countDone = arrQuestionDone.length;
    const total = questions.length;
    setIsDone(countDone === total);
  }, [questions]);

  const handleGetDataPracticeMode = ({ question_set_id }) => {
    setLoading(true);
    getListQuestion({ question_set_id })
      .then((res) => res.data)
      .then((res) => {
        setQuestionListResponse(res);
        const originData = res?.list_question || [];
        const formattedQuestions = onFormatDataGameConfig(originData);
        setOriginQuestions(formattedQuestions);
        setQuestions(formattedQuestions);
      })
      .finally(() => setLoading(false));
  };

  const onGetData = (data, playMode) => {
    if (playMode === PLAY_MODE.PRACTICE) {
      handleGetDataPracticeMode(data);
    }
  };


  const onChangeQuestion = (index) => {
    gameRef.current &&
      gameRef.current.handleReset &&
      gameRef.current.handleReset();

    activeQuestionIndex !== index &&
      gameRef.current?.onNextQuestion &&
      gameRef.current?.onNextQuestion();

    setActiveQuestionIndex(index);
    setIsButtonNext(questions[index]?.isCorrect);

  };

  const onNextQuestion = () => {
    if ( playMode === PLAY_MODE.PRACTICE) {
      let index = activeQuestionIndex + 1;
      if (index > questions.length - 1) { 
          props.handleClosePopupPlayGame()
      } else {
        onChangeQuestion(index);
      }

      gameRef.current &&
        gameRef.current.handleReset &&
        gameRef.current.handleReset();
    }
  };

  const handleCheckAnswer = () => {
    setActiveQuestionIndex(activeQuestionIndex);
    
    if (!gameRef.current) return;
    gameRef.current.handleCheck();
  };

  const onComplete = (data) => {

    const newQuestions = questions.map((question, _index) =>
      _index === activeQuestionIndex ? { ...question, ...data } : question
    );
    const arrFinishedQuestion = newQuestions.filter(
      (question) => question?.isCorrect
    );

    postHistoryQuestion(arrFinishedQuestion.length > 1 ? 2 : 1, newQuestions);
    setQuestions(newQuestions);
    setIsButtonNext(true);
  };

  const onPlaying = () => {
    setIsButtonNext(false);
  };

  const postHistoryQuestion = (type, newQuestions) => {
    let countCorrect = 0;
    let totalScore = 0;
    const historyQuestions = newQuestions || questions;
    const data = historyQuestions.map((question) => {
      const score = isNaN(question.score) ? 0 : Number(question.score);
      let status_answer = 1;
      if (question.isCorrect === true) {
        countCorrect = countCorrect + 1;
        totalScore = +(totalScore + score).toFixed(12);
        status_answer = 2;
      }

      if (question.isCorrect === false) {
        status_answer = 3;
      }
      const result = {
        activity_id: question?.activity_id,
        status_answer: status_answer,
      };
      return result;
    });
  };


  const onConfirmSubmit = () => {
    const arrQuestionDone = questions.filter(
      (question) => question.isCorrect !== undefined
    );
    const countDone = arrQuestionDone.length;
    const total = questions.length;
    setIsDone(countDone === total);
  };


  const activeQuestion = questions[activeQuestionIndex];
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>

      <div className="d-flex justify-content-around mt-5" style={{color: "#101010", height: "calc(100vh - 58px)"}}>
          <>
              <DoingExerciseWrapper
                data={activeQuestion}
                hasAnsweredChecking={true}
                onComplete={onComplete}
                onPlaying={onPlaying}
                ref={gameRef}
                isComplete={isComplete}
              />

            <OverviewQuestionSet
              questions={questions}
              activeQuestionIndex={activeQuestionIndex}
              onChangeQuestion={onChangeQuestion}
              hasAnsweredChecking={
                playMode === PLAY_MODE.PRACTICE
              }
              ref={QuestionsRef}
              isComplete={false}
              percentDoing={percentDoing}
              percentage={percentage}
              playMode={playMode}
              countSelectedAnswer={countSelectedAnswer}
            />
            <Footer
              isButtonNext={isButtonNext}
              onNextQuestion={onNextQuestion}
              handleCheckAnswer={handleCheckAnswer}
              onConfirmSubmit={onConfirmSubmit}
              isDone={isDone}
              isModeExam={playMode === PLAY_MODE.EXAM}
              isLastQuestion={activeQuestionIndex === questions?.length - 1}
              playMode={playMode}
            />
          </>
      </div>
    </>
  );
}

