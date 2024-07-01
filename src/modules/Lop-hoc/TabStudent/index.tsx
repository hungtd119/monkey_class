import React, { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import Loading from "src/components/Loading";
import { TYPE_ACCOUNT_TEACHER } from "src/constant";
import TableListStudent from "src/modules/Hocsinh/DanhSachHocSinh";
import PopupDeleteStudent from "src/modules/Hocsinh/PopupDeleteStudent";
import { getSchoolId, getToken, getUserIdFromSession } from "src/selection";
import {
	addStudentToClassroom,
	changeClassroomStudent,
	changeClassroomStudentV2,
	deleteStudentFromClassroom, deleteStudentInSchoolV2,
	getListClassroom
} from "src/services/common";
import { useStudentStore } from "src/stores/studentStore";
import PopupAddStudent from "../PopupAddStudent";
import PopupChangeClassroom from "../PopupChangeClassroom";
import { globalPath } from "src/global";
import PopupAttendenceStudent from "../PopupAttendenceStudent/PopupAttendenceStudent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import PopupOptionAddStudent from "../PopupOptionAddStudent";
import PopupImportStudents from "../PopupImportStudents";
import PopupUploading from "../PopupUploading";
import { useSchoolStore } from "../../../stores/schoolStore";

const TabStudent = (props: any) => {
    const { typeAccount, id, storedClassName } = props;
    
    const [pageListStudent, setPageListStudent] = useState(0);
    const [idStudentActive, setIdStudentActive] = useState<number | null>(null);
    const [showPopupChangeClass, setShowPopupChangeClass] = useState(false);
    const [showPopupOptionAddStudent, setShowPopupOptionAddStudent] = useState(false);
    const [showPopupAddStudent, setShowPopupAddStudent] = useState(false);
    const [showPopupImportStudents, setShowPopupImportStudents] = useState(false);
    const [showPopupDeleteStudent, setShowPopUpDeleteStudent] = useState(false);
    const [showPopupAttendenceStudent, setShowPopupAttendenceStudent] = useState(false);
    const [dataStudent, setDataStudent] = useState<any>({ id: null, name: "", userID : null});
    const [formatedDataClassroom, setFormatedDataClassroom] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [processStudent, setProcessStudent] = useState(0);
    const [result, setResult] = useState("");
    const [createStudent, setCreateStudent] = useState(false);
    const [isDeleting,setIsDeleting] = useState(false);
		const {schoolActive} = useSchoolStore ((state: any) => ( {
			schoolActive : state.schoolActive,
		} ));
    const fetchListStudent = useStudentStore(
        (state: any) => state.fetchListStudent
    );
    const listStudent = useStudentStore((state: any) => state.listStudent);
    const fetchingStudent = useStudentStore(
        (state: any) => state.fetchingStudent
    );
    const total = useStudentStore(
        (state: any) => state.total
    );

    const handleChangeClass = async (id_student: number) => {
        try {
            setIdStudentActive(id_student);
            const res = await getListClassroom({ get_all: true, school_id: getSchoolId(),class_id: id});
            if (res.meta?.code === 200) {
                const listClassroom = res?.result.data
                    ? res.result?.data
                    : [];

                if (listClassroom?.length < 1) {
                    return toast.error("Hiện tại trường chỉ có 1 lớp nên không thực hiện được việc chuyển lớp.")
                }
                setFormatedDataClassroom(listClassroom &&
                    listClassroom.map((classroom: any) => ({
                        value: classroom.id,
                        label: classroom.name,
                    })));

                setShowPopupChangeClass(true);
            }
        } catch (error) {
            console.log(error);
        }

    };

    const handleDeleteStudent = (id: number, name: string, userID: number) => {
        setDataStudent({ id, name, userID });
        setShowPopUpDeleteStudent(true);
    };

    const closePopupChangeClass = () => {
        setShowPopupChangeClass(false);
    };

    const onSubmitChangeStudentClass = (data: any) => {
        const params = {
            class_id: data.classroom_id,
            student_id: idStudentActive,
        };
        changeClassroomStudentV2(params)
            .then((res: any) => {
                if (res.code === 200) {
                    toast.success("Cập nhật thành công");
                    setShowPopupChangeClass(false);
                    fetchListStudent({ class_id: id, page: 1, school_id:getSchoolId() });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onSubmitAddStudentToClass = (data: any) => {
        setIsSaving(true);
        const params = {
            ...data,
            date_of_birth: new Date(data.date_of_birth).getTime() / 1000,
            school_id: getSchoolId() || getUserIdFromSession(),
            class_id: id
        }

        const paramsAddStudentSuccess = {
            class_id: id,
            page: 1,
	          school_id: getSchoolId()
        };

        addStudentToClassroom(params).then((res: any) => {
            if (res.meta.code === 200) {
                toast.success("Thêm học sinh thành công");
                setShowPopupAddStudent(false);
                setIsSaving(false);
                fetchListStudent(paramsAddStudentSuccess);
            } else {
                toast.error(res?.meta?.message)
            }
        }).catch((err) => {
            setIsSaving(false);
            toast.error(err.response?.data?.meta?.message);
        });

    };

    const onSubmitDeleteStudent = () => {
        setIsDeleting(true);
        const params = {
            class_id: id,
            page: 1,
	          school_id: getSchoolId()
        };
        deleteStudentInSchoolV2({ id: dataStudent.id, school_id:schoolActive.id,user_id: dataStudent.userID })
            .then((res: any) => {
                setIsDeleting(false)
                if (res.code === 200) {
                    toast.success(`Xóa học sinh khỏi lớp ${storedClassName?.className} thành công`);
                    fetchListStudent(params);
                    setShowPopUpDeleteStudent(false);
                } else {
                    toast.error("Đã có lỗi xảy ra");
                }
            })
            .catch((err: any) => {
                setIsDeleting(false)
                console.log(err);
            });
    };
    
    const exportDataClass = () => {
        const params = {
            class_id: id,
        };
        const token  = getToken();
        const query = new URLSearchParams(params).toString();
        const url = `${process.env.NEXT_PUBLIC_API_USER_KINDY}students/export-data-class-by-class-id?token=${token}&${query}`;
        window.location.href = url;
    };
    
    
    useEffect(() => {
        const params = {
            class_id: id,
            page: pageListStudent + 1,
	          school_id: getSchoolId()
        };
        fetchListStudent(params);
    }, [pageListStudent]);

    useEffect(() => {
        if (createStudent) {
            const params = {
                class_id: id,
                page: pageListStudent + 1,
	            school_id: getSchoolId()
            };
            fetchListStudent(params);
        }
    },[createStudent])

    return (
        <div>
            <div className="fs-2 fw-bold">Danh sách học sinh</div>
            <div className="d-flex justify-content-end mb-6">
                <Button
                    variant="success-v3"
                    className="text-white fw-bold"
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
                <Button
                    variant="secondary-v2"
                    className="text-white fw-bold mx-2"
                    onClick={() => setShowPopupAttendenceStudent(true)}
                >
                    <FontAwesomeIcon icon={faBook} className="me-2" />
                    Lịch sử điểm danh
                </Button>
                {
                    typeAccount !== TYPE_ACCOUNT_TEACHER && <Button
                        variant="danger"
                        className="text-white fw-bold"
                        onClick={() => setShowPopupOptionAddStudent(true)}
                    >
                        <i className="fa fa-plus me-1" aria-hidden="true" />
                        Thêm học sinh
                    </Button>
                }
            </div>
            {!fetchingStudent ? (
                <>
                    <TableListStudent
                        typeAccount={typeAccount}
                        listStudent={listStudent}
                        fetchingStudent={fetchingStudent}
                        handleChangeClass={(id: number) => handleChangeClass(id)}
                        handleDeleteStudent={handleDeleteStudent}
                        classID={id}
                    />

                    {total > 1 && (
                        <ReactPaginate
                            previousLabel={""}
                            previousClassName={"icon icon-prev"}
                            nextLabel={""}
                            nextClassName={"icon icon-next"}
                            breakLabel={"..."}
                            pageCount={Math.ceil(total / 10)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={(data: any) => {
                                setPageListStudent(data.selected);
                            }}
                            forcePage={pageListStudent}
                            containerClassName="pagination"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            activeClassName="active"
                            previousLinkClassName="page-link page-link--prev"
                            nextLinkClassName="page-link page-link--next"
                            hrefAllControls
                        />
                    )}
                </>
            ) : (
                <Loading />
            )}
            {
                showPopupChangeClass && (
                    <PopupChangeClassroom
                        show={showPopupChangeClass}
                        onClose={closePopupChangeClass}
                        idStudentActive={idStudentActive}
                        dataClassroom={formatedDataClassroom}
                        onSubmit={onSubmitChangeStudentClass}
                    />
                )
            }
            {showPopupAddStudent && (
                <PopupAddStudent
                    show={showPopupAddStudent}
                    onClose={() => setShowPopupAddStudent(false)}
                    onSubmit={onSubmitAddStudentToClass}
                    isSaving={isSaving}
                />
            )}
            {showPopupImportStudents && (
                <PopupImportStudents
                    show={showPopupImportStudents}
                    onClose={() => {
                        setShowPopupImportStudents(false)
                        setProcessStudent(0)
                        setResult("")
                    }}
                    setIsUploading={setIsUploading}
                    setProcess={setProcessStudent}
                    setResult={setResult}
                    classId={id}
                    setCreateStudent={setCreateStudent}
                // onSubmit={onSubmitAddStudentToClass}
                />
            )}
            {isUploading && (
                <PopupUploading
                    show={isUploading}
                    process={processStudent}
                    onClose={() => {
                        setIsUploading(false)
                        setProcessStudent(0)
                        setResult("")
                    }}
                    result={result}
                // onSubmit={onSubmitAddStudentToClass}
                />
            )}
            {showPopupAttendenceStudent && (
                <PopupAttendenceStudent
                    show={showPopupAttendenceStudent}
                    onClose={() => setShowPopupAttendenceStudent(false)}
                />
            )}
            {showPopupOptionAddStudent && (
                <PopupOptionAddStudent
                    show={showPopupOptionAddStudent}
                    classId={id}
                    onClose={() => setShowPopupOptionAddStudent(false)}
                    setShowPopupImportStudents={setShowPopupImportStudents}
                />
            )}
            <PopupDeleteStudent
                show={showPopupDeleteStudent}
                handleClose={() => setShowPopUpDeleteStudent(false)}
                dataStudent={dataStudent}
                onSubmit={onSubmitDeleteStudent}
                isDeleting={isDeleting}
            />
        </div>
    )
}
export default TabStudent;
