import { nunito } from "@styles/font";
import React from "react";
import { Button, Modal } from "react-bootstrap";

const PopupDeleteClassroom = (props: any) => {
  const { show, handleClose, data, onSubmit } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      className={nunito.className}
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title></Modal.Title>
        
      </Modal.Header>
      <Modal.Body>
            Bạn có chắc chắn muốn xóa <span className="fw-bold">{data?.name}</span> không? Nếu xóa lớp thì danh sách học sinh của lớp cũng sẽ bị xóa theo
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

export default PopupDeleteClassroom;
