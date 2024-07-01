import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { globalPath } from "src/global";
import Select from "react-select";
import TableListStudent from "./DanhSachHocSinh";
import { checkTypeAccount, getUserIdFromSession, getToken, getSchoolId } from "src/selection";
import PopupChangeClassroom from "../Lop-hoc/PopupChangeClassroom";
import PopupDeleteStudent from "./PopupDeleteStudent";
import { useStudentStore } from "src/stores/studentStore";
import {
  ACCEPTED,
  COURSE_ID,
  DATA_PACKAGES,
  TYPE_ACCOUNT_ADMIN,
  TYPE_ACCOUNT_SCHOOL,
} from "src/constant";
import ReactPaginate from "react-paginate";
import { useClassroomStore } from "src/stores/classroomStore";
import { deleteStudent, deleteStudentInSchoolV2, getListProvince } from "src/services/common";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSchoolStore } from "src/stores/schoolStore";

const TongQuanHocsinh = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      name: "",
      course_id: "",
      province_id: "",
      school_id: "",
    },
  });

  const { schoolActive } = useSchoolStore((state: any) => ({
    schoolActive: state.schoolActive,
  }));

  const [typeAccount, setTypeAccount] = useState(null);
  const [showPopupChangeClass, setShowPopupChangeClass] = useState(false);
  const [showPopupDeleteStudent, setShowPopUpDeleteStudent] = useState(false);
  const [dataStudent, setDataStudent] = useState<any>({ id: null, name: "" });
  const [page, setPage] = useState(0);
  const [idStudentActive, setIdStudentActive] = useState<number | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	
	const isFirstRender = useRef(true);
	
  const fetchListStudent = useStudentStore(
    (state: any) => state.fetchListStudent
  );
  const fetchListSchool = useClassroomStore(
    (state: any) => state.fetchListSchool
  );
  const listStudent = useStudentStore((state: any) => state.listStudent);
  const fetchingStudent = useStudentStore(
    (state: any) => state.fetchingStudent
  );
  const total = useStudentStore((state: any) => state.total);
  const totalOverview = useStudentStore((state: any) => state.totalOverview);

  const [dataForm, setDatForm] = useState({});

  useEffect(() => {
    const params = {
      page: page + 1,
      per_page: 10,
      ...dataForm,
      school_id: s || getSchoolId() || getUserIdFromSession()
    };
    if(schoolActive?.isAccept === ACCEPTED) {
      fetchListStudent(params);
    }
  }, [page, dataForm, schoolActive?.isAccept]);
	
	useEffect (() => {
		
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		
		const params = {
			page: 1,
			per_page: 10,
			school_id: schoolActive?.id || s || getSchoolId() || getUserIdFromSession()
		};
		fetchListStudent(params);
	}, [schoolActive?.id]);
	
  const { s } = router.query;

  useEffect(() => {
    if(!getToken()) {
      router.push("/sign-in")
    }
    setTypeAccount(checkTypeAccount());
    fetchListSchool();
    const formatSchoolSession = [
      {
        "id": s ?? getSchoolId(),
    }
    ]
    sessionStorage.setItem("school", JSON.stringify(formatSchoolSession) ?? "");
    // s || getSchoolId() && router.replace(`/danh-sach-hoc-sinh?s=${s || getSchoolId()}`)
  }, []);

  const onSubmit = (data: any) => {
    setPage(0);
    setDatForm(data);
  };

  const closePopupChangeClass = () => {
    setShowPopupChangeClass(false);
  };

  const handleDeleteStudent = (id: number, name: string) => {
    setDataStudent({ id, name });
    setShowPopUpDeleteStudent(true);
  };

  const handleChangeClass = (id: number) => {
    setIdStudentActive(id);
    setShowPopupChangeClass(true);
  };

  const onSubmitDeleteStudent = () => {
	  setIsDeleting(true);
    const params = {
      page: page + 1,
      per_page: 10,
      school_id: s || getSchoolId()
    };
    deleteStudentInSchoolV2({ id: dataStudent.id,school_id:schoolActive.id,user_id:dataStudent.userID })
      .then((res: any) => {
				setIsDeleting(false);
        if (res.code === 200) {
          toast.success("Xóa học sinh thành công");
          setShowPopUpDeleteStudent(false);
          fetchListStudent(params);
        } else {
          toast.error("Đã có lỗi xảy ra");
        }
      })
      .catch((err: any) => {
				setIsDeleting(false);
        console.log(err);
      });
  };
  
  const exportDataClass = () => {
    const params = {
      school_id: (s || getSchoolId()).toString(),
    };
    const token  = getToken();
    const query = new URLSearchParams(params).toString();
    const url = `${process.env.NEXT_PUBLIC_API_USER_KINDY}students/export-student-by-school-id?token=${token}&${query}`;
    window.location.href = url;
  };

  return (
    <section className="section-hocsinh">
      <div className="info-overview row gap-7 ps-4 py-4">
        <Col md={4} className="col-info py-3">
          <div className="d-flex justify-content-center fs-2 fw-bold mb-1">
            Tổng số học sinh
          </div>
          <div className="d-flex align-items-center justify-content-center gap-7">
            <Image
              src={`${globalPath.pathImg}/student_64x64.png`}
              width={64}
              height={64}
              alt="school"
            />
            {!fetchingStudent && <span className="fs-5 fw-bold">{total}</span>}
          </div>
        </Col>
      </div>

      <div className="fs-3 fw-bold mt-6">Danh sách học sinh</div>
      <Form>
        <div className="filter-list row">
          <Col md={4} className="py-1">
            <Form.Group className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder={
                  typeAccount == TYPE_ACCOUNT_SCHOOL
                    ? "Nhập tên học sinh"
                    : "Nhập tên học sinh/ SĐT phụ huynh/ email phụ huynh"
                }
                {...register("text_search")}
              />
            </Form.Group>
          </Col>

          {/* {typeAccount === TYPE_ACCOUNT_ADMIN && (
            <Col md={2} className="py-1">
              <Form.Group>
                <Controller
                  render={({ field: { onChange } }: any) => (
                    <Select
                      placeholder="Môn"
                      isClearable
                      options={DATA_PACKAGES}
                      onChange={(selectedOption: any) => {
                        onChange(selectedOption ? selectedOption.value : "");
                      }}
                    />
                  )}
                  name="course_id"
                  control={control}
                />
              </Form.Group>
            </Col>
          )}

          {typeAccount === TYPE_ACCOUNT_ADMIN && (
            <Col md={2} className="py-1">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Controller
                  render={({ field: { onChange } }: any) => (
                    <Select
                      placeholder="Tỉnh"
                      options={listProvince}
                      maxMenuHeight={200}
                      isClearable
                      onChange={(selectedOption: any) => {
                        onChange(selectedOption ? selectedOption.value : "");
                      }}
                    />
                  )}
                  name="province_id"
                  control={control}
                />
              </Form.Group>
            </Col>
          )}

          {typeAccount === TYPE_ACCOUNT_ADMIN && (
            <Col md={2} className="py-1">
              <Form.Group>
                <Controller
                  render={({ field: { onChange } }: any) => (
                    <Select
                      placeholder="Trường"
                      options={formatDataSchool}
                      isClearable
                      onChange={(selectedOption: any) => {
                        onChange(selectedOption ? selectedOption.value : "");
                      }}
                    />
                  )}
                  name="school_id"
                  control={control}
                />
              </Form.Group>
            </Col>
          )} */}
          <Col md={2}>
            <Button variant="success" onClick={handleSubmit(onSubmit)} className="text-white fw-bold">
              Tìm kiếm
            </Button>
          </Col>
        </div>
      </Form>
      <div className="d-flex justify-content-end mb-2">
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
      </div>
      <TableListStudent
        typeAccount={typeAccount}
        setShowPopupChangeClass={setShowPopupChangeClass}
        listStudent={listStudent}
        handleDeleteStudent={handleDeleteStudent}
        handleChangeClass={(id: number) => handleChangeClass(id)}
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
            setPage(data.selected);
          }}
          forcePage={page}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="active"
          previousLinkClassName="page-link page-link--prev"
          nextLinkClassName="page-link page-link--next"
          hrefAllControls
        />
      )}

      <PopupChangeClassroom
        show={showPopupChangeClass}
        onClose={closePopupChangeClass}
        handleChangeClass={handleChangeClass}
        idStudentActive={idStudentActive}
      />

      <PopupDeleteStudent
        show={showPopupDeleteStudent}
        handleClose={() => setShowPopUpDeleteStudent(false)}
        dataStudent={dataStudent}
        onSubmit={onSubmitDeleteStudent}
        isDeleting={isDeleting}
      />
    </section>
  );
};

export default TongQuanHocsinh;
