import React from "react";
import { Button, Modal } from "react-bootstrap";

const ModalLogout = (props: any) => {
    const { show, onSubmit } = props;

    return (
        <Modal
            show={show}
            centered
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="border-0">
                <Modal.Title>Monkey Class thông báo</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại !
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="danger" type="submit" onClick={()=> onSubmit()}>
                    Đăng xuất
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalLogout;
