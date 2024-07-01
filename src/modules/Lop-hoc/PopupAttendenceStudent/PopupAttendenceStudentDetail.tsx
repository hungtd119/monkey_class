import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import LabelValueTopBot from 'src/components/LabelValueTopBot';
import TableListStudentAttendence from 'src/components/TableListAttendence/TableListStudentAttendence';
import formatTimestamp from 'src/utils/formatTimestamp';
import styles from './PopupAttendenceStudent.module.scss';
import { nunito } from '@styles/font';
import Image from "next/image";
import { getToken } from "../../../selection";
import { useRouter } from "next/router";

const PopupAttendenceStudentDetail = (props: any) => {
    const { show, onClose, listStudent } = props;
    const router = useRouter();
    const { id } = router.query;
    const exportDataClass = () => {
        const params = {
            class_id: (id || '').toString(),
            date_attendance: listStudent.key,
            type: '0',
        };
        const token  = getToken();
        const query = new URLSearchParams(params).toString();
        const url = `${process.env.NEXT_PUBLIC_API_CLASSROOM}export-attendance-by-class-id?token=${token}&${query}`;
        window.location.href = url;
    };
    
    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            keyboard={false}
            backdrop="static"
            size="xl"
            className={`${nunito.className} modal-rounded`}
        >
            <Modal.Header closeButton className={`border-0 fw-bold ${styles.p_32}`} style={{fontSize:"20px"}}>
                <FontAwesomeIcon icon={faChevronLeft} className='me-2 pointer' onClick={onClose}/>
                {
                    formatTimestamp(listStudent?.key)
                }
                <Button
                    variant="success-v3"
                    className="text-white fw-bold ms-3"
                    onClick={() => exportDataClass()}
                >
                    <Image
                        src={`${global.pathSvg}/document-text.svg`}
                        width={20}
                        height={20}
                        alt="icon"
                        className="me-2"
                    />
                    Xuất dữ liệu
                </Button>
            </Modal.Header>
            <Modal.Body className={`body-limit-sroll-height-min ${styles.p_0_32}`}>
                <TableListStudentAttendence listStudent={listStudent?.data?.list} />
            </Modal.Body>
            <div className={`d-flex flex-row justify-content-between align-items-end ${styles.p_0_32_24_32}`}>
                <div className='d-flex flex-row'>
                    <div style={{ borderRight: "1px solid #AFAFAF",height:"59px" }}>
                        <div className='fw-bold h6' style={{ color: "#777777", marginRight: "54px" }}>
                            Tổng
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline" }}>
                            <p className='fw-bold h2'>{listStudent?.data?.total}</p> <p className='h6 fw-bold mx-2'>học sinh</p>
                        </div>
                    </div>
                    <LabelValueTopBot label={"Có mặt"} value={listStudent?.data?.count_come_in} color={"#92C73D"} />
                    <LabelValueTopBot label={"Vắng"} value={listStudent?.data?.count_not_come_in} color={"#FF4B4B"} />
                    <LabelValueTopBot label={"Thiếu dữ liệu"} value={listStudent?.data?.count_miss_data} color={"#FF9500"} />
                </div>
                <div>
                    <Button 
                    variant="info" 
                    size='lg'
                    className="fw-bold" 
                    onClick={onClose}>
                        <div className='h5 fw-medium m-0 px-2 py-1 text-white'>Quay lại</div>
                    </Button>
                </div>
            </div>
            <Modal.Footer className={`border-0 gap-4 p-2`}>
            </Modal.Footer>
        </Modal>
    )
}

export default PopupAttendenceStudentDetail
