import { faChevronRight, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { Table } from "react-bootstrap";
import formatTimestamp from 'src/utils/formatTimestamp';
import styles from './TableListAttendence.module.scss';
import ToolTip from '../ToolTip';
import PopupAttendenceStudentDetail from 'src/modules/Lop-hoc/PopupAttendenceStudent/PopupAttendenceStudentDetail';
const TableListAttendence = (props: any) => {
    const { listAttendence } = props;

    const [showPopupAttendenceStudentDetail, setShowPopupAttendenceStudentDetail] = useState(false);
    const [listStudent, setListStudent] = useState<any>({});

    const handleClickDetailAttendenceStudent = (students: any) => {
        setListStudent(students);
        setShowPopupAttendenceStudentDetail(true);
    }
    return (
        <>
            <Table striped hover className={`${styles.table_separate}`}>
                <tr className={`${styles.tr}`}>
                    <th className={`${styles.th} text-start`}>Ngày</th>
                    <th className={`${styles.th} text-center`}>Có mặt</th>
                    <th className={`${styles.th} text-center`}>Vắng</th>
                    <th className={`${styles.th} text-center`}></th>
                </tr>
                <tbody>
                    {listAttendence?.length > 0 ? (
                        listAttendence.map((attendence: any, index: number) => {
                            return (
                                <tr key={index} className={`pointer`} onClick={() => handleClickDetailAttendenceStudent(attendence)}>
                                    <td className={`${styles.text_attendence} ${attendence?.data?.count_miss_data > 0 ? styles.td : ""} text-start`}>
                                        {attendence?.data?.count_miss_data > 0 ? <ToolTip message={"Thiếu dữ liệu"}>
                                            <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" color="#FF9500" />
                                        </ToolTip> : ""}
                                        {formatTimestamp(attendence?.key)}</td>
                                    <td className={`${styles.text_attendence} ${attendence?.data?.count_miss_data > 0 ? styles.td : ""} text-center`}>{attendence?.data?.count_come_in}</td>
                                    <td className={`${styles.text_attendence} ${attendence?.data?.count_miss_data > 0 ? styles.td : ""} text-center`}>{attendence?.data?.count_not_come_in}</td>
                                    <td className={`${styles.text_attendence} ${attendence?.data?.count_miss_data > 0 ? styles.td : ""} text-center`}>
                                        <FontAwesomeIcon icon={faChevronRight} color='#AFAFAF' />
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={4} className='text-center'>Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <PopupAttendenceStudentDetail show={showPopupAttendenceStudentDetail} onClose={() => setShowPopupAttendenceStudentDetail(false)} listStudent={listStudent} />
        </>
    )
}

export default TableListAttendence
