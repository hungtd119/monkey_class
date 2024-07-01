
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import classNames from "classnames";
import Image from "next/image";
import { globalPath } from "src/global";
import { Button, Col, Form, Row } from "react-bootstrap";
import useTrans from "src/hooks/useTrans";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { getSchoolId } from "src/selection";
import { addMultipleStudents, addMultipleStudentsV2 } from "src/services/common";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

const phoneRegExp = /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;

const schema = yup.object().shape({
  student: yup.array().of(
    yup.object().shape({
      student_name: yup.string().required("Vui lòng nhập tên học sinh"),
      date_of_birth: yup
        .date()
        .nullable()
        .required("Vui lòng chọn ngày sinh"),
      gender: yup.number().required("Vui lòng chọn giới tính"),
      parent_phone: yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ"),
      parent_name: yup.string().required("Vui lòng nhập tên phụ huynh"),
    })
  )
});
interface StudentData {
  student_name: string;
  date_of_birth: string;
  gender: number;
  parent_phone: string;
  parent_name: string;
  parent_email: string;
  identifier_code: string;
}
interface FormValues {
  students: StudentData[];
  classId: number;
}

const AddMultipleStudentForm = () => {
  const trans = useTrans();
  const router = useRouter();
  const { class_id } = router.query;
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      student: [
        {
          student_name: "",
          date_of_birth: null,
          gender: 0,
          parent_phone: "",
          parent_name: "",
          parent_email: "",
          identifier_code: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "student",
  });
  const [formVisibility, setFormVisibility] = useState(
    Array(fields.length).fill(true)
  );

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    const students = data.student.map((item: any) => ({
      ...item,
      date_of_birth: new Date(item.date_of_birth).getTime() / 1000,
      class_id: Number(class_id),
    }));
    const convertData = {
      students,
      school_id: Number(getSchoolId()),
    };
    addMultipleStudentsV2(convertData)
      .then((res) => {
        setIsSaving(false);
        if (res.code === 200) {
          toast.success("Tạo học sinh thành công");
          reset();
          router.push(`/chi-tiet-lop-hoc/${class_id}`);
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        setIsSaving(false);
        toast.error(error.response.data.message);
      });
  };
  const handleToggleFormVisibility = (index: number) => {
    setFormVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <i
          className="fa fa-angle-left fs-4 me-3 pointer"
          aria-hidden="true"
          onClick={() => router.back()}
        />
        <p className="fw-bold fs-2">Thêm học sinh</p>
      </div>
      <div
        style={{ backgroundColor: "#D9F7F9" }}
        className="px-1 pt-6 pb-1 mx-7"
      >
        <div className="h5 fw-bold pb-2 px-2">Danh sách học sinh</div>

        <div style={{ backgroundColor: "#FFFFFF" }} className="p-4">
            {fields.map((item, index) => {
              return (
                <div key={item.id}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="d-flex align-items-baseline px-2 py-1"
                      style={{
                        border: "2px solid #D9D9D9",
                        backgroundColor: "#F5F5F5",
                      }}
                    >
                      <p className="me-2 fw-bold">Học sinh {index + 1}</p>
                      <i
                        className={classNames("pointer fa fa-eye", {
                          "fa fa-eye": formVisibility[index],
                          "fa fa-eye-slash": !formVisibility[index],
                        })}
                        aria-hidden="true"
                        onClick={() => handleToggleFormVisibility(index)}
                      />
                    </div>

                    <Image
                      src={`${globalPath.pathSvg}/trash.svg`}
                      width={24}
                      height={24}
                      alt="trash"
                      onClick={() => {
                        setFormVisibility((prevVisibility) => [
                          ...prevVisibility.slice(0, index),
                          ...prevVisibility.slice(index + 1),
                        ]);
                        remove(index);
                      }}
                    />
                  </div>
                  {formVisibility[index] && (
                    <div className="student-wrapper row row-gap-4 ">
                      <Col lg={6} md={6} sm={12}>
                        <Form.Group as={Row} className="mb-3 fw-bold">
                          <Col lg={4} md={12} sm={12}>
                            <Form.Label
                              htmlFor={`student.${index}.student_name`}
                            >
                              {trans.student_name} <span>*</span>
                            </Form.Label>
                          </Col>
                          <Col lg={8} md={12} sm={12}>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={trans.student_name}
                              {...register(
                                `student.${index}.student_name` as any,
                                {
                                  required: "Vui lòng nhập tên học sinh",
                                }
                              )}
                            />
                            {errors?.student?.[index]?.student_name
                              ?.message && (
                              <p
                                className="mt-2 text-danger fw-medium"
                                style={{ fontStyle: "italic" }}
                              >
                                {errors.student[index]?.student_name?.message}
                              </p>
                            )}
                          </Col>
                        </Form.Group>
                      </Col>

                      <Col lg={6} md={6} sm={12}>
                        <Form.Group as={Row} className="mb-3 fw-bold">
                          <Col lg={4} md={12} sm={12}>
                            <Form.Label
                              htmlFor={`student.${index}.date_of_birth`}
                            >
                              {trans.birthday} <span>*</span>
                            </Form.Label>
                          </Col>
                          <Col lg={8} md={12} sm={12}>
                            <Controller
                                  control={control}
                                  name={`student.${index}.date_of_birth` as any}
                                  render={({ field }: any) => (
                                    <DatePicker
                                      {...field}
                                      selected={field.value}
                                      onChange={(date: any) => field.onChange(date)}
                                      dateFormat="dd/MM/yyyy"
                                      placeholderText="dd/mm/yyyy"
                                      className="form-control"
                                    />
                                  )}
                                />
                            {errors?.student?.[index]?.date_of_birth?.message && (
                              <p className="mt-2 text-danger fw-medium" style={{fontStyle:"italic"}}>
                                {errors.student[index]?.date_of_birth?.message}
                              </p>
                            )}
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col lg={12} md={12} sm={12}>
                        <Form.Group as={Row} className="mb-3 fw-bold">
                          <Col lg={2}>
                            <Form.Label htmlFor="classroom_name">
                              {trans.gender} <span>*</span>
                            </Form.Label>
                          </Col>
                          <Col lg={10}>
                            <div className="d-flex align-items-center">
                              <div className="d-flex align-items-center gap-1 me-4">
                                <span>Nam</span>

                                <input
                                  type="radio"
                                  id={`male-${index}`}
                                  value={1}
                                  {...register(
                                    `student.${index}.gender` as any,
                                  )}
                                />
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <span>Nữ</span>

                                <input
                                  type="radio"
                                  id={`female-${index}`}
                                  value={0}
                                  {...register(
                                    `student.${index}.gender` as any
                                  )}
                                />
                              </div>
                            </div>
                            {errors?.student?.[index]?.gender?.message && (
                              <p
                                className="mt-2 text-danger fw-medium"
                                style={{ fontStyle: "italic" }}
                              >
                                {errors.student[index]?.gender?.message}
                              </p>
                            )}
                          </Col>
                        </Form.Group>
                      </Col>

                      <Col lg={6} md={12} sm={12}>
                        <Form.Group as={Row} className="mb-3 fw-bold">
                          <Col lg={4} md={12} sm={12}>
                            <Form.Label htmlFor="phone_parent">
                              {trans.name_parent} <span>*</span>
                            </Form.Label>
                          </Col>
                          <Col lg={8} md={12} sm={12}>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nhập tên phụ huynh"
                              {...register(
                                `student.${index}.parent_name` as any,
                              )}
                            />
                            {errors?.student?.[index]?.parent_name?.message && (
                              <p
                                className="mt-2 text-danger fw-medium"
                                style={{ fontStyle: "italic" }}
                              >
                                {errors.student[index]?.parent_name?.message}
                              </p>
                            )}
                          </Col>
                        </Form.Group>
                      </Col>
                      {/* email */}
                      <Col lg={6} md={12} sm={12}>
                        <Form.Group as={Row} className="mb-3 fw-bold">
                          <Col lg={4} md={12} sm={12}>
                            <Form.Label>{trans.email_parent}</Form.Label>
                          </Col>
                          <Col lg={8} md={12} sm={12}>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nhập email phụ huynh"
                              {...register(
                                `student.${index}.parent_email` as any,
                                {
                                  pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Email không hợp lệ",
                                  },
                                }
                              )}
                            />
                            {errors?.student?.[index]?.parent_email
                              ?.message && (
                              <p
                                className="mt-2 text-danger fw-medium"
                                style={{ fontStyle: "italic" }}
                              >
                                {
                                  errors?.student?.[index]?.parent_email
                                    ?.message
                                }
                              </p>
                            )}
                          </Col>
                        </Form.Group>
                      </Col>

                      <Col lg={6} md={12} sm={12}>
                        <Form.Group as={Row} className="mb-3 fw-bold">
                          <Col lg={4} md={12} sm={12}>
                            <Form.Label
                              htmlFor={`student.${index}.parent_phone`}
                            >
                              {trans.phone_parent} <span>*</span>
                            </Form.Label>
                          </Col>
                          <Col lg={8} md={12} sm={12}>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nhập số điện thoại phụ huynh"
                              pattern="\d*"
                              {...register(
                                `student.${index}.parent_phone` as any,
                              )}
                            />
                            {errors?.student?.[index]?.parent_phone
                              ?.message && (
                              <p
                                className="mt-2 text-danger fw-medium"
                                style={{ fontStyle: "italic" }}
                              >
                                {
                                  errors?.student?.[index]?.parent_phone
                                    ?.message
                                }
                              </p>
                            )}
                          </Col>
                        </Form.Group>
                      </Col>

                      {/* <Col lg={6} md={12} sm={12}>
                        <Form.Group as={Row} className="mb-3 fw-bold">
                          <Col lg={4} md={12} sm={12}>
                            <Form.Label htmlFor="phone_parent">
                              {trans.code_active_account}
                            </Form.Label>
                          </Col>
                          <Col lg={8} md={12} sm={12}>
                            <input
                              type="text"
                              className="form-control"
                              {...register(
                                `student.${index}.identifier_code` as any
                              )}
                            />
                          </Col>
                        </Form.Group>
                      </Col> */}
                    </div>
                  )}
                </div>
              );
            })}
            <div
              className="d-flex align-items-end gap-1 pointer mb-3 mt-4"
              style={{ color: "#35B1F6" }}
              onClick={() => {
                setFormVisibility((prevVisibility: any) => [
                  ...prevVisibility,
                  true,
                ]);
                append({
                  student_name: "",
                  date_of_birth: null,
                  gender: 0,
                  parent_phone: "",
                  parent_name: "",
                  parent_email: "",
                  identifier_code: "",
                });
              }}
            >
              <FontAwesomeIcon icon={faPlusSquare} size="lg" />
              <div className="h6 m-0 fw-bold">{trans.add_student}</div>
            </div>

        </div>
      </div>
	    
      <div className="my-4 d-flex justify-content-end" style={{marginRight:"32px"}}>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="success-v2"
          className="text-white fw-bold  py-2 px-6 rounded-3 me-2"
          disabled={isSaving}
        >
          {isSaving ? "Đang lưu..." : "Xác nhận"}
        </Button>
        <Button
          variant="danger-v2"
          className="py-2 px-6 rounded-3 fw-bold "
          style={{ color: "white"}}
          onClick={() => router.back()}
        >
          Hủy
        </Button>
      </div>
    </>
  );
};

export default AddMultipleStudentForm;
