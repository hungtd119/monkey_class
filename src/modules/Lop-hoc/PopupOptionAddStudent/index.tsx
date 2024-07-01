import { nunito } from '@styles/font';
import React from 'react'
import { Modal } from 'react-bootstrap';
import styles from './PopupOptionAddStudent.module.scss';
import OptionAddStudent from "../../../components/OptionAddStudent";
import { useRouter } from "next/router";

const PopupOptionAddStudent = (props:any) => {
    const {show,classId,setShowPopupImportStudents,onClose} = props;
		const router = useRouter();
  return (
    <Modal
      show={show}
      centered
      onHide={onClose}
      keyboard={false}
      backdrop="static"
      size="lg"
      className={`${nunito.className} modal-rounded`}
    >
      <Modal.Header closeButton className={`border-0 fw-bold ${styles.p_32_32_0_32}`}>
      </Modal.Header>
	    <Modal.Body className={ `${ styles.p_0_32 }` }>
		    <div className='h3 fw-bold text-center' style={ {color : "#383838",fontWeight:"800"} }>
			    Thêm học sinh
		    </div>
		    <div className="row gap-6 px-6 pb-6">
			    <OptionAddStudent
				    title={"Thêm thủ công"}
				    des={"Điền thông tin cho từng học sinh"}
				    onClick={() => {
						onClose()
						router.push(`/add-multiple-student/${classId}`)
						}
				    }/>
			    <OptionAddStudent
				    title={"Thêm tự động"}
				    des={"Tự động tạo danh sách học sinh theo danh sách mẫu"}
			      onClick={() => {
						onClose()
				      setShowPopupImportStudents(true)
			      }}
			    />
		    </div>
	    </Modal.Body>
	    <Modal.Footer className="border-0 d-flex gap-4 p-2">
      </Modal.Footer>
    </Modal>
  )
}

export default PopupOptionAddStudent
