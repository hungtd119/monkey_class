import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  LIST_TYPE_TEACHER,
  MODE_CREATE,
  MODE_EDIT,
  TYPE_TEACHER_MONKEY,
  TYPE_TEACHER_SCHOOL,
} from "src/constant";
import { globalPath } from "src/global";
import useTrans from "src/hooks/useTrans";
import {
  createTeacher,
  getListDistrict,
  getListProvince,
  updateTeacher,
} from "src/services/common";
import { useTeacherStore } from "src/stores/teacherStore";
import * as yup from "yup";
import Select from "react-select";
import Loading from "src/components/Loading";
import { useClassroomStore } from "src/stores/classroomStore";
import { formatedProvinceDistrict, getSchoolId } from "src/selection";

const phoneRegExp = /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;

const FormGiaoVienAccountAdmin = (props: any) => {
  const { mode, onClose, setCreateTeacherSuccess } = props;
  const router = useRouter();
  const { id } = router.query;

  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên giáo viên"),
    gender: yup.string().required("Vui lòng chọn giới tính"),
    email: yup
      .string()
      .required("Vui lòng nhập email")
      .email("Email không hợp lệ"),
    phone: yup
      .string()
      .required("Vui lòng nhập số điện thoại")
      .matches(phoneRegExp, "SĐT không hợp lệ"),
    province_id: yup.number().required("Vui lòng chọn Tỉnh"),
    district_id: yup.number().required("Vui lòng chọn Quận/ Huyện"),
    type: yup.number().required("Vui lòng chọn loại giáo viên"),
    school_ids: yup
      .mixed()
      .transform((value, originalValue) => {
        return Array.isArray(originalValue) && originalValue.length === 0
          ? null
          : value;
      })
      .when(
        "type",
        ([type], schema: any) => {
          return type === TYPE_TEACHER_SCHOOL
            ? schema.required("Vui lòng chọn tên trường")
            : yup.number().optional();
        }
      ),
  });

  const fetchingDetailTeacher = useTeacherStore(
    (state: any) => state.fetchingDetailTeacher
  );
  const fetchDetailTeacher = useTeacherStore(
    (state: any) => state.fetchDetailTeacher
  );
  const detailTeacher = useTeacherStore((state: any) => state.detailTeacher);

  const [valueDefaultTypeTeacher, setValueDefaultTypeTeacher] = useState<any>();
  const [valueDefaultProvince, setValueDefaultProvince] = useState<any>();
  const [valueDefaultDistrict, setValueDefaultDistrict] = useState<any>();
  const [listProvince, setListProvince] = useState<any>();
  const [listDistrict, setListDistrict] = useState<any>();
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
    watch,
    register,
  } = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      gender: "",
      email: "",
      phone: "",
    },
  });

  const trans = useTrans();
  const [disabledForm, setDisableForm] = useState(mode !== MODE_CREATE);

  const fetchAllListSchools = useClassroomStore(
    (state: any) => state.fetchAllListSchools
  );
  const listAllSchool = useClassroomStore((state: any) => state.listAllSchool);
  const [valueDefaultSchoolId, setValueDefaultSchoolId] = useState<any>([]);

  const valueTeacherSelect = watch("type");
  useEffect(() => {
    mode !== MODE_CREATE && fetchDetailTeacher(id);
    fetchAllListSchools();
  }, []);

  useEffect(() => {
    if (detailTeacher && mode !== MODE_CREATE) {
      setValue("name", detailTeacher.name);
      setValue("email", detailTeacher.email);
      setValue("phone", detailTeacher.phone);
      setValue("gender", detailTeacher.gender);
      setValue("type", detailTeacher.type);
      setValue("school_ids", detailTeacher?.schools);
      setValueDefaultTypeTeacher(
        detailTeacher?.type === TYPE_TEACHER_MONKEY
          ? LIST_TYPE_TEACHER[1]
          : LIST_TYPE_TEACHER[0]
      );
      setValueDefaultProvince(detailTeacher.province_details && formatedProvinceDistrict(detailTeacher.province_details))
      setValueDefaultDistrict(detailTeacher.district_details && formatedProvinceDistrict(detailTeacher.district_details))
      setValueDefaultSchoolId(detailTeacher?.schools)
      if (detailTeacher?.schools.length > 0) {
        setValueDefaultSchoolId(
          detailTeacher?.schools.map(
            (value: any) =>
              formatDataSchool &&
              formatDataSchool.find((option: any) => option.value === value)
          )
        );
      }

      setValue("province_id", detailTeacher.province_id);
      setValue("district_id", detailTeacher.district_id);
      getListDistrictFromProvince(detailTeacher.province_id);
    }
  }, [detailTeacher]);


  useEffect(() => {
    getListProvince({ country_code: 84 }).then((res: any) => {
      if (res.status === "success") {
        const convertedListProvince = Object.entries(res.data).map(([value, label]: any) => ({
          value: parseInt(value, 10),
          label,
        }));
        setListProvince(convertedListProvince);
      }
    });
  }, []);

  const getListDistrictFromProvince = (idProvince: number) => {
    const params = {
      parent_id: idProvince,
      country_code: 84,
    };
    getListDistrict(params)
      .then((res) => {
        if (res.status === "success") {
          const convertedListDistrict = Object.entries(res.data).map(
            ([value, label]: any) => ({
              value: parseInt(value, 10),
              label,
            })
          );
          setListDistrict(convertedListDistrict);
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formatDataSchool =
    listAllSchool &&
    listAllSchool?.map((school: any) => ({
      value: school.id,
      label: school.name,
    }));

  const onSubmit = (data: any) => {
    setIsSaving(true);
    const params = {
      ...data,
      user_id: Number(id),
    };
    const paramsCreate = {
      ...data,
      school_ids: valueTeacherSelect === TYPE_TEACHER_MONKEY ? [-1] : [...data.school_ids],
    };

    if (mode === MODE_CREATE) {
      createTeacher(paramsCreate)
        .then((res) => {
          setIsSaving(false);
          if (res.meta.code === 200) {
            toast.success("Thêm giáo viên thành công");
            onClose();
            setCreateTeacherSuccess(true)
          }
        })
        .catch((error) => {
          setIsSaving(false);
          console.log(error);
          toast.error(error.response?.data?.meta?.message);
        });
    } else {
      updateTeacher(params)
        .then((res: any) => {
          setIsSaving(false);
          if (res.data.meta.code === 200) {
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
  };

  const handleBackPage = () => {
    if (router.pathname.includes("chi-tiet-giao-vien")) {
      router.push("/danh-sach-giao-vien");
    } else {
      onClose();
    }
  };

  const isShowButtonEdit = router.pathname.includes("chi-tiet-giao-vien");

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
                      id="male"
                      value={0}
                      {...register("gender")}
                      checked={watch("gender") === 0}
                      onChange={() => setValue("gender", 0)}
                      disabled={disabledForm}
                    />
                  )}
                </div>
              </div>

              {errors?.gender?.message && (
                <p className="mt-2 text-danger">
                  {String(errors?.gender?.message)}
                </p>
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
              <Form.Label htmlFor="province_id">
                Tỉnh <span>*</span>
              </Form.Label>
              <Controller
                render={({ field: { onChange } }: any) => (
                  <Select
                    placeholder="Tỉnh"
                    options={listProvince}
                    value={valueDefaultProvince}
                    isDisabled={disabledForm}
                    onChange={(selectedOption: any) => {
                      onChange(selectedOption ? selectedOption.value : "");
                      getListDistrictFromProvince(selectedOption?.value);
                      setValue("district_id", null);
                      setValueDefaultProvince(selectedOption);
                    }}
                  />
                )}
                name="province_id"
                control={control}
              />

              {errors.province_id?.message && (
                <p className="mt-2 text-danger">
                  {String(errors.province_id?.message)}
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

          <Col md={6} className="my-4">
            <Form.Group className="mb-3 mw-50 fw-bold">
              <Form.Label htmlFor="district_id">
                Quận/ Huyện <span>*</span>
              </Form.Label>
              <Controller
                render={({ field: { onChange } }: any) => (
                  <Select
                    placeholder="Quận/ Huyện"
                    options={listDistrict}
                    isDisabled={disabledForm}
                    value={valueDefaultDistrict}
                    onChange={(selectedOption: any) => {
                      onChange(selectedOption ? selectedOption.value : "");
                      setValueDefaultDistrict(selectedOption);
                    }}
                  />
                )}
                name="district_id"
                control={control}
              />

              {errors.district_id?.message && (
                <p className="mt-2 text-danger">
                  {String(errors.district_id?.message)}
                </p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="my-4">
            <Form.Group className="mb-3 mw-50 fw-bold">
              <Form.Label htmlFor="province_id">
                Loại giáo viên <span>*</span>
              </Form.Label>
              <Controller
                render={({ field: { onChange } }: any) => (
                  <Select
                    placeholder="Loại giáo viên"
                    options={LIST_TYPE_TEACHER}
                    isDisabled={disabledForm}
                    value={valueDefaultTypeTeacher}
                    onChange={(selectedOption: any) => {
                      setValueDefaultTypeTeacher(selectedOption);
                      onChange(selectedOption ? selectedOption.value : "");
                    }}
                  />
                )}
                name="type"
                control={control}
              />

              {errors.type?.message && (
                <p className="mt-2 text-danger">
                  {String(errors.type?.message)}
                </p>
              )}
            </Form.Group>
          </Col>
          {valueTeacherSelect === TYPE_TEACHER_SCHOOL && (
            <Col md={6} className="my-4">
              <Form.Group className="mb-3 mw-50 fw-bold">
                <Form.Label htmlFor="province_id">
                  Tên trường <span>*</span>
                </Form.Label>
                <Controller
                  render={({ field: { onChange, value } }: any) => (
                    <Select
                      key={JSON.stringify(valueDefaultSchoolId)}
                      placeholder="Tên trường"
                      options={formatDataSchool}
                      isDisabled={disabledForm}
                      isMulti
                      defaultValue={valueDefaultSchoolId}
                      onChange={(selectedOption: any) => {
                        onChange(selectedOption ? selectedOption.map((option: any) => option.value) : []);
                      }}
                    />
                  )}
                  name="school_ids"
                  control={control}
                />

                {errors.school_ids?.message && (
                  <p className="mt-2 text-danger">
                    {String(errors.school_ids?.message)}
                  </p>
                )}
              </Form.Group>
            </Col>
	          
          )}
        </div>
      ) : (
        <Loading />
      )}
      <div
        className="d-flex justify-content-end gap-6 mt-6"
        style={{ maxWidth: "97%" }}
      >
        <Button
          variant="danger"
          className="text-white fw-bold"
          onClick={() => handleBackPage()}
        >
          {trans.cancel}
        </Button>
        <Button
          variant="success"
          type="submit"
          className="text-white fw-bold"
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

export default FormGiaoVienAccountAdmin;
