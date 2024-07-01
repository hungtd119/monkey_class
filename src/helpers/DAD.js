import _ from "lodash";
import {
  getContentAudioVideoImageTextFromIconActData,
  getIconsListByLanguage,
} from ".";
import { COLOR, TYPE_DATA, TYPE_GAME } from "../modules/DoingExercise/const";

const formatActivityDataDAD = (activity) => {
  const {
    game_id: gameId,
    game_config: gameConfig,
    icon_list: iconList,
  } = activity;
  const iconsList = getIconsListByLanguage(iconList);

  const {
    type_question: typeQuestion,
    type_text: typeText,
    type_answer: typeAnswer,
    type_text_answer: typeTextAnswer,
    font_size_title: fontSizeTitle,
    font_size_question: fontSizeQuestion,
    font_size_answer: fontSizeAnswer,
  } = gameConfig;

  let gameConfigData = [];
  if (gameConfig.data) {
    gameConfigData = gameConfig.data;
  } else {
    gameConfigData = [
      {
        title_question: gameConfig.title_question,
        answer: gameConfig.answer,
        order_answer: gameConfig.order_answer,
        question: gameConfig.question,
        width_image: gameConfig.width_image, // Case DAD_IMAGE
        answer_number_in_a_row: gameConfig.answer_number_in_a_row || gameConfig.number_in_row,  // Case DAD_IMAGE
      },
    ];
  }

  const questionAnswerSetList = gameConfigData.map((dataGameConfigItem) => {
    const titleQuestionId = _.get(dataGameConfigItem, "title_question.icon_id");
    const titleQuestionContentIcon = getContentAudioVideoImageTextFromIconActData(
      iconsList,
      titleQuestionId
    );
    const titleQuestion = {
      srcAudio: titleQuestionContentIcon.srcAudio,
      srcImage: titleQuestionContentIcon.srcImage,
      text: {
        contentText: titleQuestionContentIcon.contentText,
        typeText,
        fontSize: fontSizeTitle,
      },
    };

    const listQuestionsAccept = dataGameConfigItem.question.map(questionItem => questionItem.icon_id);
    const questionsList = dataGameConfigItem.question.map(questionItem => {
      const questionId = questionItem.icon_id;
      const questionContentIcon = getContentAudioVideoImageTextFromIconActData(iconsList, questionItem.icon_id);
      return {
        questionId,
        accept: listQuestionsAccept,
        srcAudio: questionContentIcon.srcAudio,
        srcImage: questionContentIcon.srcImage,
        text: {
          contentText: questionContentIcon.contentText,
          typeText: typeText,
          fontSize: fontSizeQuestion,
        },
      }
    });

    const answersList = dataGameConfigItem.answer.couple_of_icon.map(icon => {
      const answerId = icon.icon_id_answer;
      const type = icon.icon_id_question;
      const answerContentIcon = getContentAudioVideoImageTextFromIconActData(iconsList, answerId);
      return {
        answerId,
        type,
        srcAudio: answerContentIcon.srcAudio,
        srcImage: answerContentIcon.srcImage,
        text: {
          contentText: answerContentIcon.contentText,
          typeText: typeTextAnswer,
          fontSize: fontSizeAnswer,
        },
      }
    })

    return {
      titleQuestion,
      question: {
        typeQuestion,
        questions: questionsList,
      },
      answer: {
        typeAnswer: gameId === TYPE_GAME.DAD_Image && typeAnswer ? [...typeAnswer, TYPE_DATA.IMAGE] : typeAnswer,
        widthImage: dataGameConfigItem.width_image,
        numberAnswersInRow: gameId === TYPE_GAME.DAD_Image ? Number(dataGameConfigItem.answer_number_in_a_row) : null,
        answers: answersList,
      },
    };
  });

  return questionAnswerSetList;
};

const getBorderColor = (isCorrect) => {
  switch (isCorrect) {
    case true:
      return COLOR.Success;
    case false:
      return COLOR.Error;
    default:
      return "rgb(204, 204, 204)";
  }
};

export { formatActivityDataDAD, getBorderColor };
