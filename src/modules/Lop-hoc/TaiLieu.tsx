import { useRouter } from "next/router";
import React from "react";
import { Col } from "react-bootstrap";
import { globalPath } from "src/global";

const TaiLieuItem = (props: any) => {
  const { title, description, name, idLesson, pathThumb,tabId } = props;
  const router = useRouter()

  const handleViewDetailMaterial = (id: number) => {
    localStorage.setItem("isAssignOneClass", String(false));
    localStorage.setItem("previousTabId", tabId);
    router.push(`/view-material/${id}`);
  };

  return (
      <Col
        md={3}
        className="material-wrapper__img"
        onClick={() => handleViewDetailMaterial(idLesson)}
      >
        <div className="d-flex flex-column align-items-center">
          <img
            width="auto"
            height={152}
            className={"rounded-12"}
            src={
              pathThumb
                ? pathThumb
                : `${globalPath.pathImg}/default.png`
            }
            alt="thumb_material"
          />
        </div>
        <p className="ff-i fw-bold mt-4">{title}</p>
        <div className="desciption-lesson ff-i mt-3 text-line">{description}</div>
        {/*<div className="desciption-lesson mt-3" style={{ fontStyle: "italic" }}>*/}
        {/*  {name}*/}
        {/*</div>*/}
      </Col>
  );
};

export default TaiLieuItem;
