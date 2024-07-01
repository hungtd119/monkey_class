import React from "react";
import { Button } from "react-bootstrap";

interface ToastHookDowloadAppProps {
    onClose: () => void;
    downloadLink: string
}
const ToastHookDowloadApp = ({ onClose, downloadLink }: ToastHookDowloadAppProps) => {
  return (
    <div className="notification-hook d-flex align-items-center justify-content-around">
        <div></div>
        <div className=" d-flex justify-content-center align-items-center fw-bolder gap-2">
        <p>
            Trải nghiệm các tính năng lớp (điểm danh, tin nhắn,...) miễn phí trên
            ứng dụng điện thoại Monkey Class
        </p>
        <a href={downloadLink} target="_blank">
          <Button className="bg-secondary text-hook">
            Tải ứng dụng
          </Button>
        </a>
        </div>

        <i className="fa fa-times pointer fs-3" aria-hidden="true" onClick={onClose}/>
    </div>
  );
};

export default ToastHookDowloadApp;
