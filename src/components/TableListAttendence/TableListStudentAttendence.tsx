import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { Table } from "react-bootstrap";
import { GENDER } from "src/constant";
import { useClassroomStore } from "src/stores/classroomStore";
import formatTimestamp from "src/utils/formatTimestamp";
import formatTimestampToHour from "src/utils/formatTimestampToHour";
import styles from './TableListAttendence.module.scss';
import { formatTimestampToYYYYMMDD } from "src/selection";
const TableListStudentAttendence = (props: any) => {
    const { listStudent, isTab, teachers = null, classroom = null } = props;
    return (
        <>
            {
                isTab ? <Table striped hover>
                        <tr className={`${styles.tr}`}>
                            <th className={`${styles.th} text-start`}>Ngày</th>
                            <th className={`${styles.th} text-center`}>Lớp học</th>
                            <th className={`${styles.th} text-center`}>Giáo viên điểm danh</th>
                            <th className={`${styles.th} text-center`}>Giờ đến</th>
                            <th className={`${styles.th} text-center`}></th>
                            <th className={`${styles.th} text-center`}>Giờ về</th>
                        </tr>
                    <tbody>
                    {
	                    listStudent.length > 0 ? listStudent.map ((student: any, index: number) => {
			                    return (
				                    <tr key={ index }>
					                    <td
						                    className={ `text-start ${ styles.text_attendence }` }>{ formatTimestamp (student?.date_attendance) }</td>
					                    <td
						                    className={ `text-center ${ styles.text_attendence }` }>{ classroom !== null ? classroom.name : "N/A" }</td>
					                    <td
						                    className={ `text-center ${ styles.text_attendence }` }>{ teachers !== null ? teachers[student?.teacher_id]?.name : "N/A" }</td>
					                    {
						                    student?.time_in ? (
							                    <>
								                    <td
									                    className={ `text-center ${ styles.text_attendence }` }>{ formatTimestampToHour (student?.time_in) }</td>
								                    <td className={ `text-center ${ styles.text_attendence }` }>
									                    <FontAwesomeIcon icon={ faArrowRightLong }/>
								                    </td>
								                    <td className={ `text-center` }>{ !student?.time_out ? <span
									                    style={ {color : "#FF9500"} }>N/A</span> : formatTimestampToHour (student?.time_out) }</td>
							                    </>
						                    ) : (
							                    <td colSpan={ 3 } className="text-center fw-bold"
							                        style={ {color : "#FF4B4B"} }>Vắng</td>
						                    )
					                    }
				                    </tr>
			                    )
		                    }
	                    ) : <tr>
		                    <td colSpan={ 6 } className='text-center fw-bold'>Không có dữ liệu</td>
	                    </tr>
                    }
                    </tbody>
	                </Table>
	                : <Table striped hover>
	                <tr className={`${styles.tr}`}>
                                <th className={`${styles.th} text-start`}>Tên học sinh</th>
                                <th className={`${styles.th} text-center`}>Giới tính</th>
                                <th className={`${styles.th} text-center`}>Ngày sinh</th>
                                <th className={`${styles.th} text-center`}>Giờ đến</th>
                                <th className={`${styles.th} text-center`}></th>
                                <th className={`${styles.th} text-center`}>Giờ về</th>
                            </tr>
                        <tbody>
                        {
	                        listStudent.length > 0 ? listStudent.map ((student: any, index: number) => {
			                        return (
				                        <tr key={ index }>
					                        <td className={ `text-start ${ styles.text_attendence }` }>{ student?.name }</td>
					                        <td
						                        className={ `text-center ${ styles.text_attendence }` }>{ GENDER[student?.gender] }</td>
					                        <td
						                        className={ `text-center ${ styles.text_attendence }` }>{ formatTimestampToYYYYMMDD (student?.date_of_birth) }</td>
					                        {
						                        student?.time_in ? (
							                        <>
								                        <td
									                        className={ `text-center ${ styles.text_attendence }` }>{ formatTimestampToHour (student?.time_in) }</td>
								                        <td className={ `text-center ${ styles.text_attendence }` }>
									                        <FontAwesomeIcon icon={ faArrowRightLong }/>
								                        </td>
								                        <td className={ `text-center` }>{ !student?.time_out ? <span
									                        style={ {color : "#FF9500"} }>N/A</span> : formatTimestampToHour (student?.time_out) }</td>
							                        </>
						                        ) : (
							                        <td colSpan={ 3 } className="text-center fw-bold"
							                            style={ {color : "#FF4B4B", paddingLeft : "32px"} }>Vắng</td>
						                        )
					                        }
				                        </tr>
			                        )
		                        }
	                        ) : <tr>
		                        <td colSpan={ 6 } className='text-center fw-bold'>Không có dữ liệu</td>
	                        </tr>
                        }
                        </tbody>
	                </Table>
            }
        </>
    )
}

export default TableListStudentAttendence
