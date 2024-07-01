import {Modal} from "react-bootstrap";
import React from "react";
import { nunito } from "@styles/font";

const PopupChangeClassroom = (props: any) => {
  const { show,handleClose, data = [] } = props;
  return (
      <Modal
          show={show}
          onHide={handleClose}
          centered
          size="lg"
          backdrop="static"
          keyboard={false}
          className={nunito.className}
      >
          <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-bold text-story">
                  Tiến độ làm bài
              </Modal.Title>
          </Modal.Header>
      </Modal>
  );
};

export default PopupChangeClassroom;
