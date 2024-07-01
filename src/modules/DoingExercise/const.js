import _ from "lodash";

export const QUESTION_DISTANCE = 60;
export const TOTAL_QUESTIONS_CORRECT = 10;
export const DEFAULT_VALUE_LEVEL = 1;


export const PLAY_MODE = {
  PRACTICE: 1,
  EXAM: 2,
  PRACTICE_V2: 3,
};

export const getRandomQuestionWrong = (questions = []) => {
  const indexRandom = Math.random() * questions.length;
  
  return questions[Math.floor(indexRandom)];
};

export const TYPE_GAME = {
  DAD_Image: 477,
  MTC_BG: 464,
};

export const INNER_WIDTH = {
  DESKTOP: 1440,
  LAPTOP: 1366,
  IPAD: 1110,
  MOBILE: 500,
  TABLET: 768,
};

export const COLOR = {
  Success: "#92c83e",
  Error: "#ee202e",
  Default: "#939598",
  None: "transparent",
  White: "#fff",
  Black: "#000",
  Orange: "#ffeede"
};

export const ANSWER_COLOR = {
  NONE: "transparent",
  DEFAULT: "black",
  DEFAULT_BLUE: "#00c2f3",
  CORRECT: "green",
  WRONG: "red",
};

export const TYPE_CHECK = {
  Border: "border",
  Tick: "v",
};

export const URL_AUDIO = `https://hoc10.monkeyuni.net/upload/cms_platform/audio/`;
export const TYPE_DATA = {
  IMAGE: "image",
  AUDIO: "audio",
  VIDEO: "video",
  TEXT: "text",
  LATEX: "latex",
  INPUT: "input",
}
export const URL_IMAGE_QUESTION =
  "https://hoc10.monkeyuni.net/upload/cms_platform/images/hdr/";

  export const TYPE_GAME_MTC_BG = {
    ManyAnswers: "ckb",
    OneAnswer: "mtc",
  };

export const AUDIO_CORRECT = "https://hoc10.monkeyuni.net/upload/web/mp3/answer_ding.mp3";
export const AUDIO_ERROR = "https://hoc10.monkeyuni.net/upload/web/mp3/wrong_sound.wav"