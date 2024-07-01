import { nunito } from "@styles/font";
import React from "react";
import { Button, Modal, ProgressBar } from "react-bootstrap";
import styles from "./PopupUploading.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleXmark,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";

const PopupUploading = (props: any) => {
  const { show, onClose, process, result } = props;
  const handleClickGoHome = () => {
    window.location.reload();
  };
  return (
    <Modal
      show={show}
      centered
      keyboard={false}
      onHide={onClose}
      backdrop="static"
      size="lg"
      className={`${nunito.className} modal-rounded-0`}
    >
      {result === "success" ? (
        <div>
          <div className="d-flex justify-content-center mb-6 mt-8">
            <FontAwesomeIcon icon={faCheckCircle} color="#92C73D" size="7x" />
          </div>
          <div className="h5 text-center" style={{ color: "#AFAFAF" }}>
            Tạo danh sách học sinh thành công
          </div>
          <div className="text-center my-8">
            <Button
              variant="danger-v2 text-white px-8 py-4"
              style={{ borderRadius: "8px", fontSize: "16px", fontWeight: 700 }}
              onClick={handleClickGoHome}
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ minHeight: "400px" }}>
          <Modal.Header
            closeButton
            className={`border-0 fw-bold ${styles.p_32_32_0_32} pb-4`}
            style={{ backgroundColor: "#D9F7F9" }}
          >
            <div
              className="h3 fw-bold text-center w-100"
              style={{ color: "#383838", fontWeight: "800" }}
            >
              Tải lên danh sách {props.title}
            </div>
          </Modal.Header>
          <Modal.Body className={`${styles.p_0_32} py-6 px-7`}>
            <div className="d-flex">
              <div className="me-2">
                {result === "fail" ? (
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    size="xl"
                    color="#FF4B4B"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="xl"
                    color="#92C73D"
                  />
                )}
              </div>
              <div className="w-100">
                <div className="h5" style={{ color: "#AFAFAF" }}>
                  Tải lên danh sách
                </div>
                <div>
                  {result === "fail" ? (
                    <div>
                      <ProgressBar
                        now={process}
                        max={100}
                        variant="danger-v2"
                      />
                      <div className="h6 text-danger-v2 mt-2">
                        Đã xảy ra lỗi, vui lòng thử lại
                      </div>
                    </div>
                  ) : (
                    <ProgressBar now={process} max={100} variant="success-v2" />
                  )}
                </div>
              </div>
            </div>
            {result === "fail" && (
              <div className="mt-8 d-flex justify-content-center">
                <Button
                  className="text-white d-flex justify-content-center align-items-center p-4"
                  variant="success-v2"
                  style={{
                    fontSize: "20px",
                    fontWeight: "700px",
                    borderRadius: "8px",
                  }}
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faRotate} size="xl" className="me-2" />
                  <div className="h4 m-0">Thử lại</div>
                </Button>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0 d-flex gap-4 p-2"></Modal.Footer>
        </div>
      )}
    </Modal>
  );
};

export default PopupUploading;
