import React, { useEffect, useState } from 'react'
import Select from "react-select";
import LabelValueTopBot from 'src/components/LabelValueTopBot';
import Loading from 'src/components/Loading';
import SelectCus from 'src/components/SelectCus';
import TableAttendenceStudent from 'src/components/TableAttendenceStudent';
import TableListAttendence from 'src/components/TableListAttendence/TableListAttendence';
import TableListStudentAttendence from 'src/components/TableListAttendence/TableListStudentAttendence';
import { ALL, ABSENT, MISSING_DATA, PRESENT, months, statusAttendences } from 'src/constant';
import { getListAttendenceByStudent } from 'src/services/common';
import { Button } from "react-bootstrap";
import Image from "next/image";
import { getToken } from "../../selection";
const AttendenceHistory = (props: any) => {
    const { studentID, classroom } = props;
    const [dateAttendence, setDateAttendence] = useState<any>(months.find(month => month.index === new Date().getMonth()));
    const [statusAttendence, setStatusAttendence] = useState<any>({
        value: 0,
        label: "Tất cả"
    });
    const [dataAttendence, setDataAttendence] = useState({
        total: 0,
        count_come_in: 0,
        count_not_come_in: 0,
        count_miss_data: 0
    })
    const [teachers, setTeachers] = useState<any>({});
    const [listStudent, setListStudent] = useState<any>([]);
    const [listStudentFilter, setListStudentFilter] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeSelectMonth = (selectedOption: any) => {
        setDateAttendence(selectedOption);
        const params = { student_id: studentID, class_id: classroom?.id, date_attendance: selectedOption?.value }
        fetchListAttendenceByStudent(params);
    }
    const handleChangeSelectStatus = (selectedOption: any) => {
        setStatusAttendence(selectedOption);
        if (selectedOption.value === ABSENT) {
            setListStudentFilter((prev: any) => listStudent.filter((prevItem: any) => prevItem.time_in === null))
        }
        if (selectedOption.value === PRESENT) {
            setListStudentFilter((prev: any) => listStudent.filter((prevItem: any) => prevItem.time_in !== null))
        }
        if (selectedOption.value === MISSING_DATA) {
            setListStudentFilter((prev: any) => listStudent.filter((prevItem: any) => (prevItem.time_out === null && prevItem.time_in !== null)))
        }
        if (selectedOption.value === ALL) {
            setListStudentFilter((prev: any) => listStudent)
        }
    }

    const fetchListAttendenceByStudent = async (params: any) => {
        setIsLoading(true);
        try {
            const res = await getListAttendenceByStudent(params)
            if (res?.code === 200) {
                setIsLoading(false);
                let attendenceStudent = res?.data;
                const listStudent = attendenceStudent?.list.sort((a: any, b: any) => b.date_attendance - a.date_attendance);
                setListStudent(listStudent);
                setListStudentFilter(listStudent);
                setDataAttendence({
                    total: attendenceStudent?.total,
                    count_come_in: attendenceStudent?.count_come_in,
                    count_not_come_in: attendenceStudent?.count_not_come_in,
                    count_miss_data: attendenceStudent?.count_miss_data
                })
                setTeachers(attendenceStudent?.teachers);
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error);

        }
    }

    useEffect(() => {
        const params = { student_id: studentID, class_id: classroom?.id, date_attendance: dateAttendence?.value }
        fetchListAttendenceByStudent(params);
    }, [])
    
    const exportDataClass = () => {
        const params = {
            class_id: (classroom?.id || '').toString(),
            date_attendance: dateAttendence?.value,
            type: '1',
            student_id: studentID,
        };
        const token  = getToken();
        const query = new URLSearchParams(params).toString();
        const url = `${process.env.NEXT_PUBLIC_API_CLASSROOM}export-attendance-by-class-id?token=${token}&${query}`;
        window.location.href = url;
    };
    
    return (
        <div>
            <div className='d-flex'>
                <div className='me-4'>
                    <SelectCus
                        options={statusAttendences}
                        defaultValue={statusAttendence}
                        onChange={(selectedOption: any) => handleChangeSelectStatus(selectedOption)}
                        placeholder={"Chọn status"}
                    />
                </div>
                <div>
                    <SelectCus
                        options={months}
                        defaultValue={dateAttendence}
                        placeholder={"Chọn tháng"}
                        onChange={(selectedOption: any) => handleChangeSelectMonth(selectedOption)}
                    />
                </div>
    
                <Button
                    variant="success-v3"
                    className="text-white fw-bold ms-2"
                    style={{borderRadius: "12px"}}
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
            </div>
            <div className='my-8' style={{ minHeight: "380px", maxHeight: "380px", overflowY: "scroll" }}>
                {
                    isLoading ?
                        <div style={{ height: "400px" }} className="d-flex align-items-center justify-content-center">
                            <Loading />
                        </div>
                        :
                        dataAttendence?.total > 0 ? <TableListStudentAttendence listStudent={listStudentFilter} isTab={true} teachers={teachers} classroom={classroom} /> : <div className='h4 fw-bold text-center'>Không có dữ liệu</div>
                }
            </div>
            <div className='d-flex flex-row justify-content-between align-items-end p-4'>
                <div className='d-flex flex-row'>
                    <div style={{ borderRight: "1px solid #AFAFAF", height: "59px" }}>
                        <div className='fw-bold h6' style={{ color: "#777777", marginRight: "54px" }}>
                            Tổng
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline" }}>
                            <p className='fw-bold h2'>{dataAttendence.total}</p> <p className='h6 fw-bold mx-2'>ngày học</p>
                        </div>
                    </div>
                    <LabelValueTopBot label={"Có mặt"} value={dataAttendence.count_come_in} color={"#92C73D"} />
                    <LabelValueTopBot label={"Vắng"} value={dataAttendence.count_not_come_in} color={"#FF4B4B"} />
                    <LabelValueTopBot label={"Thiếu dữ liệu"} value={dataAttendence.count_miss_data} color={"#FF9500"} />
                </div>
            </div>
        </div>
    )
}

export default AttendenceHistory
