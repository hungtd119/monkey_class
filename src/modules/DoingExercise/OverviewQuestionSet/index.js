import CheckAnswer from "./CheckAnswer";
import ProcessBar from "./ProcessBar";
import { forwardRef } from "react";
import classNames from "classnames";
import { INNER_WIDTH, PLAY_MODE, TOTAL_QUESTIONS_CORRECT } from "../const";
import ProgressBar from "src/components/Progressbar";

function OverviewQuestionSet(
  {
    questions,
    onChangeQuestion,
    activeQuestionIndex,
    hasAnsweredChecking,
    isComplete,
    percentDoing,
    percentage,
    playMode,
    countSelectedAnswer
  },
  ref
) {
  return (
    <div
      className={classNames("", {
        "scrollbar-question__number": window.innerWidth >= INNER_WIDTH.TABLET,
      })}
    >
      <div className="d-flex d-md-block justify-content-center mx-5 mx-md-1 mt-lg-4">
        {playMode === PLAY_MODE.PRACTICE_V2 ? (
          <ProgressBar targetValue={TOTAL_QUESTIONS_CORRECT} progressValue={countSelectedAnswer} />
        ) : (
          <ProcessBar
            strokeWidth={10}
            percentage={percentage}
            percentDoing={percentDoing}
            hasAnsweredChecking={hasAnsweredChecking}
            isPlayModeExamV2={playMode === PLAY_MODE.PRACTICE_V2}
          />
        )}
      </div>
      <CheckAnswer
        questions={questions}
        onChangeQuestion={onChangeQuestion}
        activeQuestionIndex={activeQuestionIndex}
        hasAnsweredChecking={hasAnsweredChecking}
        ref={ref}
        isComplete={isComplete}
        playMode={playMode}
      />
    </div>
  );
}

export default forwardRef(OverviewQuestionSet);
