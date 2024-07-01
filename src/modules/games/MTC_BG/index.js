import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { fabric } from "fabric";
import { useImageSize } from "react-image-size";
import { checkResultAnswer, getAnswerColor, calculateImageDimensionToView } from "src/helpers/MTC_BG";
import { ANSWER_COLOR, AUDIO_CORRECT, AUDIO_ERROR, TYPE_CHECK, TYPE_GAME_MTC_BG, URL_IMAGE_QUESTION } from "src/modules/DoingExercise/const";
import Image from "src/components/Image";
import AudioComponent, { AudioType } from "src/components/Audio";

const MTC_BG = (
  {
    gameData,
    hideResultAnswer = false,
    selectedAnswersProp = [],
    showCorrectAnswer = false,
    onPlaying = () => {},
    onComplete = () => {},
  },
  ref
) => {
  const canvasId = `match-background_${Math.random()}`;

  const imageRef = useRef(null);
  const [imageDimension, setImageDimension] = useState({ width: 0, height: 0 });
  const [selectedPositionsAnswer, setSelectedPositionsAnswer] = useState([]);
  const [isCheckedAnswer, setIsCheckedAnswer] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const {
    answerCorrect,
    backgroundImage,
    checkType,
    listAudioAnswer,
    touchAreas,
    typeGame,
  } = gameData;
  const correctAnswers = answerCorrect.split(",");

  useEffect(() => {
    if (selectedAnswersProp.length > 0) {
      setSelectedPositionsAnswer(selectedAnswersProp);
      setIsCheckedAnswer(true);
    }
  }, [selectedAnswersProp]);

  useImperativeHandle(ref, () => ({
    handleCheck: handleCheckAnswer,
    handleReset: handleResetAnswer,
    handleOnlyView,
  }));

  const handleCheckAnswer = () => {
    setIsCheckedAnswer(true);

    const isCorrect = checkResultAnswer(
      correctAnswers,
      selectedPositionsAnswer
    );

    const audioSrc = isCorrect ? AUDIO_CORRECT : AUDIO_ERROR;
    const audioElement = new Audio(audioSrc);
    audioElement.play();

    onComplete({ selectedAnswers: selectedPositionsAnswer, isCorrect });
  };

  const handleResetAnswer = () => {
    setSelectedPositionsAnswer([]);
    setIsCheckedAnswer(false);
    setIsViewOnly(false);
  };

  const handleOnlyView = () => {
    setIsViewOnly(true);
  };

  const [dimensions] = useImageSize(`${URL_IMAGE_QUESTION}${backgroundImage.src}`);
  
  useEffect(() => {
    if (dimensions && dimensions.width && dimensions.height) {
      const { width, height } = calculateImageDimensionToView(dimensions.width, dimensions.height);
      setImageDimension({ width, height });
    }
  }, [dimensions]);

  useEffect(() => {
    drawCanvasTouchArea();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPositionsAnswer, imageDimension.width, imageDimension.height, isCheckedAnswer]);

  const drawCanvasTouchArea = () => {
    const newCanvas = new fabric.Canvas(canvasId, {
      width: imageDimension.width,
      height: imageDimension.height,
    });

    touchAreas.forEach((area) => {
      const { touchVectors } = area;
      const touchVectorsPolygon = touchVectors.map((vector) => {
        return {
          ...vector,
          x: vector.x * scaleImage,
          y: vector.y * scaleImage,
        };
      });

      const positionIndex = area.name.replace("object-", "");
      const polygon = new fabric.Polygon(touchVectorsPolygon, {
        strokeWidth: 1.5,
        hasBorders: true,
        selectionRadius: 20,
        stroke:
          checkType !== TYPE_CHECK.Tick
            ? getAnswerColor({
                correctAnswers,
                selectedPositionsAnswer,
                positionIndex,
                checkType,
                isCheckedAnswer,
                showCorrectAnswer,
                hideResultAnswer,
              })
            : ANSWER_COLOR.NONE,
        fill: ANSWER_COLOR.NONE,
        selectable: false,
        hoverCursor: "pointer",
        id: positionIndex,
      });
      newCanvas.add(polygon);
    });
    newCanvas.renderAll();

    newCanvas.on("mouse:over", (e) => onMouseOver(e, newCanvas));

    newCanvas.on("mouse:out", (e) => onMouseOut(e, newCanvas));

    newCanvas.on("mouse:down", (e) => onMouseDown(e, newCanvas));
  };

  const onMouseOver = (e, canvas) => {
    if (!e.target) return;
    e.target.set("fill", "rgba(102, 217, 255, 0.2)");
    canvas.renderAll();
  };

  const onMouseOut = (e, canvas) => {

    if (!e.target) return;
    e.target.set("fill", "transparent");
    canvas.renderAll();
  };

  const onMouseDown = (e, canvas) => {

    if (!(e.target && e.button === 1)) return;
    if (isViewOnly) return;

    let shadowListPositionClick = [...selectedPositionsAnswer];
    if (isCheckedAnswer) {
      handleResetAnswer();
      shadowListPositionClick = [];
    }

    const positionOrder = e.target.get("id");
    if (typeGame === TYPE_GAME_MTC_BG.ManyAnswers) {
      const positionOrderFocusIndex = shadowListPositionClick.findIndex(position => position === positionOrder);
      if (positionOrderFocusIndex > -1) {
        shadowListPositionClick.splice(positionOrderFocusIndex, 1)
      } else {
        shadowListPositionClick.push(positionOrder);
      }
      setSelectedPositionsAnswer(shadowListPositionClick);
    } else {
      setSelectedPositionsAnswer([positionOrder]);
    }
    canvas.renderAll();
    
    onPlaying(false);
  };

  const getListCheckTypeTick = () => {
    const listCheckType = [];
    if (checkType !== TYPE_CHECK.Tick) return listCheckType;
    touchAreas.forEach((area) => {
      const { touchVectors } = area;
      const positionIndex = area.name.replace("object-", "");
      if (showCorrectAnswer || selectedPositionsAnswer.includes(positionIndex)) {
        listCheckType.push({
          left: touchVectors[3].x - 15 + (touchVectors[2].x - touchVectors[3].x) / 2, // magic number 15 ???
          top: touchVectors[2].y - 30, // magic number 30 ???
          color: getAnswerColor({
            correctAnswers,
            selectedPositionsAnswer,
            positionIndex,
            checkType,
            isCheckedAnswer,
            showCorrectAnswer,
            hideResultAnswer,
          }),
          id: positionIndex,
        });
      }
    });
    return listCheckType;
  };

  const scaleImage = imageDimension.width / backgroundImage.width;

  return (
    <div className="d-flex overflow-auto">
      <div className="mtcbg-wrapper">
      <Image
          src={backgroundImage.src}
          width={imageDimension.width}
          heigh={imageDimension.height}
          style={{ minWidth: imageDimension.width }}
          alt="MTC-background-image"
          // onLoad={handleLoadImageBackground}
        />
          <canvas id={canvasId}/>
        {getListCheckTypeTick().map((check, index) => {
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                zIndex: 1,
                top: check.top * scaleImage,
                left: check.left * scaleImage,
                color: check.color,
              }}
            >
              <i
                className="fa fa-check"
                aria-hidden="true"
              />
            </div>
          );
        })}
        {listAudioAnswer.map((audio, index) => {
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                zIndex: 11,
                left: audio.left * scaleImage - 30, // magic number 30 ???
                top: audio.top * scaleImage - 20, // magic number 20 ???
              }}
            >
              <AudioComponent variant={AudioType.Primary} src={audio.url} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default forwardRef(MTC_BG);
