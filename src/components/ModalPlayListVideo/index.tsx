import React, { useState, useEffect, useRef } from "react";
import { Col, Modal } from "react-bootstrap";
import { globalPath } from "src/global";
import ModalPlayGame from "./ModalPlayGame";
import Image from "next/image";
import { TYPE_GAME } from "src/modules/DoingExercise/const";
import { nunito } from "@styles/font";

const ModalPlayListVideo = (props: any) => {
  const { show, handleClose, listPlayVideo } = props;

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showModalPlayGame, setShowModalPlayGame] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [idQuestion, setIdQuestion] = useState<any>(0 || null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoEnd = () => {
    setCurrentVideoIndex(currentVideoIndex + 1);
    if (listPlayVideo[currentVideoIndex]?.question_set_id !== 0 && currentVideoIndex <= listPlayVideo.length - 1) {
      exitFullScreen();
      handleShowModalPlayGame(
        listPlayVideo[currentVideoIndex]?.question_set_id
      );
    }
  };

  useEffect(() => {
    if (
      videoRef.current &&
      isVideoPlaying &&
      currentVideoIndex < listPlayVideo.length
    ) {
      videoRef.current.load();
      videoRef.current.play();
    }

    const container = document.querySelector(".list-video");
    if (container) {
      const highlightedVideo = document.querySelector(".highlight");
      if (highlightedVideo) {
        const containerRect = container.getBoundingClientRect();
        const highlightedRect = highlightedVideo.getBoundingClientRect();

        const scrollTo =
          highlightedRect.top - containerRect.top + container.scrollTop;
        container.scrollTo({
          top: scrollTo - 100,
          behavior: "smooth",
        });
      }
    }
  }, [currentVideoIndex, isVideoPlaying]);

  const handleThumbnailClick = (index: number) => {
    setCurrentVideoIndex(index);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  const handleClickPlayGame = (index: number, questionSetId: number) => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setCurrentVideoIndex(index);
    setShowModalPlayGame(true);
    setIsVideoPlaying(false);
    setIdQuestion(questionSetId);
  }

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleShowModalPlayGame = (questionSetId: number) => {
    setShowModalPlayGame(true);
    setIsVideoPlaying(false);
    setIdQuestion(questionSetId);
  };

  const handleCloseModalPlayGame = () => {
    setIsVideoPlaying(true);
    setShowModalPlayGame(false);
    if(currentVideoIndex <= listPlayVideo.length - 1){
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="xl"
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
        className={nunito.className}
      >
        <Modal.Header closeButton className="border-0 fw-bold fs-3">
          {listPlayVideo[currentVideoIndex]?.name}
        </Modal.Header>
        <Modal.Body className="fw-bold">
          <div className="video-wrapper row">
            <Col
              md={listPlayVideo.length > 1 ? 9 : 12}
              sm={12}
              style={{ maxHeight: "70vh" }}
            >
              <video
                ref={videoRef}
                controls
                autoPlay
                onEnded={handleVideoEnd}
                controlsList="nodownload"
                style={{ width: "100%", height: "100%" }}
              >
                <source
                  src={listPlayVideo[currentVideoIndex]?.link}
                  type="video/mp4"
                />
              </video>
            </Col>

            {listPlayVideo.length > 1 ? (
              <Col md={3} sm={12} className="list-video">
                <div className="d-flex flex-column gap-4 py-2 pointer">
                  {listPlayVideo.map((video: any, index: number) => {
                    const questionSetId = video.question_set_id;
                    const gameData = video.dataQuestion?.[questionSetId];

                    return (
                      <>
                        {video.isShow && (
                          <div
                            className={`d-flex align-items-center gap-4 ${
                              index === currentVideoIndex ? "highlight" : ""
                            }`}
                            style={{ minHeight: "100px", padding: "0 10px" }}
                            key={video.id}
                            onClick={() => handleThumbnailClick(index)}
                          >
                            <span style={{ minWidth: "15px" }}>
                              {index + 1}
                            </span>

                            <img
                              src={
                                video.path_thumb ??
                                `${globalPath.pathImg}/default.png`
                              }
                              width={70}
                              height={50}
                              alt={video.title}
                            />
                            <p className="list-video__title">{video?.name}</p>
                          </div>
                        )}
                        {questionSetId !== 0 && gameData && !video.isShow && (
                          <div
                            className={`activity-wrapper d-flex align-items-center justify-content-between ${
                              index === currentVideoIndex ? "highlight" : ""
                            }`}
                            onClick={() => handleClickPlayGame(index, video?.question_set_id)
                            }
                          >
                            <div
                              className="activity-wrapper__left d-flex gap-3 align-items-center"
                              style={{ padding: "0 10px" }}
                            >
                              {index + 1}
                              {gameData.game_id == TYPE_GAME.DAD_Image && (
                                <Image
                                  src="https://vnmedia2.monkeyuni.net/upload/web/img_default/thumb_game_DAD.svg"
                                  width={24}
                                  height={24}
                                  alt="play"
                                />
                              )}
                              {gameData.game_id == TYPE_GAME.MTC_BG && (
                                <Image
                                  src="https://vnmedia2.monkeyuni.net/upload/web/img_default/thumb_game_MTC_BG.svg"
                                  width={24}
                                  height={24}
                                  alt="play"
                                />
                              )}
                              <p>{gameData.title}</p>
                            </div>
                            <Image
                              src="https://vnmedia2.monkeyuni.net/upload/web/img_default/icon_play_game.svg"
                              width={20}
                              height={20}
                              alt="play"
                            />
                          </div>
                        )}
                      </>
                    );
                  })}
                </div>
              </Col>
            ) : (
              <></>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <ModalPlayGame
        show={showModalPlayGame}
        handleClose={() => handleCloseModalPlayGame()}
        id={idQuestion}
      />
    </>
  );
};

export default ModalPlayListVideo;