import _ from "lodash";
import { PLAY_MODE, TYPE_GAME } from "./const";

const PUBLIC_QUESTION = 1;

export const LEVEL_EXERCISE = {
  level_1: 1,
  level_2: 2,
  level_3: 3,
  level_4: 4,
};

export function onFormatDataGameConfig(data) {
  let listQuestion = [];
  data?.forEach((question, index) => {
    try {
      if (
        [
          TYPE_GAME.DAD_Image,
          TYPE_GAME.MTC_BG,
        ].includes(question?.data?.game_id)
      ) {
        listQuestion.push({
          ...question.data,
          id: question.id,
          activity_id: question.activity_id,
          game_id: question?.data?.game_id,
          score: question.score,
          is_locked: question.is_locked,
          activity_name: question.activity_name,
        });
      } else {
        listQuestion.push(question);
        throw new Error("ErrorGameId");
      }
    } catch (e) {

    }
  });
  return listQuestion;
}

export const getQuestionSetTitle = ({
  playMode,
  status,
  title,
  public_title,
}) => {
  let questionSetTitle = "";
  if (playMode === PLAY_MODE.PRACTICE) {
    questionSetTitle = status === PUBLIC_QUESTION ? title : `${DRAFT} ${title}`;
  }
  if (playMode === PLAY_MODE.EXAM) {
    questionSetTitle = public_title ?? `${DRAFT} ${title}`;
  }
  return questionSetTitle;
};

export const getQuestionsShuffle = (questions, idParam) => {
  let questionsShuffle = [];
  const historyGame = JSON.parse(localStorage.getItem("history"));
  if (historyGame && historyGame.id_questions_set === idParam) {
    questionsShuffle = historyGame.data;
  } else {
    questionsShuffle = _.shuffle(questions);
  }
  return questionsShuffle;
};


export const getLevelExercise = (matrixBookContent) => {
  let numberOfQuestionsLevel = {
    level_1: 1
  };

  if (!_.isEmpty(matrixBookContent)) {
    numberOfQuestionsLevel = matrixBookContent;
  }

  for (let _level in numberOfQuestionsLevel) {
    if (numberOfQuestionsLevel[_level] > 0) {
      return LEVEL_EXERCISE[_level];
    }
  }

  return LEVEL_EXERCISE.level_1;
};

export const skipActivityExercise = (questions) => {
  const activitys = questions.map((question) => question.activity_id);

  return activitys.toString();
};

