import { getIconsListByLanguage } from ".";
import { ANSWER_COLOR, TYPE_CHECK } from "../modules/DoingExercise/const";

const formatActivityDataMTC_BG = (activity) => {
  const {
    background_list,
    game_config: gameConfig,
    icon_list: iconList,
  } = activity;
  const iconsList = getIconsListByLanguage(iconList);

  const backgroundValue = background_list.backgroundList[0].value[0];
  const touchAreas = backgroundValue.touch.map((area) => {
    return {
      name: area.name,
      touchVectors: JSON.parse(area.touch_vector),
    };
  });

  let listAudioAnswer = [];
  if (gameConfig.answer?.couple_of_icon) {
    listAudioAnswer = gameConfig.answer?.couple_of_icon.map((answer) => {
      const focusedIcon = iconsList?.find(
        (icon) => icon.icon_id === answer.icon_id_answer
      ) || {};
      const focusedTouchArea = touchAreas.find(
        (area) => area.name === `object-${answer.icon_object_id}`
      ) || {}
      const { touchVectors } = focusedTouchArea;
  
      return {
        url: focusedIcon.props?.[0]?.audio[0]?.path,
        left: touchVectors[0].x + (touchVectors[1].x - touchVectors[0].x) / 2,
        top: touchVectors[0].y
      }
    });
  }

  return [
    {
      backgroundImage: {
        src: backgroundValue.path,
        width: parseInt(backgroundValue.image_width),
        height: parseInt(backgroundValue.image_height),
      },
      touchAreas,
      typeGame: gameConfig.type_game,
      checkType: gameConfig.check_type,
      answerCorrect: gameConfig.answer_correct,
      listAudioAnswer,
      fontSizeIcon: gameConfig.font_size_icon || "30px",
      hasAudio: gameConfig.data,  // NoAudio: 1, HasAudio: 2
    },
  ];
};

const checkResultAnswer = (answersCorrect = [], selectedPositionsAnswer = []) => {
  if (selectedPositionsAnswer.length !== answersCorrect.length) return false;
  let result = true;
  answersCorrect.forEach((answer) => {
    if (!selectedPositionsAnswer.includes(answer)) {
      result = false;
    }
  });
  return result;
};

const getAnswerColor = ({
  correctAnswers,
  selectedPositionsAnswer,
  positionIndex,
  checkType,
  isCheckedAnswer = false,
  showCorrectAnswer = false,
  hideResultAnswer = false,
}) => {
  if (showCorrectAnswer) {
    if (correctAnswers.includes(positionIndex)) return ANSWER_COLOR.CORRECT;
    return ANSWER_COLOR.WRONG;
  }

  // Before show result answer
  if (hideResultAnswer || !isCheckedAnswer) {
    if (checkType === TYPE_CHECK.Tick) return ANSWER_COLOR.DEFAULT;
    if (checkType === TYPE_CHECK.Border) {
      if (selectedPositionsAnswer.includes(positionIndex)) {
        return ANSWER_COLOR.DEFAULT;
      }
      return ANSWER_COLOR.NONE;
    }
  }

  // After show result answer
  if (selectedPositionsAnswer.includes(positionIndex)) {
    if (correctAnswers.includes(positionIndex)) return ANSWER_COLOR.CORRECT;
    return ANSWER_COLOR.WRONG;
  }
  return ANSWER_COLOR.NONE;
};

// Function from old logic code calculate width, height of background image
const calculateImageDimensionToView = (realWidth, realHeight) => {

  if (realHeight > 600) {
    const heightWindow = window.innerHeight - 150 > 0 ? window.innerHeight - 150 : 600;
    const widthImage = Math.round((realWidth * heightWindow) / realHeight);
    if (widthImage > 1100) {
      return { width: 1000, height: (realHeight * 1000) / realWidth };
    }
    return { width: widthImage, height: heightWindow };
  }

  if (realWidth > 1100) {
    return { width: 1000, height: (realHeight * 1000) / realWidth };
  }

  return { width: realWidth, height: realHeight };
};

export {
  formatActivityDataMTC_BG,
  checkResultAnswer,
  getAnswerColor,
  calculateImageDimensionToView,
};
