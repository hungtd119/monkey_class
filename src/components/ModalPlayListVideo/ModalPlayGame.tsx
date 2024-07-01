import React from 'react'
import { Modal } from 'react-bootstrap';
import ExerciseContainer from 'src/modules/DoingExercise/container';

interface ModalPlayGameProps {
    show: boolean;
    handleClose: () => void;
    id: number | null;
}
const ModalPlayGame = ({show, handleClose, id}: ModalPlayGameProps) => {

    return (
        <>
          <Modal
            show={show}
            onHide={handleClose}
            centered
            fullscreen
            backdrop="static"
          >
            <Modal.Header closeButton className="border-0"></Modal.Header>
            <Modal.Body className="fw-bold">
              <ExerciseContainer handleClosePopupPlayGame={handleClose} id={id}/>
            </Modal.Body>
          </Modal>
        </>
      );
}

export default ModalPlayGame