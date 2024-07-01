import React, { useState } from "react";
import Image from "next/image";
import { globalPath } from "src/global";
import { Col } from "react-bootstrap";

export type MaterialFile = {
  label: string;
  link: string;
  downloadable: boolean;
  isVideo: boolean;
  onClick: (event: any, isDowloadable?: boolean, isVideo?: boolean, links?: any) => void;
};

export type TMaterialItem = {
  id: number;
  thumbnail: string;
  title: string;
  links: MaterialFile[];
};

const MaterialItem = (props: { data: TMaterialItem }) => {
  const { thumbnail, title, links } = props.data || {};

  const handleViewFileDocs = (path: string) => {
    if(path) {
      window.open(`/xem-tai-lieu/${encodeURIComponent(path)}`, "_blank");
    }
  }

  return (
    <>
      <Col md={4} sm={6} className="material-wrapper__img position-relative">
        <div className="d-flex flex-column align-items-center">
          <img
            width="auto"
            height={148}
            src={thumbnail || `${globalPath.pathImg}/default.png`}
            alt="thumb_material"
          />
        </div>
        {title && <p className="mt-4 fw-bold">{title}</p>}
        <div>
          {(links || []).map((link: MaterialFile, index: number) => (
            <>
              {link.isVideo && (
                <div className="position-absolute play-video" key={`icon__${index}`}>
                  <Image
                    src={`${globalPath.pathSvg}/play-circle.svg`}
                    width={48}
                    height={48}
                    alt="icon play"
                    onClick={()=> link.onClick(link, false, link.isVideo, links)}
                  />
                </div>
              )}
              {link.downloadable ? (
                <div className="d-flex align-items-center gap-2" key={`text__${index}`}>
                  <div className="mt-2 material-wrapper__link downloadable">
                    <a
                      href={link.link}
                      target="_blank"
                      className="text-decoration-underline"
                    >
                      {link.label}
                    </a>
                  </div>
                  <Image
                    id="downloadLinkPdf"
                    className="mt-2"
                    src={`${global.pathSvg}/download.svg`}
                    width={24}
                    height={24}
                    onClick={() => {
                      link.onClick(link.link, link.downloadable);
                    }}
                    alt="download"
                  />
                </div>
              ) : (
                link.label !== null && (
                  <div className="mt-4 material-wrapper__link" key={index}>
                    <a
                      target="_blank"
                      className="text-decoration-underline pointer"
                      onClick={() => link.isVideo ? link.onClick(link, false, false) : handleViewFileDocs(link.link)}
                    >
                      {link.label}
                    </a>
                  </div>
                )
              )}
            </>
          ))}
        </div>
      </Col>

    </>
  );
};

export default MaterialItem;