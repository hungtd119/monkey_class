import React from "react";
import { Button, Modal } from "react-bootstrap";

const PopupDeleteTeacher = (props: any) => {
  const { show, handleClose, dataTeacher, onSubmit,isDeleting } = props;

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
            Bạn có muốn xóa giáo viên <span className="fw-bold fs-2">{dataTeacher?.name}</span> không ?
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="danger" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="success" type="submit" onClick={()=> onSubmit()} disabled={isDeleting}>
            {isDeleting ? "Đang xử lý..." : "Đồng ý"}
          </Button>
        </Modal.Footer>
    </Modal>
  );
};

export default PopupDeleteTeacher;
