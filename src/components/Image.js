import React from "react";

const Image = ({ isFullSrc, src, ...props }) => {
  if (!src) return null;

  return (
    <img
      src={isFullSrc ? src : `https://hoc10.monkeyuni.net/upload/cms_platform/images/hdr/${src}`}
      alt="game img component"
      {...props}
    />
  );
};

export default Image;
