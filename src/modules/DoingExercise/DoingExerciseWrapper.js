import { forwardRef, useEffect, useState } from "react";
import _ from "lodash";

import QuestionResult from "./QuestionResult";
import { TYPE_GAME } from "./const";
import { formatActivityDataMTC_BG } from "../../helpers/MTC_BG";
import { DAD, MTC_BG } from "../games";
import { formatActivityDataDAD } from "src/helpers/DAD";

function DoingExerciseWrapper(
  {
    data,
    hasAnsweredChecking = false,
    onComplete,
    onPlaying = () => {},
    showCorrectAnswer = false,
    isComplete,
    isReadOnly,
  },
  ref
) {

  // if (!data?.is_locked) {
  //   return (
  //     <div
  //       className={`pb-5 ${!isComplete ? "scrollbar-question" : ""}`}
  //     >
  //       <div className="h3 text-center mt-5">Đang cập nhật</div>
  //     </div>
  //   );
  // }

  const typeText = data?.game_config?.type_text_suggest;

  const gameId = data?.data?.game_id || data?.game_id;

  const renderGameOnQuestionSet = (gameId) => {
    switch (gameId) {
      case TYPE_GAME.MTC_BG:
        const formattedActivityMTC_BG = formatActivityDataMTC_BG(data);
        return (
          <MTC_BG
            ref={ref}
            gameData={formattedActivityMTC_BG[0]}
            hideResultAnswer={!hasAnsweredChecking}
            selectedAnswersProp={data.selectedAnswers}
            showCorrectAnswer={showCorrectAnswer}
            onPlaying={onPlaying}
            onComplete={onComplete}
            isReadOnly={isReadOnly}
          />
        );


      case TYPE_GAME.DAD_Image:
        const formattedActivityDAD = formatActivityDataDAD(data);
        return (
          <DAD
            ref={ref}
            gameData={formattedActivityDAD[0]}
            hideResultAnswer={!hasAnsweredChecking}
            droppedAreasProp={data.droppedAreas}
            showCorrectAnswer={showCorrectAnswer}
            onPlaying={onPlaying}
            onComplete={onComplete}
            isReadOnly={isReadOnly}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`pb-5 ${!isComplete ? "scrollbar-question" : ""}`}
    >

      {hasAnsweredChecking && !isComplete && (
        <QuestionResult result={data?.isCorrect} />
      )}

      {renderGameOnQuestionSet(gameId)}

    </div>
  );
}

export default forwardRef(DoingExerciseWrapper);

