import Modal from "react-bootstrap/Modal";
import ReactPlayer from "react-player";
import useHeightScreen from "src/hooks/useHeightScreen";
import { getUserIdFromSession, setEventGTM } from "src/selection";

function ModalPlayVideo(props: {
  show: boolean;
  handleClose: () => void;
  urlVideo: string;
  idLesson?: number | null;
  label?: string;
}) {
  const { show, handleClose, urlVideo, idLesson, label } = props;

  const handleVideoEnd = () => {
    setEventGTM({
      event: "completed_video",
      lesson_id: idLesson,
      user_id: getUserIdFromSession(),
      name_origin: label,
      event_category: label
    });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="xl"
        backdrop="static"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton className="border-0"></Modal.Header>
        <Modal.Body className="fw-bold">
          <div
            className="video-wrapper row"
            style={{ height: `${useHeightScreen() - 150}px` }}
          >
            <ReactPlayer
              url={urlVideo}
              playing
              controls={true}
              onEnded={handleVideoEnd}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload",
                  },
                },
              }}
              width="100%"
              height="100%"
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalPlayVideo;
