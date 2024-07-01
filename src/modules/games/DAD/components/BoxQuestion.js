import React from "react";
import { useDrop } from "react-dnd";
import _ from "lodash";
import BoxAnswer from "./BoxAnswer";
import styles from "./styles.module.scss";
import { TYPE_DATA } from "src/modules/DoingExercise/const";
import Image from "src/components/Image";
import { getBorderColor } from "src/helpers/DAD";

const BoxQuestion = ({
  questionItem,
  typeQuestion,
  typeAnswer,
  widthImage,
  droppedAreas,
  isViewOnly = false,
  hideResultAnswer = false,
  onDropItem,
}) => {
  const { questionId, accept, srcImage, text } = questionItem;

  const handleDropItem = (item) => {
    onDropItem({ answerId: item.answerId, questionId });
  };

  const [, dropRef] = useDrop({
    accept,
    drop: handleDropItem,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const droppedAnswers = droppedAreas.filter(
    (area) => area.questionId === questionId
  );

  return (
    <div ref={dropRef} className={styles["box-question__wrapper"]}>
      {_.includes(typeQuestion, TYPE_DATA.TEXT) && (
        <h3 className={styles["title-box"]}>
          {text.contentText && (
        <div dangerouslySetInnerHTML={{ __html: text.contentText }} />
          )}
        </h3>
      )}
      {_.includes(typeQuestion, TYPE_DATA.IMAGE) && (
        <>
          <Image
            src={srcImage}
            alt="DAD-text__box-question"
            height="100px"
            className={styles["image-box"]}
          />
          <hr className={styles["line"]} />
        </>
      )}
      <div
        className={`${styles["answers-in-question"]} ${
          _.includes(typeAnswer, TYPE_DATA.IMAGE)
            ? "justify-content-center"
            : ""
        }`}
      >
        {droppedAnswers.map((answerItem) => (
          <BoxAnswer
            key={answerItem.answerId}
            answerItem={answerItem}
            typeAnswer={typeAnswer}
            widthImage={widthImage}
            styleWrapper={{
              margin: "5px",
              borderColor: getBorderColor(hideResultAnswer ? null : answerItem.isCorrect),
            }}
            isViewOnly={isViewOnly}
          />
        ))}
      </div>
    </div>
  );
};

export default BoxQuestion;
