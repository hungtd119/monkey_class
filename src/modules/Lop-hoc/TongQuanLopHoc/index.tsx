import React, { useEffect, useRef, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { globalPath } from "src/global";
import { ACCEPTED, RangeAge, TYPE_ACCOUNT_PARENTS, TYPE_ACCOUNT_TEACHER } from "src/constant";
import { useRouter } from "next/router";
import {
	deleteClassroom,
	getListClassroomV2,
	getTotalClassroom,
	getTotalStudentV2,
	getTotalTeacherV2
} from "src/services/common";
import { toast } from "react-toastify";
import { checkTypeAccount, getRoleAccount, getSchoolId, getUserIdFromSession } from "src/selection";
import { useSchoolStore } from "src/stores/schoolStore";
import CardCustom from "../CardCustom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPlus } from "@fortawesome/free-solid-svg-icons";
import PopupCreateClassroom from "../PopupCreateClassroom";
import AvatarGroup from "../../../components/AvatarGroup";
import Avatar from "../../../components/Avatar";

const TongQuanLopHoc = () => {
	const router                                                  = useRouter ();
	const {s}                                                     = router.query;
	const [schoolId, setSchoolId]                                 = useState (0);
	const [showCreateClassroom, setShowCreateClassroom]           = useState (false);
	const [showEditClassroom, setShowEditClassroom]               = useState (false);
	const [showPopupDeleteClassroom, setShowPopupDeleteClassroom] = useState (false);
	const [page, setPage]                                         = useState (0);
	const [typeAccount, setTypeAccount]                           = useState (null);
	const [listClassroom, setListClassroom]                       = useState ([]);
	const [fetchingListClassroom, setFetchingListClassroom]       = useState (false);
	const [total, setTotal]                                       = useState (0);
	const [totalClassroom, setTotalClassroom]                     = useState (0);
	const [totalStudent, setTotalStudent]                         = useState (0);
	const [totalTeacher, setTotalTeacher]                         = useState (0);
	const [createClassSuccess, setCreateClassSuccess]             = useState (false);
	const [showPopupCreateClassroom, setShowPopupCreateClassroom] = useState (false);
	const [dataPopupDeleteClass, setDataPopupDeleteClass]         = useState ({name : "", id : 0})
	const isFirstRender                                           = useRef (true);
	
	const roleAccount                     = getRoleAccount ();
	const {schoolActive, setSchoolActive} = useSchoolStore ((state: any) => ( {
		schoolActive    : state.schoolActive,
		setSchoolActive : state.setSchoolActive,
	} ));
	
	const fetchDataClassroom = (params: any) => {
		fetchListClassroom (params);
	};
	
	const fetchDataTotal = (params: any) => {
		fetchTotalClassroom (params);
		fetchTotalTeacher (params);
		fetchTotalStudent (params);
	};
	
	const fetchListClassroom  = async (params: any) => {
		setFetchingListClassroom (true);
		const res = await getListClassroomV2 (params);
		if (res.meta?.code === 200) {
			setFetchingListClassroom (false);
			const listClassroom = res?.result.data
				? res.result?.data
				: [];
			const total         = res?.result?.total || 0;
			
			setListClassroom (listClassroom);
			setTotal (total);
		}
	}
	const fetchTotalClassroom = async (params: any) => {
		const res = await getTotalClassroom (params);
		if (res?.code === 200) {
			const totalClassroom = res?.data
				? res?.data
				: [];
			
			setTotalClassroom (totalClassroom);
		}
	}
	const fetchTotalTeacher   = async (params: any) => {
		const res = await getTotalTeacherV2 (params);
		if (res?.code === 200) {
			const totalTeacher = res?.data
				? res?.data
				: [];
			
			setTotalTeacher (totalTeacher);
		}
	}
	const fetchTotalStudent   = async (params: any) => {
		const res = await getTotalStudentV2 (params);
		if (res?.code === 200) {
			const totalStudent = res?.data
				? res?.data
				: [];
			
			setTotalStudent (totalStudent);
		}
	}
	useEffect (() => {
		setTypeAccount (checkTypeAccount ())
		const initialSchoolId = s || getSchoolId () || getUserIdFromSession ();
		sessionStorage.setItem ("school", JSON.stringify ([{id : initialSchoolId}]) ?? "");
		
	}, [s]);
	
	useEffect (() => {
		const params = {
			school_id : schoolActive?.value || s,
			per_page  : 10,
			page      : page + 1,
		};
		if (schoolActive?.isAccept === ACCEPTED) {
			fetchDataClassroom (params)
			getRoleAccount () !== TYPE_ACCOUNT_TEACHER && getRoleAccount () !== TYPE_ACCOUNT_PARENTS && fetchDataTotal (params);
		}
	}, [schoolActive?.isAccept, schoolActive?.value, page]);
	
	
	useEffect (() => {
		if (schoolId !== 0) {
			setTypeAccount (checkTypeAccount ());
			const params = {
				per_page   : 10,
				page       : page + 1,
				school_id  : schoolId,
				teacher_id : roleAccount === "Teacher" ? getUserIdFromSession () : null
			};
		}
	}, [page]);
	const handleViewDetailClass = (id: number, className: any) => {
		const dataClass = {id, className}
		localStorage.setItem ("className", JSON.stringify (dataClass));
		router.push (`/chi-tiet-lop-hoc/${ id }`);
	};
	
	useEffect (() => {
		if (createClassSuccess) {
			const currentSchoolId = getSchoolId () || getUserIdFromSession ();
			
			const params = {
				per_page   : 10,
				page       : page + 1,
				school_id  : currentSchoolId,
				teacher_id : typeAccount === TYPE_ACCOUNT_TEACHER ? getUserIdFromSession () : null
			};
			fetchDataClassroom (params);
		}
	}, [createClassSuccess]);
	
	const createNewClassroom = () => {
		setShowCreateClassroom (true);
		setCreateClassSuccess (false);
	};
	
	const handleCloseFormCreateClassroom = () => {
		setShowCreateClassroom (false);
	};
	
	const handleShowFormEditClass = (id: number) => {
		router.push (`thong-tin-lop-hoc/${ id }?school_id=${ s }`)
	};
	
	const handleShowPopupDeleteClass = (id: number, name: string) => {
		setShowPopupDeleteClassroom (true);
		setDataPopupDeleteClass ({name, id})
	}
	
	const handleClosePopupDeleteClass = () => {
		setShowPopupDeleteClassroom (false);
	}
	
	const handleClickAddClassroom     = () => {
		setShowPopupCreateClassroom (true);
	}
	const handleClosePopupCreateClass = () => {
		setShowPopupCreateClassroom (false);
	}
	const onSubmitCreateClassroom     = () => {
	
	}
	
	const onSubmitDeleteClassroom = () => {
		const params = {
			per_page   : 10,
			page       : 1,
			school_id  : s || getSchoolId (),
			teacher_id : typeAccount === TYPE_ACCOUNT_TEACHER ? getUserIdFromSession () : null
		};
		deleteClassroom ({id : dataPopupDeleteClass.id}).then ((res: any) => {
			if (res.meta.code === 200) {
				// setListClassroom(prevState => {
				//   return prevState.filter((prev:any) => {
				//     if (prev.id !== dataPopupDeleteClass.id) {
				//       return prev
				//     }
				//   })
				// });
				// setTotalClassroom(prevState => prevState - 1);
				// setTotal(prevState => prevState - 1);
				toast.success ("Xóa lớp học thành công");
				setShowPopupDeleteClassroom (false);
				fetchDataClassroom (params);
				// fetchDataModels();
			} else {
				toast.error ("Đã có lỗi xảy ra")
			}
		}).catch ((err: any) => {
			console.log (err)
		})
	}
	
	return (
		<>
			<CardCustom
				title={ "Lớp học" }
				overview={ [
					{
						src   : `${ globalPath.pathSvg }/stand.svg`,
						title : "Số lớp học",
						value : 24,
					},
					{
						src   : `${ globalPath.pathSvg }/graduation-hat-02.svg`,
						title : "Số giáo viên",
						value : 47,
					},
					{
						src   : `${ globalPath.pathSvg }/backpack.svg`,
						title : "Số học sinh",
						value : 240,
					},
				] }
				actions={ <Button onClick={ handleClickAddClassroom } variant={ "primary-v2" } className={ "text-white" }>
					<FontAwesomeIcon icon={ faPlus } className={ "me-2" }/>
					Thêm lớp học
				</Button> }
				count={ "24 lớp" }
				headerTitle={ "Danh sách lớp học" }
			>
				
				<Table hover responsive>
					<thead>
					<tr>
						<th>Tên lớp</th>
						<th>Số học sinh</th>
						<th>Độ tuổi</th>
						<th colSpan={ 2 }>Giáo viên</th>
					</tr>
					</thead>
					<tbody>
					{ listClassroom?.length > 0 ? (
						listClassroom.map ((classroom: any, index: number) => {
							const ageRange = RangeAge.find (
								(rangeAge) => rangeAge.value === classroom.age
							);
							return (
								<tr key={ index }>
									<td
										className="pointer"
										onClick={ () =>
											handleViewDetailClass (classroom.id, classroom.name)
										}
									>
										{ classroom.name }
									</td>
									<td>{ classroom.total_student ?? 0 }</td>
									<td>{ ageRange ? ageRange.label : "" }</td>
									<td className={ "d-flex" }>
										<AvatarGroup>
											{
												classroom.classroom_has_teacher?.map ((teacherInfo: any) => {
													return <Avatar src={ teacherInfo?.avatar }/>
												})
											}
											<Avatar count={3}/>
										</AvatarGroup>
									</td>
									<td>
										<FontAwesomeIcon icon={ faEllipsisVertical } width={ 32 } height={ 32 }/>
									</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={ 5 }>Không có dữ liệu</td>
						</tr>
					) }
					</tbody>
				</Table>
			
			</CardCustom>
			{/*{!showCreateClassroom && !showEditClassroom && (*/ }
			{/*  <section className="section-school">*/ }
			{/*    {typeAccount !== TYPE_ACCOUNT_TEACHER &&*/ }
			{/*      typeAccount !== TYPE_ACCOUNT_PARENTS && (*/ }
			{/*        <div className="fs-3 fw-bolder my-3">Tổng quan</div>*/ }
			{/*      )}*/ }
			{/*    {typeAccount !== TYPE_ACCOUNT_TEACHER &&*/ }
			{/*      typeAccount !== TYPE_ACCOUNT_PARENTS && (*/ }
			{/*        <div className="info-overview row justify-content-center gap-7">*/ }
			{/*          <Col md={4} className="col-info py-3">*/ }
			{/*            <div className="d-flex justify-content-center fs-2 fw-bold mb-1">*/ }
			{/*              Tổng số lớp học*/ }
			{/*            </div>*/ }
			{/*            <div className="d-flex align-items-center justify-content-center gap-7">*/ }
			{/*              <Image*/ }
			{/*                src={`${globalPath.pathImg}/classes_64x64.png`}*/ }
			{/*                width={64}*/ }
			{/*                height={64}*/ }
			{/*                alt="school"*/ }
			{/*              />*/ }
			{/*              /!*{!fetchingClassroom && (*!/*/ }
			{/*              /!*  <span className="fs-5 fw-bold">*!/*/ }
			{/*              /!*    {totalClassroom}*!/*/ }
			{/*              /!*  </span>*!/*/ }
			{/*              /!*)}*!/*/ }
			{/*                <span className="fs-5 fw-bold">*/ }
			{/*                  {totalClassroom <= 0 ? 0 : totalClassroom}*/ }
			{/*                </span>*/ }
			{/*            </div>*/ }
			{/*          </Col>*/ }
			
			{/*          <Col md={4} className="col-info py-3">*/ }
			{/*            <div className="d-flex justify-content-center fs-2 fw-bold mb-1">*/ }
			{/*              Tổng số giáo viên*/ }
			{/*            </div>*/ }
			{/*            <div className="d-flex align-items-center justify-content-center gap-7">*/ }
			{/*              <Image*/ }
			{/*                src={`${globalPath.pathImg}/teacher_64x64.png`}*/ }
			{/*                width={64}*/ }
			{/*                height={64}*/ }
			{/*                alt="school"*/ }
			{/*              />*/ }
			{/*              /!*{!fetchingClassroom && (*!/*/ }
			{/*              /!*  <span className="fs-5 fw-bold">*!/*/ }
			{/*              /!*    {totalTeacher}*!/*/ }
			{/*              /!*  </span>*!/*/ }
			{/*              /!*)}*!/*/ }
			{/*                <span className="fs-5 fw-bold">*/ }
			{/*                  {totalTeacher <= 0 ? 0 : totalTeacher}*/ }
			{/*                </span>*/ }
			{/*            </div>*/ }
			{/*          </Col>*/ }
			{/*          <Col md={4} className="col-info py-3">*/ }
			{/*            <div className="d-flex justify-content-center fs-2 fw-bold mb-1">*/ }
			{/*              Tổng số học sinh*/ }
			{/*            </div>*/ }
			{/*            <div className="d-flex align-items-center justify-content-center gap-7">*/ }
			{/*              <Image*/ }
			{/*                src={`${globalPath.pathImg}/student_64x64.png`}*/ }
			{/*                width={64}*/ }
			{/*                height={64}*/ }
			{/*                alt="school"*/ }
			{/*              />*/ }
			{/*              /!*{!fetchingClassroom && (*!/*/ }
			{/*              /!*  <span className="fs-5 fw-bold">*!/*/ }
			{/*              /!*    {totalStudent}*!/*/ }
			{/*              /!*  </span>*!/*/ }
			{/*              /!*)}*!/*/ }
			{/*                <span className="fs-5 fw-bold">*/ }
			{/*                  {totalStudent <= 0 ? 0 : totalStudent}*/ }
			{/*                </span>*/ }
			{/*            </div>*/ }
			{/*          </Col>*/ }
			{/*        </div>*/ }
			{/*      )}*/ }
			
			{/*    <div*/ }
			{/*      className={classNames("fs-3 fw-bold mt-6", {*/ }
			{/*        "mb-6": typeAccount !== TYPE_ACCOUNT_ADMIN,*/ }
			{/*      })}*/ }
			{/*    >*/ }
			{/*      Danh sách lớp học*/ }
			{/*    </div>*/ }
			{/*    {(typeAccount === TYPE_ACCOUNT_ADMIN || typeAccount === TYPE_ACCOUNT_SCHOOL) && (*/ }
			{/*      <div className="d-flex justify-content-end mb-6">*/ }
			{/*        <Button*/ }
			{/*          variant="danger"*/ }
			{/*          className="text-white fw-bold"*/ }
			{/*          onClick={() => createNewClassroom()}*/ }
			{/*        >*/ }
			{/*          <i className="fa fa-plus me-1" aria-hidden="true" />*/ }
			{/*          Tạo lớp học*/ }
			{/*        </Button>*/ }
			{/*      </div>*/ }
			{/*    )}*/ }
			
			{/*    {!fetchingListClassroom ? (*/ }
			{/*      <>*/ }
			{/*        <Table bordered hover responsive className="text-center mb-8">*/ }
			{/*          <thead>*/ }
			{/*          <tr>*/ }
			{/*            <th>Tên lớp</th>*/ }
			{/*            <th>Số học sinh</th>*/ }
			{/*            <th>Độ tuổi</th>*/ }
			{/*            <th>Giáo viên chủ nhiệm</th>*/ }
			{/*            <th>Thao tác</th>*/ }
			{/*          </tr>*/ }
			{/*          </thead>*/ }
			{/*          <tbody>*/ }
			{/*          {listClassroom?.length > 0 ? (*/ }
			{/*              (listClassroom || []).map((classroom: any, index: number) => {*/ }
			{/*                const ageRange = RangeAge.find(rangeAge=>rangeAge.value === classroom.age);*/ }
			{/*                const teacherNames = classroom.classroom_has_teacher?.map((teacherInfo: any) => teacherInfo?.name).join('<br />');*/ }
			{/*                return (*/ }
			{/*                    <tr key={index}>*/ }
			{/*                      <td*/ }
			{/*                          className="pointer"*/ }
			{/*                          onClick={() => handleViewDetailClass(classroom.id, classroom.name)}*/ }
			{/*                      >*/ }
			{/*                        {classroom.name}*/ }
			{/*                      </td>*/ }
			{/*                      <td>{classroom.total_student ?? 0}</td>*/ }
			{/*                      <td>{ageRange ? ageRange.label : ""}</td>*/ }
			{/*                      <td dangerouslySetInnerHTML={{ __html: teacherNames }} />*/ }
			{/*                      <td>*/ }
			{/*                        <Image*/ }
			{/*                            className="me-2"*/ }
			{/*                            src={`${globalPath.pathSvg}/info.svg`}*/ }
			{/*                            width={25}*/ }
			{/*                            height={25}*/ }
			{/*                            alt="info"*/ }
			{/*                            onClick={() => handleShowFormEditClass(classroom.id)}*/ }
			{/*                        />*/ }
			{/*                        {typeAccount !== TYPE_ACCOUNT_TEACHER && <Image*/ }
			{/*                            src={`${globalPath.pathSvg}/trash.svg`}*/ }
			{/*                            width={30}*/ }
			{/*                            height={30}*/ }
			{/*                            alt="trash"*/ }
			{/*                            onClick={()=> handleShowPopupDeleteClass(classroom.id,classroom.name)}*/ }
			{/*                        />}*/ }
			{/*                      </td>*/ }
			{/*                    </tr>*/ }
			{/*                );*/ }
			{/*              })*/ }
			{/*          ) : (*/ }
			{/*              <tr>*/ }
			{/*                <td colSpan={5}>Không có dữ liệu</td>*/ }
			{/*              </tr>*/ }
			{/*          )}*/ }
			{/*          </tbody>*/ }
			{/*        </Table>*/ }
			{/*        {total > 10 && (*/ }
			{/*          <ReactPaginate*/ }
			{/*            previousLabel={""}*/ }
			{/*            previousClassName={"icon icon-prev"}*/ }
			{/*            nextLabel={""}*/ }
			{/*            nextClassName={"icon icon-next"}*/ }
			{/*            breakLabel={"..."}*/ }
			{/*            pageCount={Math.ceil(total / 10)}*/ }
			{/*            marginPagesDisplayed={2}*/ }
			{/*            pageRangeDisplayed={3}*/ }
			{/*            onPageChange={(data) => {*/ }
			{/*              setPage(data.selected);*/ }
			{/*            }}*/ }
			{/*            forcePage={page}*/ }
			{/*            containerClassName="pagination"*/ }
			{/*            pageClassName="page-item"*/ }
			{/*            pageLinkClassName="page-link"*/ }
			{/*            activeClassName="active"*/ }
			{/*            previousLinkClassName="page-link page-link--prev"*/ }
			{/*            nextLinkClassName="page-link page-link--next"*/ }
			{/*            hrefAllControls*/ }
			{/*          />*/ }
			{/*        )}*/ }
			{/*      </>*/ }
			{/*    ) : (*/ }
			{/*      <Loading />*/ }
			{/*    )}*/ }
			{/*  </section>*/ }
			{/*)}*/ }
			
			{/*{showCreateClassroom && (*/ }
			{/*  <FormCreateClassV2*/ }
			{/*    onClose={() => handleCloseFormCreateClassroom()}*/ }
			{/*    setCreateClassSuccess={setCreateClassSuccess}*/ }
			{/*    typeAccount={typeAccount}*/ }
			{/*    schoolId={s}*/ }
			{/*  />*/ }
			{/*)}*/ }
			
			<PopupCreateClassroom
				show={ showPopupCreateClassroom }
				handleClose={ handleClosePopupCreateClass }
				onSubmit={ onSubmitCreateClassroom }
			/>
		
		</>
	);
};

export default TongQuanLopHoc;
