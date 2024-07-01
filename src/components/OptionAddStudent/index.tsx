import React from "react";
import Image from "next/image";
import { globalPath } from "../../global";
import styles from "./OptionAddStudent.module.scss";
import { Col } from "react-bootstrap";

const OptionAddStudent = (props: any) => {
  const { title, des, onClick } = props;
  return (
    <Col className={`${styles.add_option}`} onClick={onClick}>
      <Image
        src={`${globalPath.pathImg}/add-student-option.png`}
        alt={"option"}
        width={40}
        height={40}
        className="mb-3"
      />
      <div
        className="text-center"
        style={{ fontSize: "18px", fontWeight: 800 }}
      >
        {title}
      </div>
      <div className="text-center" style={{ color: "#777777" }}>
        {des}
      </div>
    </Col>
  );
};

export default OptionAddStudent;
