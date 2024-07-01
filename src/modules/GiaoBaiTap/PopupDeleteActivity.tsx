import React from "react";
import { Button, Modal } from "react-bootstrap";

const PopupDeleteActivity = (props: any) => {
  const { show, handleClose, dataActivityDelete, onSubmit } = props;

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
            Bạn có muốn xóa hoạt động <span className="fw-bold fs-2">{dataActivityDelete?.name}</span> không ?
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

export default PopupDeleteActivity;
