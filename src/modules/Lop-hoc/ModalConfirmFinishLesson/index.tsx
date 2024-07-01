import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import useTrans from "src/hooks/useTrans";

type PropsType = {
  show: boolean,
  onClose: () => void,
  onSubmit: () => void,
}
function ModalConfirmFinishLesson(props: PropsType) {
  const {show, onClose, onSubmit} = props;
  const trans = useTrans();

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton className="border-0"></Modal.Header>
        <Modal.Body className="fw-bold fs-3 text-center">
          {trans.title_modal_confirm_lesson}
        </Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-between p-7">
          <Button variant="not-done" onClick={()=> onClose()} className="p-3 text-white fw-bold">
            {trans.not_completed}
          </Button>
          <Button variant="done" onClick={()=> onSubmit()} className="p-3 text-white fw-bold">
            {trans.completed} 
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalConfirmFinishLesson;
