import Image from "next/image";
import React from "react";
import { Button } from "react-bootstrap";
import { globalPath } from "src/global";

const HookMenuDownloadApp = () => {
  return (
    <div className="hook-menu">
      {/* <div className="d-flex justify-content-end">
        <Image
          src={`${globalPath.pathSvg}/x-close.svg`}
          className="rounded"
          alt="Icon X"
          width={16}
          height={16}
        />
      </div> */}
      <p className="fw-bold" style={{ color: "#4B4B4B" }}>
        Tải Ứng Dụng Miễn Phí Monkey Class
      </p>
      <p style={{ color: "#777777" }}>
        Tải ứng dụng để giao tiếp với phụ huynh một cách dễ dàng và tiện lợi
        nhất
      </p>
      <a
        href="https://apps.apple.com/cd/app/monkey-class/id6478106053"
        target="_blank"
      >
        <Button
          className="bg-secondary w-100 d-flex align-items-center justify-content-center gap-1 mb-2"
          style={{ height: 40, borderRadius: 12 }}
        >
          <p className="fw-bold" style={{ color: "#4B4B4B" }}>
            Tải trên iOS
          </p>
          <Image
            src={`${globalPath.pathSvg}/ios-icon.svg`}
            className="rounded me-2"
            alt="Ios"
            width={18}
            height={18}
          />
        </Button>
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.earlystart.monkeyclass"
        target="_blank"
      >
        <Button
          className="bg-secondary w-100 d-flex align-items-center justify-content-center gap-1"
          style={{ height: 40, borderRadius: 12 }}
        >
          <p className="fw-bold" style={{ color: "#4B4B4B" }}>
            Tải trên Android
          </p>
          <Image
            src={`${globalPath.pathSvg}/android-icon.svg`}
            className="rounded me-2"
            alt="Android"
            width={18}
            height={18}
          />
        </Button>
      </a>
    </div>
  );
};

export default HookMenuDownloadApp;
