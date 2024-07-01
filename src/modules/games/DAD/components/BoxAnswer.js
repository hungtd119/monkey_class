import React from "react";
import { useDrag } from "react-dnd";
import _ from "lodash";
import styles from "./styles.module.scss";
import { TYPE_DATA, URL_AUDIO } from "src/modules/DoingExercise/const";
import Image from "src/components/Image";
import UseSound from "src/components/UseSound";

const BoxAnswer = ({
  answerItem,
  typeAnswer,
  widthImage,
  styleWrapper = {},
  isViewOnly = false,
}) => {
  const { answerId, type, srcAudio, srcImage, text } = answerItem;

  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type,
      item: { answerId },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    []
  );

  const hasImage = _.includes(typeAnswer, TYPE_DATA.IMAGE);

  return (
    <div
      ref={dragRef}
      style={{
        ...styleWrapper,
        opacity,
      }}
      className={`${styles["box-answer__wrapper"]} ${
        isViewOnly ? styles["view-only"] : ""
      } ${hasImage ? styles["has-image"] : ""}`}
    >
      {srcAudio && <UseSound src={`${URL_AUDIO}${srcAudio}`} />}
      {_.includes(typeAnswer, TYPE_DATA.TEXT) && (
        <div>
          {text.contentText}
        </div>
      )}
      {hasImage && (
        <Image
          src={srcImage}
          width={widthImage ? widthImage : "120px"}
          height="auto"
        />
      )}
    </div>
  );
};

export default BoxAnswer;
