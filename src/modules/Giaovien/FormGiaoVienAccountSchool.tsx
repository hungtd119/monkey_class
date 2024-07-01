import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loading from "src/components/Loading";
import {
	LIST_ROLE_NAME_FOR_TEACHER,
	MODE_CREATE,
	MODE_EDIT,
	RangeAge,
	TYPE_ACCOUNT_ADMIN,
	TYPE_ACCOUNT_SCHOOL,
	TYPE_ACCOUNT_TEACHER
} from "src/constant";
import { globalPath } from "src/global";
import useTrans from "src/hooks/useTrans";
import { getLocalStorageByKey, getSchoolId, getUserIdFromSession } from "src/selection";
import {
	createAdminSchool,
	createTeacher,
	createTeacherv2,
	getListClassroomBySchoolID,
	getListRoleForTeacher,
	updateTeacher, updateTeacherV2, updateUser
} from "src/services/common";
import { useTeacherStore } from "src/stores/teacherStore";
import * as yup from "yup";
import Select from "react-select";
import { da } from "date-fns/locale";
import listClassroom from "../Lop-hoc/ListClassroom";

const phoneRegExp = /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;

const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên giáo viên"),
  gender: yup.number().required("Vui lòng chọn giới tính"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(phoneRegExp, "SĐT không hợp lệ"),
	role:yup
		.array()
		.required("Vui lòng chọn vai trò"),
});

const FormGiaoVienAccountSchool = (props: any) => {
  const { onClose, setCreateTeacherSuccess,createTeacherSuccess } = props;
  const router = useRouter();
  const { id } = router.query;
  const { s } = router.query;
  const mode =
    typeof window !== "undefined" &&
      window.location.pathname.includes("chi-tiet-giao-vien")
      ? MODE_EDIT
      : MODE_CREATE;
	
	const [listRoles,setListRoles] = useState<any>([])
	const [listClassrooms, setListClassroom] = useState([])
	const [roles, setRoles] = useState<any>([])

  const {
		control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    register,
  } = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      gender: 0,
      email: "",
      phone: "",
	    role:[],
	    classrooms:[]
    },
  });

  const fetchingDetailTeacher = useTeacherStore(
    (state: any) => state.fetchingDetailTeacher
  );
  const fetchDetailTeacher = useTeacherStore(
    (state: any) => state.fetchDetailTeacher
  );
  const detailTeacher = useTeacherStore((state: any) => state.detailTeacher);

  const trans = useTrans();
  const [disabledForm, setDisableForm] = useState(mode !== MODE_CREATE);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (mode !== MODE_CREATE) fetchDetailTeacher({teacher_id:id,school_id:getSchoolId()});
  }, []);

  useEffect(() => {
    if (detailTeacher && mode !== MODE_CREATE) {
      setValue("name", detailTeacher.name);
      setValue("email", detailTeacher.email);
      setValue("phone", detailTeacher.phone);
      setValue("gender", detailTeacher.gender);
	    setValue("role",detailTeacher.role.map((r:any) => r));
	    setValue("classrooms",detailTeacher.classroom_of_teacher?.map((c:any) => c.id));
			setRoles(detailTeacher.role.map((r:any) => r))
    }
  }, [detailTeacher]);

  const onSubmit = (data: any) => {
    setIsSaving(true);
    const params = {
      ...data,
      user_id: Number(id) || Number(getLocalStorageByKey("userId")),
      school_ids: getSchoolId() ? [Number(getSchoolId())] : [getUserIdFromSession()],
	    school_id:Number(getSchoolId())// format ve Array
    };
    if (mode === MODE_CREATE) {
      if (data.role.every((r:any) => r === TYPE_ACCOUNT_SCHOOL)){
				// create user in school
	     createAdminSchool(params).then((res) => {
				 setIsSaving(false);
				 if (res.code === 200) {
					 toast.success("Thêm quản trị viên thành công");
					 setCreateTeacherSuccess(true)
					 onClose();
				 }
				 else{
					 toast.error(res.message);
				 }
	     }).catch((error) => {
				 		     setIsSaving(false);
		              console.log(error);
		     toast.error(error.response?.data?.errors);
	     });
      }
			else{
	      createTeacherv2(params)
		      .then((res) => {
			      setIsSaving(false);
			      if (res.code === 200) {
				      toast.success("Thêm giáo viên thành công");
				      setCreateTeacherSuccess(true)
				      onClose();
			      } else {
				      toast.error(res.message);
			      }
		      })
		      .catch((error) => {
			      setIsSaving(false);
			      console.log(error);
			      toast.error(error.response?.data?.message);
		      });
      }
    } else {
      if (data.role.every((r:any) => r === TYPE_ACCOUNT_SCHOOL)) {
	      updateUser(params)
		      .then((res: any) => {
			      setIsSaving(false);
			      if (res.code === 200) {
				      toast.success("Cập nhật thông tin thành công");
				      router.push("/danh-sach-giao-vien");
			      } else {
				      toast.error("Đã có lỗi xảy ra");
			      }
		      })
		      .catch((error) => {
			      setIsSaving(false);
			      console.log(error);
		      });
      }
			else {
				
	    if (!data.role.some((r:any) => r === TYPE_ACCOUNT_TEACHER)) {
				params.classrooms = [];
	    }
	      updateTeacherV2(params)
		      .then((res: any) => {
			      setIsSaving(false);
			      if (res.code === 200) {
				      toast.success("Cập nhật thông tin thành công");
				      router.push("/danh-sach-giao-vien");
			      } else {
				      toast.error("Đã có lỗi xảy ra");
			      }
		      })
		      .catch((error) => {
			      setIsSaving(false);
			      console.log(error);
		      });
      }
      // }
    }
  };

  const handleBackPage = () => {
    if (router.pathname.includes("chi-tiet-giao-vien")) {
      router.push("/danh-sach-giao-vien");
    } else {
      onClose();
    }
  };

  const isShowButtonEdit = router.pathname.includes("chi-tiet-giao-vien");
	const fetchListRoles = () => {
		getListRoleForTeacher({}).then(res => {
			if (res.code === 200) {
				setListRoles(res?.data.map((role:any) => ({
					label: LIST_ROLE_NAME_FOR_TEACHER[role.id],
					value: role.id,
				})))
			}
		}).catch((err) => {
			console.log(err);
		})
	}
	
	const fetchListClassroomsBySchoolID = () => {
		getListClassroomBySchoolID({school_id:getSchoolId()}).then(res => {
			if (res.code === 200) {
				setListClassroom(res?.data.map((classroom:any) => ({
					label: classroom.name,
					value: classroom.id,
				})))
			}
		}).catch(err => {
			console.log(err);
		})
	}
	
	useEffect (() => {
		fetchListRoles();
		fetchListClassroomsBySchoolID();
	}, []);

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-8">
        <i
          className="fa fa-angle-left fs-4 me-3 pointer"
          aria-hidden="true"
          onClick={() => handleBackPage()}
        />
        <p className="fw-bold fs-2">
          {mode === MODE_CREATE ? "Thêm giáo viên" : detailTeacher?.name}
        </p>
      </div>
      {!fetchingDetailTeacher ? (
        <div className="form-teacher row">
          <div className="d-flex align-items-center justify-content-between">
            <p className="fs-2 fw-bold" style={{ color: "#F80F0F" }}>
              Thông tin giáo viên
            </p>
            {isShowButtonEdit && (
              <Image
                src={`${globalPath.pathSvg}/edit.svg`}
                width={24}
                height={24}
                alt="edit"
                onClick={() => setDisableForm(false)}
              />
            )}
          </div>
          <Col md={6} className="my-4">
            <Form.Group className="mb-3 mw-50 fw-bold">
              <Form.Label htmlFor="name">
                Tên giáo viên <span>*</span>
              </Form.Label>
              <input
                type="text"
                disabled={disabledForm}
                className="form-control"
                placeholder="Tên giáo viên"
                {...register("name")}
              />

              {errors.name?.message && (
                <p className="mt-2 text-danger">Vui lòng nhập tên giáo viên</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} sm={6} className="my-4">
            <Form.Group className="mb-3 fw-bold">
              <Form.Label htmlFor="classroom_name">
                {trans.gender} <span>*</span>
              </Form.Label>
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center gap-1 me-4">
                  <span>Nam</span>

                  {mode === MODE_CREATE ? (
                    <input
                      type="radio"
                      id="male"
                      value={1}
                      {...register("gender")}
                    />
                  ) : (
                    <input
                      type="radio"
                      id="male"
                      value={1}
                      {...register("gender")}
                      checked={watch("gender") === 1}
                      onChange={() => setValue("gender", 1)}
                      disabled={disabledForm}
                    />
                  )}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span>Nữ</span>

                  {mode === MODE_CREATE ? (
                    <input
                      type="radio"
                      id="female"
                      value={0}
                      {...register("gender")}
                    />
                  ) : (
                    <input
                      type="radio"
                      id="female"
                      {...register("gender")}
                      value={0}
                      checked={watch("gender") === 0}
                      onChange={() => setValue("gender", 0)}
                      disabled={disabledForm}
                    />
                  )}
                </div>
              </div>

              {errors?.gender?.message && (
                <p className="mt-2 text-danger">{String(errors?.gender?.message)}</p>
              )}
            </Form.Group>
          </Col>
          <Col md={6} className="my-4">
            <Form.Group className="mb-3 mw-50 fw-bold">
              <Form.Label htmlFor="email">
                Email giáo viên <span>*</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                disabled={disabledForm}
                placeholder="Email giáo viên"
                {...register("email")}
              />

              {errors.email?.message && (
                <p className="mt-2 text-danger">
                  {String(errors.email?.message)}
                </p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="my-4">
            <Form.Group className="mb-3 mw-50 fw-bold">
              <Form.Label htmlFor="phone">
                SĐT giáo viên <span>*</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                disabled={disabledForm}
                placeholder="SĐT giáo viên"
                {...register("phone")}
              />

              {errors.phone?.message && (
                <p className="mt-2 text-danger">
                  {String(errors.phone?.message)}
                </p>
              )}
            </Form.Group>
          </Col>
	        <Col md={6} sm={6} className="my-4">
		        <Form.Group className="mb-3 mw-50 fw-bold">
			        <Form.Label htmlFor="role">
				        Vai trò <span>*</span>
			        </Form.Label>
			        <Controller
				        name="role"
				        rules={{ required: "Vui lòng chọn vai trò" }}
				        render={({ field: { onChange, value } }: any) => (
					        <Select
						        placeholder="Chọn vai trò"
						        options={listRoles}
						        defaultValue={mode === MODE_EDIT && detailTeacher?.role ? detailTeacher?.role.map((role:any) => ({
							        label: LIST_ROLE_NAME_FOR_TEACHER[role],
							        value: role
						        })) : []}
						        isMulti
						        onChange={(selectedOption: any) => {
							        onChange(selectedOption ? selectedOption.map((option: any) => option.value) : []);
							        setRoles(selectedOption ? selectedOption.map((option: any) => option.value) : []);
						        }}
					        />
				        )}
				        control={control}
			        />
			        
			        {errors.role?.message && (
				        <p
					        className="mt-2 text-danger"
					        style={{ fontStyle: "italic" }}
				        >
					        {String(errors.role?.message)}
				        </p>
			        )}
		        </Form.Group>
	        </Col>
	        <Col md={6} sm={6} className="my-4">
		        <Form.Group className="mb-3 mw-50 fw-bold">
			        <Form.Label htmlFor="classrooms">
				        Lớp
			        </Form.Label>
			        <Controller
				        name="classrooms"
				        rules={{ required: "Vui lòng chọn lớp" }}
				        render={({ field: { onChange, value } }: any) => (
					        <Select
						        isDisabled={!roles.includes(TYPE_ACCOUNT_TEACHER)}
						        placeholder="Chọn lớp"
						        options={listClassrooms}
						        isMulti={true}
						        defaultValue={mode === MODE_EDIT && detailTeacher?.classroom_of_teacher ? detailTeacher?.classroom_of_teacher.map((classroom:any) => ({
							        label: classroom.name,
							        value: classroom.id
						        })) : []}
						        onChange={(selectedOption: any) => {
							        onChange(selectedOption ? selectedOption.map((option: any) => option.value) : []);
						        }}
					        />
				        )}
				        control={control}
			        />
			        
			        {errors.age?.message && (
				        <p
					        className="mt-2 text-danger fw-medium"
					        style={{ fontStyle: "italic" }}
				        >
					        {trans.validateForm.range_age}
				        </p>
			        )}
		        </Form.Group>
	        </Col>
        </div>
      ) : (
        <Loading />
      )}
      <div
        className="d-flex justify-content-end gap-6 mt-6"
        style={{ maxWidth: "97%" }}
      >
        <Button variant="danger" className="text-white" onClick={() => handleBackPage()}>
          {trans.cancel}
        </Button>
        <Button
          variant="success"
          type="submit"
          className="text-white"
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
        >
          {
            isSaving ? "Đang lưu..." : trans.save
          }
        </Button>
      </div>
    </>
  );
};

export default FormGiaoVienAccountSchool;
