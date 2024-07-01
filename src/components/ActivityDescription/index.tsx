import React from "react";
import Image from "next/image";
import { globalPath } from "src/global";
import useDeviceDetect from "src/hooks/useDetectDevice";

interface PropsActivityDesc {
  pathThumb: string | null;
  activityTitle: string,
  activityDescription: string
}
const ActivityDescription = (props: PropsActivityDesc) => {
  const { pathThumb, activityTitle, activityDescription } = props;
  const { isMobile } = useDeviceDetect();

  return (
    <div className="description-activity p-7 mb-6">
      <div className={`d-flex gap-7 ${isMobile ? "flex-column" : ""}`}>
        <img
          src={(pathThumb && pathThumb !== "") ? `${process.env.NEXT_PUBLIC_CDN}upload/cms_platform/thumb/activity/hdr/${pathThumb}` : `/${globalPath.pathImg}/default.png`}
          width={248}
          height={156}
          alt="default act"
        />
        <div className="d-flex flex-column justify-content-around">
          <p className="fw-bold fs-2">{activityTitle}</p>
          <p className="text-story">
            {activityDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityDescription;
