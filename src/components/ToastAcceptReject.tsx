import React, { useEffect } from "react";
import Image from "next/image";
import { ToastContainer } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import { globalPath } from "src/global";

interface ToastAcceptRejectProps {
  show: boolean;
  onClose: () => void;
  handleRevoke: (data: any, index: number) => void;
  type: string | undefined;
  index: number;
  name: string;
  dataUser: any;
}

function ToastAcceptReject({
  show,
  onClose,
  handleRevoke,
  type,
  index,
  dataUser
}: ToastAcceptRejectProps) {

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const handleRevokeClick = (user: any, index: number) => {
    handleRevoke(user, index);
    onClose();
  };

  return (
    <ToastContainer
      className="p-0 m-0 w-100"
      style={{
        position: "fixed",
        bottom: `${index * 80}px`,
        left: 0,
        height: "72px",
        zIndex: 1060,
      }}
    >
      <Toast
        className="w-100"
        onClose={onClose}
        delay={3000}
        show={show}
        autohide
      >
        <Toast.Body className="py-6">
          <div className="d-flex justify-content-between ">
            <div className="d-flex align-items-center gap-2">
              {type == "accept" ? (
                <Image
                  src={`${globalPath.pathSvg}/check-circle.svg`}
                  width={24}
                  height={24}
                  alt="accept"
                />
              ) : (
                <Image
                  src={`${globalPath.pathSvg}/x-circle.svg`}
                  width={24}
                  height={24}
                  alt="accept"
                />
              )}

              <p className="fw-bold">
              {type == "accept" ? "Đã chấp nhận" : "Đã từ chối" } yêu cầu phê duyệt {dataUser?.name}
              </p> 
            </div>
            <p
              className="text-decoration-underline pointer"
              style={{ color: "#3393FF" }}
              onClick={()=> handleRevokeClick(dataUser, index)}
            >
              Thu hồi
            </p>
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastAcceptReject;
