import React from "react";
import UseSound from "src/components/UseSound";
import { URL_AUDIO } from "src/modules/DoingExercise/const";

const HeaderQuestion = ({ titleQuestion }) => {

  return (
    <div className="header-question-dad">
      {titleQuestion.srcAudio && (
        <UseSound src={`${URL_AUDIO}${titleQuestion.srcAudio}`} />
      )}
      {titleQuestion.text.contentText && (
        <div className="title-question" dangerouslySetInnerHTML={{ __html: titleQuestion.text.contentText }} style={{fontSize: titleQuestion.text.fontSize ?? "20px"}}/>
      )}
    </div>
  );
};

export default HeaderQuestion;
