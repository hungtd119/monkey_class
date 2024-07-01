import React from "react";
import { Button, Modal } from "react-bootstrap";

const PopupUpdateStatus = (props: any) => {
    const { show, handleClose, learningLesson, onSubmit } = props;

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="border-0">
                <Modal.Title></Modal.Title>

            </Modal.Header>
            <Modal.Body>
                Bạn có muốn chuyển trạng thái Lesson <span className="fw-bold fs-2">{learningLesson?.id}</span> không ?
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="danger" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="success" type="submit" onClick={()=> onSubmit()}>
                    Đồng ý
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PopupUpdateStatus;
