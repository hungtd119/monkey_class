import { faChevronRight, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from "react-bootstrap";
import formatTimestamp from 'src/utils/formatTimestamp';
import ToolTip from '../ToolTip';
import styles from './TableAttendenceStudent.module.scss';
const TableAttendenceStudent = (props: any) => {
    const { attendenceStudent } = props;
    return (
        <>
            <Table striped hover>
                <thead>
                    <tr>
                        <th className="text-start">Ngày</th>
                        <th className="text-center">Lớp học</th>
                        <th className="text-center">Giáo viên điểm danh</th>
                        <th className="text-center">Giờ đến</th>
                        <th className="text-center">Giờ về</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {attendenceStudent?.list?.length > 0 ? (
                        attendenceStudent?.list.map((attendence: any, index: number) => {
                            return (
                                <tr key={index} className={`pointer ${attendence?.data?.count_miss_data === 1 ? styles.warning : ""}`}>
                                    <td className={`text-start ${attendence?.data?.count_miss_data === 1 ? styles.warning_row : ''}`}>
                                        {attendence?.data?.count_miss_data === 1 ? <ToolTip message={"Thiếu dữ liệu"}>
                                            <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" color="#FF9500" />
                                        </ToolTip> : ""}
                                        {formatTimestamp(attendence?.key)}</td>
                                    <td className={`text-center ${attendence?.data?.count_miss_data === 1 ? styles.warning_row : ''}`}>{attendence?.data?.count_come_in}</td>
                                    <td className={`text-center ${attendence?.data?.count_miss_data === 1 ? styles.warning_row : ''}`}>{attendence?.data?.count_not_come_in}</td>
                                    <td className={`text-center ${attendence?.data?.count_miss_data === 1 ? styles.warning_row : ''}`}>
                                        <FontAwesomeIcon icon={faChevronRight} />
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
        </>
    )
}

export default TableAttendenceStudent
