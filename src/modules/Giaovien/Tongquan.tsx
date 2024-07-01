import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, Col, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { globalPath } from "src/global";
import TableListTeacher from "./Danhsachgiaovien";
import {
	ACCEPTED,
	HTTP_STATUS_CODE_OK,
	MODE_CREATE,
	MODE_EDIT,
	TYPE_ACCOUNT_ADMIN,
	TYPE_ACCOUNT_PARENTS,
	TYPE_ACCOUNT_SCHOOL, TYPE_ACCOUNT_TEACHER,
} from "src/constant";
import { useTeacherStore } from "src/stores/teacherStore";
import { checkTypeAccount, getUserIdFromSession, getToken, getSchoolId } from "src/selection";
import { useForm } from "react-hook-form";
import FormGiaoVienAccountSchool from "./FormGiaoVienAccountSchool";
import Loading from "src/components/Loading";
import { useRouter } from "next/router";
import FormGiaoVienAccountAdmin from "./FormGiaoVienAccountAdmin";
import PopupDeleteTeacher from "./PopupDeleteGiaovien";
import {
	acceptRequestJoinSchool,
	deleteTeacher,
	deleteTeacherInSchoolV2, deleteUserInSchoolV2,
	getListClassroom,
	getListTeacher,
	getListTeacherV2,
	getListUserRequestJoinSchool
} from "src/services/common";
import { toast } from "react-toastify";
import PopupUserRequestSchool from "../SchoolVerify/PopupUserRequestSchool";
import { useSchoolStore } from "src/stores/schoolStore";
import useNotificationStore from "src/stores/notiStore";
import { array } from "yup";
import { useAppStore } from "src/stores/appStore";

const Tongquan = () => {
  const router = useRouter();
  const { s } = router.query;

  const {
    handleSubmit,
    register,
  } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      text_search: "",
      course_id: "",
      type: "",
    },
  });

  const [page, setPage] = useState(0);
  const [showFormGiaoVien, setShowFormGiaovien] = useState(false);
  const [mode, setMode] = useState(MODE_CREATE);
  const [typeAccount, setTypeAccount] = useState(null);
  const [showPopupDeleteTeacher, setShowPopupDeleteTeacher] = useState(false);
  const [createTeacherSuccess, setCreateTeacherSuccess] = useState(false);
  const [dataTeacher, setDataTeacher] = useState<any>({ id: null, name: "",roles:[] });
  const [listTeacher, setListTeacher] = useState([]);
  const [total, setTotal] = useState(0);
  const [fetchingListTeacher, setFetchingListTeacher] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	
	const isFirstRender = useRef(true);
	
	// const fetchListTeacher = useTeacherStore(
  //   (state: any) => state.fetchListTeacher
  // );

  const fetchListTeacher = async (params:any) => {
    setFetchingListTeacher(true);
    const res = await getListTeacherV2(params);
    if (res?.code === 200) {
      setFetchingListTeacher(false);
      const listTeacher = res?.data
          ? res?.data
          : [];
      const total = res?.total || 0;
      setListTeacher(listTeacher);
      setTotal(res?.meta.total);
			setCreateTeacherSuccess(false);
    }
  }

  // const fetchingListTeacher = useTeacherStore(
  //   (state: any) => state.fetchingListTeacher
  // );
  // const listTeacher = useTeacherStore((state: any) => state.listTeacher);
  // const total = useTeacherStore((state: any) => state.total);
  const fetchTotalTeacherInSchool = useTeacherStore((state: any) => state.fetchTotalTeacherInSchool);
  const { showButtonAcceptRequest } = useAppStore((state: any) => ({
    showButtonAcceptRequest: state.showButtonAcceptRequest,
  }))
  const { schoolActive } = useSchoolStore((state: any) => ({
    schoolActive: state.schoolActive,
  }));

  const { listUserRequestJoinSchool, loadingListUserRequestJoinSchool, fetchGetListUserJoinSchool } = useTeacherStore((state: any) => ({
    listUserRequestJoinSchool: state.listUserRequestJoinSchool,
    fetchGetListUserJoinSchool: state.fetchGetListUserJoinSchool,
    loadingListUserRequestJoinSchool: state.loadingListUserRequestJoinSchool
  }));

  useEffect(() => {
    if(schoolActive?.isAccept === ACCEPTED || s ||  getSchoolId()) {
      fetchGetListUserJoinSchool();
      router.replace(`${router.pathname}?s=${schoolActive?.value || s || getSchoolId()}`)
    }
    const formatSchoolSession = [
      {
        "id": s || getSchoolId(),
    }
    ]
    sessionStorage.setItem("school", JSON.stringify(formatSchoolSession) ?? "");

  },[schoolActive?.value, schoolActive?.isAccept])

  useEffect(() => {
    const params = {
      per_page: 10,
      page: page + 1,
      school_id: s || getSchoolId() || getUserIdFromSession()
    };
    if (createTeacherSuccess) {
      fetchListTeacher(params);
    }
  }, [createTeacherSuccess]);

  useEffect(() => {
    if (!getToken()) {
      router.push("/sign-in");
    }
    setTypeAccount(checkTypeAccount());

    const params = {
      per_page: 10,
      page: page + 1,
      school_id: schoolActive?.value || s || getSchoolId() || getUserIdFromSession(),
    };
    fetchListTeacher(params);
  }, [page]);
	
	useEffect (() => {
    const params = {
			per_page: 10,
			page: 1,
			school_id: schoolActive?.value || s || getSchoolId() || getUserIdFromSession(),
		};
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
    if(schoolActive?.isAccept === ACCEPTED) {
      fetchListTeacher(params);
    }

	}, [schoolActive?.isAccept]);

  const addTeacher = () => {
    setMode(MODE_CREATE);
    setShowFormGiaovien(true);
  };

  const editTeacher = (id: number) => {
    setMode(MODE_EDIT);
    router.push(`/chi-tiet-giao-vien/${id}`);
  };

  const onClose = () => {
    setShowFormGiaovien(false);
  };

  const onSubmit = (data: any) => {
    const params = {
      ...data,
      page: page,
      per_page: 10,
      school_id: s || getSchoolId() || getUserIdFromSession()
    };
    fetchListTeacher(params);
  };

  const handleShowPopupDeleteTeacher = (id: number, name: string,roles:any) => {
    setShowPopupDeleteTeacher(true);
    setDataTeacher({ id, name,roles });
  };

  const onSubmitDeleteTeacher = () => {
		setIsDeleting(true);
    const params = {
      per_page: 10,
      page: page + 1,
      school_id: s || getSchoolId() || getUserIdFromSession()
    }
	  const promises = [];
	  if (dataTeacher.roles.includes(TYPE_ACCOUNT_TEACHER)) {
		  promises.push(deleteTeacherInSchoolV2({ id: dataTeacher.id, school_id: schoolActive.id })
			  .then((res: any) => {
				  if (res.code === 200) {
					  toast.success("Xóa giáo viên thành công");
				  } else {
					  toast.error("Đã có lỗi xảy ra");
				  }
			  })
			  .catch((err: any) => {
				  console.log(err);
				  toast.error("Đã có lỗi xảy ra khi xóa giáo viên");
			  })
		  );
	  }
	  
	  if (dataTeacher.roles.includes(TYPE_ACCOUNT_SCHOOL)) {
		  promises.push(deleteUserInSchoolV2({ id: dataTeacher.id, school_id: schoolActive.id })
			  .then((res: any) => {
				  if (res.code === 200) {
					  toast.success("Xóa người dùng thành công");
				  } else {
					  toast.error("Đã có lỗi xảy ra");
				  }
			  })
			  .catch((err: any) => {
				  console.log(err);
				  toast.error("Đã có lỗi xảy ra khi xóa người dùng");
			  })
		  );
	  }

	  Promise.all(promises)
		  .then(() => {
				setIsDeleting(false);
			  setShowPopupDeleteTeacher(false);
			  // fetchTotalTeacherInSchool({school_id: s ?? getSchoolId()})
			  fetchListTeacher(params);
		  })
		  .catch((err: any) => {
				setIsDeleting(false);
			  console.log('Error with one or more API calls', err);
		  });
  };
  
  const exportDataClass = () => {
    const params = {
      school_id: (s || getSchoolId()).toString(),
    };
    const token  = getToken();
    const query = new URLSearchParams(params).toString();
    const url = `${process.env.NEXT_PUBLIC_API_USER_KINDY}export-teacher-by-school-id?token=${token}&${query}`;
    window.location.href = url;
  };
  const isShowButtonAddTeacher = typeAccount === TYPE_ACCOUNT_ADMIN || typeAccount === TYPE_ACCOUNT_SCHOOL
  const [showPopupUserRequestSchool, setShowPopupUserRequestSchool] = useState(false);
  const {
    fetchNotifications,
  } = useNotificationStore((state) => ({
    fetchNotifications: state.fetchNotifications,
  }));


  const handleRequestJoinSchool = () => {
    setShowPopupUserRequestSchool(true);
    
  }

  const handleAcceptOrReject = (status: number , userId: number, role: string) => {
    const params = {
      school_id: getSchoolId(),
      user_id: userId,
      status,
      role,
    };
    acceptRequestJoinSchool(params)
      .then((res) => {
        if (res.meta.code === HTTP_STATUS_CODE_OK) {
          fetchGetListUserJoinSchool();
          fetchNotifications(schoolActive?.value as string)
          toast.success("Cập nhật thành công!");
        } else {
          toast.error("Cập nhật thất bại!");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Đã xảy ra lỗi!");
      })
      .finally(() => {
      });
  };

  return (
    <>
      {!showFormGiaoVien && (
        <section className="section-teacher">
          {/* <div className="fs-2 fw-bolder my-3">Tổng quan</div> */}
          <div className="info-overview row justify-content-start gap-7 ps-4 py-4">
            <Col md={4} className="col-info py-3">
              <div className="d-flex justify-content-center fs-2 fw-bold mb-1">
                Tổng số giáo viên
              </div>
              <div className="d-flex align-items-center justify-content-center gap-7">
                <Image
                  src={`${globalPath.pathImg}/teacher_64x64.png`}
                  width={64}
                  height={64}
                  alt="school"
                />
                <span className="fs-5 fw-bold">{total}</span>
              </div>
            </Col>
          </div>

          <div className="fs-3 fw-bold mt-6 d-flex justify-content-between mb-6">
            <p>Danh sách giáo viên</p>
            <div>
              <Button
                variant="success-v3"
                className="text-white fw-bold me-2"
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
                variant="outline-none"
                className={`fw-bold me-2 button-accept-request ${!showButtonAcceptRequest ? "" : "position-relative"}`}
                onClick={() => handleRequestJoinSchool()}
              >
                <i className="fa fa-check me-2" aria-hidden="true"></i>
                Phê duyệt yêu cầu
              <div className="position-absolute number-request d-flex align-items-center justify-content-center">
                  <span>{listUserRequestJoinSchool.length}</span>
              </div>
              </Button>
              {isShowButtonAddTeacher && (
                <Button
                  variant="danger"
                  className="text-white fw-bold"
                  onClick={() => addTeacher()}
                >
                  <i className="fa fa-plus me-1" aria-hidden="true" />
                  Thêm giáo viên
                </Button>
              )}
            </div>
          </div>

          <Form>
            <div className="filter-list row my-5">
              <Col md={3} className="py-1">
                <Form.Group className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={
                      typeAccount == TYPE_ACCOUNT_SCHOOL
                        ? "Nhập tên giáo viên"
                        : "Nhập tên giáo viên/ SĐT/ email"
                    }
                    {...register("text_search")}
                  />
                </Form.Group>
              </Col>

              <Col md={2} className="mt-1">
                <Button
                  variant="success"
                  className="fw-bold"
                  onClick={handleSubmit(onSubmit)}
                >
                  Tìm kiếm
                </Button>
              </Col>
            </div>
          </Form>

          {listTeacher && !fetchingListTeacher ? (
            <>
              <TableListTeacher
                editTeacher={editTeacher}
                listTeacher={listTeacher}
                typeAccount={typeAccount}
                handleShowPopupDeleteTeacher={handleShowPopupDeleteTeacher}
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
            </>
          ) : (
            <Loading />
          )}
        </section>
      )}

      {showFormGiaoVien && typeAccount === TYPE_ACCOUNT_SCHOOL && (
        <FormGiaoVienAccountSchool
          onClose={() => onClose()}
          setCreateTeacherSuccess={setCreateTeacherSuccess}
          createTeacherSuccess={createTeacherSuccess}
        />
      )}

      {showFormGiaoVien && typeAccount === TYPE_ACCOUNT_ADMIN && (
        <FormGiaoVienAccountAdmin
          mode={mode}
          onClose={() => onClose()}
          setCreateTeacherSuccess={setCreateTeacherSuccess}
        />
      )}

      <PopupDeleteTeacher
        show={showPopupDeleteTeacher}
        handleClose={() => setShowPopupDeleteTeacher(false)}
        dataTeacher={dataTeacher}
        onSubmit={onSubmitDeleteTeacher}
        isDeleting={isDeleting}
      />

      {showPopupUserRequestSchool && (
        <PopupUserRequestSchool
          show={showPopupUserRequestSchool}
          handleClose={() => setShowPopupUserRequestSchool(false)}
          handleAcceptOrReject={handleAcceptOrReject}
          loading={loadingListUserRequestJoinSchool}
          users={listUserRequestJoinSchool}
        />
      )}
    </>
  );
};

export default Tongquan;
