import { yupResolver } from "@hookform/resolvers/yup";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import classNames from "classnames";
import * as yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import useTrans from "src/hooks/useTrans";
import {
  COURSE_ID,
  LEARN_MODELS,
  RangeAge,
  TYPE_ACCOUNT_ADMIN,
  TYPE_ACCOUNT_SCHOOL,
} from "src/constant";
import Image from "next/image";
import { globalPath } from "src/global";
import {
  createClassroom,
  getAllTeacherSchoolAndMK,
  getLevelByCourse,
  getListCourse,
} from "src/services/common";
import { toast } from "react-toastify";
import { useTeacherStore } from "src/stores/teacherStore";
import { getSchoolId, getUserIdFromSession } from "src/selection";
import { useRouter } from "next/router";

interface FormValues {
  classroom_name: string | null;
  age: string | null;
  teacher_ids: [] | null;
  subjects: SubjectType[];
  teacher_common: string | null;
  students: StudentData[];
  courses: Record<string, boolean>;
}

export interface SubjectType {
  level_id: number | null;
  model_id: number | null;
  teacher_id: number | null;
  is_test: number | null;
  course_id: number | null;
}

interface StudentData {
  student_name: string;
  date_of_birth: string;
  gender: string;
  parent_phone: string;
  parent_name: string;
  parent_email: string;
  identifier_code: string;
}

const phoneRegExp = /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;

const FormCreateClassroom = (props: any) => {
  const { onClose, setCreateClassSuccess, typeAccount } = props;

  const trans = useTrans();
  const router = useRouter();
  const { s } = router.query;

  const { control: subjectControl } = useForm({});

  const { control: studentControl } = useForm({});

  const fetchListTeacher = useTeacherStore(
    (state: any) => state.fetchListTeacher
  );

  const fetchListTeacherNotAssigned = useTeacherStore(
    (state: any) => state.fetchListTeacherNotAssigned
  );
  const listTeacher = useTeacherStore((state: any) => state.listTeacher);
  const listTeacherNotAssigned = useTeacherStore(
    (state: any) => state.listTeacherAssigned
  );

  const [listLevel, setListLevel] = useState([]);
  const [listTeacherSchoolAndMK, setListTeacherSchoolAndMK] = useState([]);
  const [checkedCourseKindy, setCheckedCourseKindy] = useState<boolean>(false);
  const [listCourse, setListCourse] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const subjectSchema = yup.object().shape({
    level_id: checkedCourseKindy
      ? yup.number().required("Vui lòng chọn cấp độ")
      : yup.number().nullable().default(null),
    model_id: checkedCourseKindy
      ? yup.number().required("Vui lòng chọn mô hình")
      : yup.number().nullable().default(null),
    teacher_id: checkedCourseKindy
      ? yup.number().required("Vui lòng chọn mô hình")
      : yup.number().nullable().default(null),
  });

  const baseSchema = {
    classroom_name: yup.string().required("Vui lòng nhập tên lớp"),
    age: yup.number().required("Vui lòng chọn độ tuổi"),
    subjects: yup.array().of(subjectSchema),
  };

  const studentSchema = {
    student_name: yup.string().required("Vui lòng nhập tên học sinh"),
    date_of_birth: yup.string().required("Vui lòng nhập ngày sinh"),
    gender: yup.number().required("Vui lòng chọn giới tính"),
    parent_phone: yup
      .string()
      .required("Vui lòng nhập số điện thoại")
      .matches(phoneRegExp, "SĐT không hợp lệ"),
    parent_name: yup.string().required("Vui lòng nhập tên bố/ mẹ"),
    parent_email: yup
      .string()
      .required("Vui lòng nhập email")
      .email("Email không hợp lệ"),
  };

  const {
    fields: subjectFields,
    append: appendSubject,
    remove: removeSubject,
  } = useFieldArray({
    control: subjectControl,
    name: "subjects",
  });

  const {
    fields: studentFields,
    append: appendStudent,
    remove: removeStudent,
  } = useFieldArray({
    control: studentControl,
    name: "students",
  });

  const createStudentArraySchema = (numberOfForms: any) => {
    const studentArraySchema = yup.array().of(
      yup.object().shape({
        ...studentSchema,
      })
    );

    return yup.object().shape({
      ...baseSchema,
      subjects: yup.array().of(subjectSchema),
      students: studentArraySchema.test({
        name: "students",
        message: "Validation error in student array",
        test: (value: any) => value.length === numberOfForms,
      }),
    });
  };

  const validationSchema = createStudentArraySchema(studentFields.length);

  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    register,
    watch,
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      classroom_name: "",
      age: "",
      teacher_ids: [],
      subjects: [
        {
          level_id: null,
          model_id: null,
          teacher_id: null,
          is_test: 0,
          course_id: null,
        },
      ],
      students: [],
      courses: {},
    },
  });
  const userId =
    typeof localStorage !== "undefined" ? localStorage.getItem("userId") : "";

  useEffect(() => {
    fetchListTeacher({
      school_id: s || getSchoolId() || getUserIdFromSession(),
      per_page: 1000,
    });
    fetchListTeacherNotAssigned({
      school_id: s || getSchoolId() || getUserIdFromSession(),
    });
    const params = {
      course_id: COURSE_ID,
    };
    getLevelByCourse(params)
      .then((res) => {
        if (res.meta.code === 200) {
          const levelFormated = res.result.map((unit: any) => ({
            value: unit.id,
            label: unit.name,
          }));
          setListLevel(levelFormated);
        } else {
          setListLevel([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    getAllTeacherSchoolAndMK({
      school_id: s || getSchoolId() || getUserIdFromSession(),
    })
      .then((res) => {
        if (res.meta.code === 200) {
          setListTeacherSchoolAndMK(res.result);
        } else {
          setListTeacherSchoolAndMK([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    getListCourse({ get_all: true })
      .then((res: any) => {
        if (res.meta.code === 200) {
          setListCourse(res.result);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  const formatListTeacher =
    listTeacherNotAssigned &&
    listTeacherNotAssigned.map((teacher: any) => ({
      value: teacher.id,
      label: teacher.name,
    }));

  if (subjectFields.length === 0) {
    appendSubject({
      level_id: null,
      model_id: null,
      teacher_id: null,
      is_test: null,
    });
  }

  const [formVisibility, setFormVisibility] = useState(
    Array(studentFields.length).fill(true)
  );

  const handleAddForm = () => {
    setFormVisibility((prevVisibility: any) => [...prevVisibility, true]);
    appendStudent({
      student_name: "",
      date_of_birth: "",
      gender: "",
      parent_phone: "",
      parent_name: "",
      parent_email: "",
      identifier_code: "",
    });
  };

  const handleDeleteForm = (index: number) => {
    setFormVisibility((prevVisibility) => [
      ...prevVisibility.slice(0, index),
      ...prevVisibility.slice(index + 1),
    ]);

    removeStudent(index);
  };

  const handleToggleFormVisibility = (index: number) => {
    setFormVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  const onSubmit = (data: any) => {
    setIsSaving(true);
    if (data.classroom_name.trim().length == 0) {
      setIsSaving(false);
      return toast.error("Tên lớp học không được để trống");
    }

    const pushSubjectIfNotExists = (courseId: string) => {
      const isExistsIndex = data.subjects.findIndex(
        (subject: any) => Number(subject.course_id) === Number(courseId)
      );

      if (data.courses[courseId] !== false) {
        if (isExistsIndex === -1) {
          const newSubject = {
            level_id: data.age,
            model_id: 3,
            teacher_id: data.teacher_ids[0],
            course_id: courseId,
            is_test: 0,
          };
          data.subjects.push(newSubject);
        }
      } else {
        if (isExistsIndex !== -1 && isExistsIndex !== 0) {
          data.subjects.splice(isExistsIndex, 1);
        }
      }
    };

    for (const courseId in data.courses) {
      pushSubjectIfNotExists(courseId);
    }

    // if (data.subjects.every((subject: any) => subject.level_id == null)) {
    //   return toast.error("Vui lòng chọn ít nhất 1 môn học");
    // }

    const trimStrings = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          obj[key] = obj[key].trim();
        } else if (typeof obj[key] === "object") {
          trimStrings(obj[key]);
        }
      }
    };

    trimStrings(data);

    const converDataForm = {
      ...data,
      subjects: data.subjects.map((subject: any) => ({
        ...subject,
        is_test: subject.is_test ? 1 : 0,
      })),
      school_id: getSchoolId(),
      students: data.students.map((student: any) => ({
        ...student,
        date_of_birth: new Date(student.date_of_birth).getTime() / 1000,
      })),
    };

    createClassroom(converDataForm)
      .then((res: any) => {
        if (res.meta.success) {
          toast.success("Tạo lớp học thành công");
          reset();
          setCreateClassSuccess(true);
          setTimeout(() => {
            setIsSaving(false);
            onClose();
          }, 300);
        } else {
          setIsSaving(false);
          const studentFail = res.result.find((result: any) => !result.status);
          toast.error(`Email ${studentFail?.student.parent_email} đã tồn tại`);
        }
      })
      .catch((error: any) => {
        setIsSaving(false);
        console.log(error);
      });
  };

  return (
    <section className="create-classroom">
      <div className="d-flex align-items-center gap-3 mb-8">
        <i
          className="fa fa-angle-left fs-4 me-3 pointer"
          aria-hidden="true"
          onClick={onClose}
        />
        <p className="fw-bold fs-2">Tạo lớp học</p>
      </div>

      <div className="info-wrapper">
        <div className="header-section d-flex align-items-center justify-content-between px-2 fw-bold">
          <p className="fs-2">
            {trans.info_classroom} <span className="danger">*</span>
          </p>
        </div>

        <div className="info-detail px-2 my-2 row">
          <Form.Group className="mb-3 mw-50 fw-bold">
            <Form.Label htmlFor="classroom_name">
              {trans.classroom_name} <span>*</span>
            </Form.Label>
            <input
              type="text"
              className="form-control"
              placeholder={trans.classroom_name}
              {...register("classroom_name")}
            />

            {errors.classroom_name?.message && (
              <p
                className="mt-2 text-danger fw-medium"
                style={{ fontStyle: "italic" }}
              >
                {trans.validateForm.classroom_name}
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3 mw-50 fw-bold">
            <Form.Label htmlFor="age">
              Độ tuổi <span>*</span>
            </Form.Label>
            <Controller
              name="age"
              rules={{ required: "Vui lòng chọn độ tuổi" }}
              render={({ field: { onChange, value } }: any) => (
                <Select
                  placeholder="Chọn độ tuổi"
                  options={RangeAge}
                  onChange={(selectedOption: any) => {
                    onChange(selectedOption ? selectedOption.value : "");
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

          <Form.Group className="mb-3 mw-50 fw-bold">
            <Form.Label htmlFor="teacher_id">Giáo viên chủ nhiệm</Form.Label>

            <Controller
              name="teacher_ids"
              rules={{ required: true }}
              render={({ field: { onChange, value } }: any) => (
                <Select
                  placeholder={trans.selectHolder["teacher"]}
                  options={formatListTeacher}
                  isMulti
                  onChange={(selectedOption) => {
                    onChange(
                      selectedOption
                        ? selectedOption.map((option) => option.value)
                        : []
                    );
                  }}
                  value={
                    formatListTeacher &&
                    formatListTeacher.filter((option: any) =>
                      value?.includes(option.value)
                    )
                  }
                />
              )}
              control={control}
            />
          </Form.Group>
        </div>
      </div>

      <div className="info-wrapper">
        <div className="header-section d-flex align-items-center justify-content-between px-2 fw-bold">
          <p className="fs-2">{trans.subject}</p>
        </div>

        <div className="info-detail my-2 row fw-bold mx-3">
          {subjectFields.map((subject, index) => {
            return (
              <Fragment key={subject.id}>
                {
                  (typeAccount === TYPE_ACCOUNT_ADMIN) && (<div className="course_name d-flex gap-4 mb-5">
                    <p className="">Monkey Kindy</p>
                    <input
                      value={109}
                      type="checkbox"
                      {...register(`subjects[${index}].course_id` as any)}
                      onChange={(e: any) => {
                        setCheckedCourseKindy(!checkedCourseKindy);
                      }}
                    />
                  </div>)
                }
                {(checkedCourseKindy && (typeAccount === TYPE_ACCOUNT_ADMIN)) && (
                  <>
                    <Col md={3} sm={6} className="mb-5">
                      <Form.Label className="mt-2">
                        {trans.rank} <span>*</span>
                      </Form.Label>
                      <Controller
                        name={`subjects[${index}].level_id` as any}
                        rules={{ required: true }}
                        control={control}
                        render={({ field }: any) => (
                          <Select
                            placeholder={trans.selectHolder["choose_level"]}
                            options={listLevel}
                            onChange={(selectedOption: any) => {
                              setValue(
                                `subjects[${index}].level_id` as any,
                                selectedOption?.value
                              );
                              trigger(`subjects[${index}].level_id` as any);
                            }}
                          />
                        )}
                      />
                      {errors?.subjects?.[index]?.level_id?.message && (
                        <p className="mt-2 text-danger">
                          {trans.validateForm.level}
                        </p>
                      )}
                    </Col>

                      <Col md={3} sm={6} className="mb-5">
                        <Form.Label className="mt-2">
                          {trans.model} <span>*</span>
                        </Form.Label>

                        <Controller
                          name={`subjects[${index}].model_id` as any}
                          // rules={{ required: true }}
                          render={({ field: { onChange, value } }: any) => (
                            <Select
                              placeholder={trans.selectHolder["model"]}
                              options={LEARN_MODELS}
                              onChange={(selectedOption: any) => {
                                setValue(
                                  `subjects[${index}].model_id` as any,
                                  selectedOption?.value
                                );
                                trigger(`subjects[${index}].model_id` as any);
                              }}
                            />
                          )}
                          control={control}
                        />

                        {errors?.subjects?.[index]?.model_id?.message && (
                          <p
                            className="mt-2 text-danger fw-medium"
                            style={{ fontStyle: "italic" }}
                          >
                            {trans.validateForm.model}
                          </p>
                        )}
                      </Col>

                      <Col md={3} sm={6} className="mb-5">
                        <Form.Label className="mt-2">
                          {trans.teacher} <span>*</span>
                        </Form.Label>

                        <Controller
                          name={`subjects[${index}].teacher_id` as any}
                          render={({ field: { onChange, value } }: any) => (
                            <Select
                              placeholder={trans.selectHolder["teacher"]}
                              options={listTeacherSchoolAndMK}
                              onChange={(selectedOption: any) => {
                                setValue(
                                  `subjects[${index}].teacher_id` as any,
                                  selectedOption?.value
                                );
                                trigger(`subjects[${index}].teacher_id` as any);
                              }}
                            />
                          )}
                          control={control}
                        />

                        {errors?.subjects?.[index]?.teacher_id?.message && (
                          <p
                            className="mt-2 text-danger fw-medium"
                            style={{ fontStyle: "italic" }}
                          >
                            {errors?.subjects?.[index]?.teacher_id?.message}
                          </p>
                        )}
                      </Col>
                      <Col md={3} sm={6}>
                        <div className="course_name d-flex mt-8 align-items-center">
                          <p className=""> Đăng ký test</p>
                          <input
                            type="checkbox"
                            {...register(`subjects[${index}].is_test` as any)}
                          />
                        </div>
                      </Col>
                    </>
                  )}
              </Fragment>
            );
          })}

          <div className="row">
            {listCourse.slice(1).map((course: any) => {
              const checkboxName = `courses.${course.id}` as any;

              return (
                <Col md={4} sm={6} key={course.id}>
                  <div className="course_name d-flex mt-4 gap-4">
                    <p>{course.title}</p>
                    <input
                      type="checkbox"
                      value={course.id}
                      {...(register(checkboxName) as any)}
                    />
                  </div>
                </Col>
              );
            })}
          </div>
        </div>
      </div>

      <div className="info-wrapper">
        <div className="header-section fs-2 d-flex align-items-center justify-content-between px-2 fw-bold">
          <p>{trans.list_student}</p>
          {/* <div className="d-flex gap-2">
            <Image
              src={`${globalPath.pathSvg}/upload.svg`}
              width={30}
              height={31}
              alt="upload"
            />
            <div className="d-flex flex-column">
              <span>Tải danh sách lên</span>
              <a href="" className="text-center text-decoration-underline">
                Form mẫu
              </a>
            </div>
          </div> */}
        </div>

        {studentFields.map((field, index) => (
          <>
            <div key={field.id} className="info-detail my-2 fw-bold mx-3">
              <div className="d-flex align-items-center gap-3 mb-3">
                <p>Học sinh {index + 1}</p>
                <i
                  className={classNames("pointer", {
                    "fa fa-eye": formVisibility[index],
                    "fa fa-eye-slash": !formVisibility[index],
                  })}
                  aria-hidden="true"
                  onClick={() => handleToggleFormVisibility(index)}
                />

                <Image
                  src={`${globalPath.pathSvg}/trash.svg`}
                  width={24}
                  height={24}
                  alt="trash"
                  onClick={() => handleDeleteForm(index)}
                />
              </div>
              {formVisibility[index] && (
                <div className="student-wrapper row row-gap-4">
                  <Col lg={6} md={6} sm={12}>
                    <Form.Group as={Row} className="mb-3 fw-bold">
                      <Col lg={4} md={12} sm={12}>
                        <Form.Label htmlFor={`students[${index}].student_name`}>
                          {trans.student_name} <span>*</span>
                        </Form.Label>
                      </Col>
                      <Col lg={8} md={12} sm={12}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={trans.student_name}
                          {...register(
                            `students[${index}].student_name` as any
                          )}
                        />
                        {errors?.students?.[index]?.student_name?.message && (
                          <p
                            className="mt-2 text-danger fw-medium"
                            style={{ fontStyle: "italic" }}
                          >
                            {trans.validateForm.student_name}
                          </p>
                        )}
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg={6} md={6} sm={12}>
                    <Form.Group as={Row} className="mb-3 fw-bold">
                      <Col lg={4} md={12} sm={12}>
                        <Form.Label
                          htmlFor={`students[${index}].date_of_birth`}
                        >
                          {trans.birthday} <span>*</span>
                        </Form.Label>
                      </Col>
                      <Col lg={8} md={12} sm={12}>
                        <input
                          type="date"
                          className="form-control"
                          placeholder={trans.birthday}
                          {...register(
                            `students[${index}].date_of_birth` as any
                          )}
                        />
                        {errors?.students?.[index]?.date_of_birth?.message && (
                          <p
                            className="mt-2 text-danger fw-medium"
                            style={{ fontStyle: "italic" }}
                          >
                            {trans.validateForm.date_of_birth}
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
                              {...register(`students[${index}].gender` as any)}
                            />
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span>Nữ</span>

                            <input
                              type="radio"
                              id={`female-${index}`}
                              value={0}
                              {...register(`students[${index}].gender` as any)}
                            />
                          </div>
                        </div>
                        {errors?.students?.[index]?.gender?.message && (
                          <p
                            className="mt-2 text-danger fw-medium"
                            style={{ fontStyle: "italic" }}
                          >
                            {trans.validateForm.gender}
                          </p>
                        )}
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <Form.Group as={Row} className="mb-3 fw-bold">
                      <Col lg={4} md={12} sm={12}>
                        <Form.Label htmlFor="name_parent">
                          {trans.name_parent} <span>*</span>
                        </Form.Label>
                      </Col>
                      <Col lg={8} md={12} sm={12}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nhập tên phụ huynh"
                          {...register(`students[${index}].parent_name` as any)}
                        />
                        {errors?.students?.[index]?.parent_name?.message && (
                          <p
                            className="mt-2 text-danger fw-medium"
                            style={{ fontStyle: "italic" }}
                          >
                            {trans.validateForm.name_parent}
                          </p>
                        )}
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <Form.Group as={Row} className="mb-3 fw-bold">
                      <Col lg={4} md={12} sm={12}>
                        <Form.Label>
                          {trans.email_parent} <span>*</span>
                        </Form.Label>
                      </Col>
                      <Col lg={8} md={12} sm={12}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nhập email phụ huynh"
                          {...register(
                            `students[${index}].parent_email` as any
                          )}
                        />
                        {errors?.students?.[index]?.parent_email?.message && (
                          <p
                            className="mt-2 text-danger fw-medium"
                            style={{ fontStyle: "italic" }}
                          >
                            {errors?.students?.[index]?.parent_email?.message}
                          </p>
                        )}
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <Form.Group as={Row} className="mb-3 fw-bold">
                      <Col lg={4} md={12} sm={12}>
                        <Form.Label htmlFor={`students[${index}].parent_phone`}>
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
                            `students[${index}].parent_phone` as any
                          )}
                        />
                        {errors?.students?.[index]?.parent_phone?.message && (
                          <p
                            className="mt-2 text-danger fw-medium"
                            style={{ fontStyle: "italic" }}
                          >
                            {errors?.students?.[index]?.parent_phone?.message}
                          </p>
                        )}
                      </Col>
                    </Form.Group>
                  </Col>
                  {/* <Col md={3} sm={6}>
                    <Form.Group className="mb-3 fw-bold">
                      <Form.Label htmlFor="phone_parent">
                        {trans.code_active_account}
                      </Form.Label>
                      <input
                        type="text"
                        className="form-control"
                        {...register(
                          `students[${index}].identifier_code` as any
                        )}
                      />
                    </Form.Group>
                  </Col> */}
                </div>
              )}
            </div>
          </>
        ))}

        <div
          className="d-flex align-items-center gap-1 pointer mb-3 ms-3"
          style={{ color: "#35B1F6" }}
          onClick={handleAddForm}
        >
          <i className="fa fa-plus-square-o" aria-hidden="true" />
          {trans.add_student}
        </div>
      </div>

      <div
        className="d-flex justify-content-end gap-6"
        style={{ maxWidth: "95%" }}
      >
        <Button
          variant="danger"
          className="text-white fw-bold"
          onClick={onClose}
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
          {isSaving ? "Đang tạo lớp học ..." : "Tạo lớp học"}
        </Button>
      </div>
    </section>
  );
};

export default FormCreateClassroom;
