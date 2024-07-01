import Image from "next/image";
import React, { ReactNode } from "react";
import { globalPath } from "src/global";

interface ToastInfoHeaderProps {
  message: ReactNode;
  iconLeft?: boolean;
  buttonRight?: ReactNode;
}

const ToastInfoHeader = ({
  message,
  iconLeft,
  buttonRight,
}: ToastInfoHeaderProps) => {
  return (
    <div className="notification-bar d-flex justify-content-center align-items-center fw-bolder gap-2 py-2">
      {iconLeft && (
        <Image
          src={`${globalPath.pathSvg}/info-circle.svg`}
          width={24}
          height={24}
          alt="info"
        />
      )}
      {message}
      {buttonRight}
    </div>
  );
};

export default ToastInfoHeader;
