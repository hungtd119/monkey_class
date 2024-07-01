import { yupResolver } from "@hookform/resolvers/yup";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import useTrans from "src/hooks/useTrans";
import { COURSE_ID, LEARN_MODELS, RangeAge, TYPE_ACCOUNT_ADMIN, TYPE_ACCOUNT_SCHOOL, TYPE_ACCOUNT_TEACHER, levelDefault } from "src/constant";
import Image from "next/image";
import { globalPath } from "src/global";
import { SubjectType } from "./FormCreateClassroom";
import Loading from "src/components/Loading";
import {
  getAllTeacherSchoolAndMK,
  getListCourse,
  updateDetailClassroom,
} from "src/services/common";
import { toast } from "react-toastify";
import { useTeacherStore } from "src/stores/teacherStore";
import { useRouter } from "next/router";
import { getSchoolId, getUserIdFromSession } from "src/selection";

interface FormValues {
  classroom_name: string | null;
  age: string | null;
  teacher_ids: [] | null;
  subjects: SubjectType[];
  courses: Record<string, boolean>;
}

const FormEditClassroom = (props: any) => {
  const { detailClassroom, fetchingDetailClassroom, onClose, typeAccount,classID } = props;
  const trans = useTrans();
  const router = useRouter();

  const { s } = router.query;
  const { control: subjectControl } = useForm({});
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

  const schema: any = yup.object().shape({
    ...baseSchema,
    subjects: yup.array().of(subjectSchema),
  });

  const {
    fields: subjectFields,
    append: appendSubject,
    remove: removeSubject,
  } = useFieldArray({
    control: subjectControl,
    name: "subjects",
  });

  const classroomData = detailClassroom?.classrooms;

  const defaultValues = {
    classroom_name: detailClassroom?.classrooms?.name || "",
    age: detailClassroom?.classrooms?.age || "",
    subjects: [
      {
        level_id: classroomData?.enrollment?.courses?.[0]?.level_id || null,
        model_id: classroomData?.enrollment?.courses?.[0]?.model_id || null,
        teacher_id: classroomData?.enrollment?.courses?.[0]?.teacher_id || [],
        is_test: classroomData?.enrollment?.courses?.[0]?.is_test || "",
        course_id: null,
        is_deleted: null
      },
    ],
    teacher_ids: classroomData?.teachers || [],
    courses: {},
  };

  const {
    handleSubmit,
    control,
    trigger,
    formState: { errors },
    reset,
    setValue,
    register,
    getValues,
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues,
  });

  if (subjectFields.length === 0) {
    appendSubject({
      level_id: null,
      model_id: null,
      teacher_id: null,
      is_test: null,
      is_deleted: null
    });
  }

  const [disabledFormEditInfoClass, setDisabledFormEditInfoClass] =
    useState(true);
  const [disabledFormEditInfoSubject, setDisabledFormEditInfoSubject] =
    useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const [valueDefaultTeacher, setValueDefaultTeacher] = useState<any>([]);
  const [valueDefaultTeacherInClass, setValueDefaultTeacherInClass] =
    useState<any>();

  const listTeacher = useTeacherStore((state: any) => state.listTeacher);
  const fetchListTeacher = useTeacherStore(
    (state: any) => state.fetchListTeacher
  );
  const [listTeacherSchoolAndMK, setListTeacherSchoolAndMK] = useState([]);
  const isEditKindy = typeAccount === TYPE_ACCOUNT_ADMIN || typeAccount === TYPE_ACCOUNT_SCHOOL;

  useEffect(() => {
    const params = {
      per_page: 100,
      school_id: s || getSchoolId() || getUserIdFromSession(),
      class_id:classID
    };
    fetchListTeacher(params);

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

    getListCourse({get_all: true})
      .then((res: any) => {
        if (res.meta.code === 200) {
          setListCourse(res.result);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);  

  const formatedListTeacher =
    listTeacher &&
    listTeacher.map((teacher: any) => ({
      value: teacher.id,
      label: teacher.name,
    }));

  useEffect(() => {
    if (classroomData) {
      const {
        name,
        age,
        teachers,
        enrollment: { courses },
      } = classroomData;

      const selectedCourse = courses?.find(
        (course: any) => course.course_id === 109
      );

      setValue("classroom_name", name);
      setValue("age", age);
      setValue("teacher_ids", teachers);
      setValue(
        "subjects[0].level_id" as any,
        selectedCourse ? selectedCourse?.level_id : null
      );
      setValue(
        "subjects[0].model_id" as any,
        selectedCourse ? selectedCourse?.model_id : null
      );
      setValue(
        "subjects[0].teacher_id" as any,
        selectedCourse ? selectedCourse?.teacher_id : null
      );
      setValue(
        "subjects[0].is_test" as any,
        selectedCourse ? selectedCourse?.is_test : null
      );

      setIsChecked(selectedCourse?.is_test === 1);
      setCheckedCourseKindy(selectedCourse?.course_id === COURSE_ID);
      const coursesObject = courses.reduce((acc: any, course: any) => {
        acc[`courses.${course.course_id}`] = course.course_id;
        return acc;
      }, {});

      Object.keys(coursesObject).forEach((key: any) => {
        setValue(key, coursesObject[key]);
      });

      if (teachers && teachers.length > 0) {
        setValueDefaultTeacher(
          teachers.map(
            (value: any) =>
              formatedListTeacher &&
              formatedListTeacher.find((option: any) => option.value === value)
          )
        );
      }

      if (listTeacher) {
        setValueDefaultTeacherInClass(
          listTeacherSchoolAndMK.find(
            (teacher: any) => teacher.value === courses?.[0]?.teacher_id
          ) || null
        );
      }
    }
  }, [detailClassroom, listTeacher]);

  const onSubmit = (data: any) => {
    setIsSaving(true);
    if (data.classroom_name.trim().length == 0) {
      setIsSaving(false);
      return toast.error("Tên lớp học không được để trống");
    }
    const pushSubjectIfNotExists = (courseId: any) => {
      const isExistsIndex = data.subjects.findIndex(
        (subject: any) => Number(subject.course_id) === Number(courseId)
      );

      const courseValue = data.courses[courseId];

      if (
        courseValue !== undefined &&
        courseValue !== null &&
        courseValue !== false
      ) {
        if (isExistsIndex === -1) {
          const newSubject = {
            level_id: courseValue === COURSE_ID ? data.subjects[0]?.level_id : data.age,
            model_id: courseValue === COURSE_ID ? data.subjects[0]?.model_id : 3,
            teacher_id: courseValue === COURSE_ID ? data.subjects[0]?.teacher_id : data.teacher_ids[0],
            course_id: courseId,
            is_deleted: null,
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

    let modifiedSubjects = data.subjects;

    if (!checkedCourseKindy) {
      modifiedSubjects = modifiedSubjects.filter(
        (subject: any) => subject.course_id !== "109" && subject.course_id !== false
      );
    }    

    const convertedData = {
      ...data,
      classroom_id: classroomData?.id,
      subjects: modifiedSubjects.map((subject: any) => ({
        ...subject,
        is_deleted: null,
        is_test:
          typeof subject.is_test === "boolean"
            ? subject.is_test
              ? 1
              : 0
            : subject.is_test,
      })),
    };    

    // if (
    //   convertedData.subjects.every((subject: any) => subject.level_id == null)
    // ) {
    //   return toast.error("Vui lòng chọn ít nhất 1 môn học");
    // }
    convertedData.subjects = modifiedSubjects.filter(
      (subject: any) => subject.course_id !== null
    );

    updateDetailClassroom(convertedData)
      .then((res: any) => {
        if(res.meta.code === 200) {
          toast.success("Cập nhật thành công");
          setTimeout(() =>{
            setIsSaving(false);
            onClose();
          }, 300)
        }
      })
      .catch((error) => {
        setIsSaving(false);
        console.log(error)
      });
  };

  const handleEditFormInfoClass = () => {
    if (typeAccount === TYPE_ACCOUNT_ADMIN || typeAccount === TYPE_ACCOUNT_SCHOOL){
      setDisabledFormEditInfoClass(false);
    } else {
      return toast.error("Bạn không có quyền!")
    }
  };

  const handleEditFormInfoSubject = () => {
    if (typeAccount === TYPE_ACCOUNT_ADMIN || typeAccount === TYPE_ACCOUNT_SCHOOL) {
      setDisabledFormEditInfoSubject(false);
    } else {
      return toast.error("Bạn không có quyền!")
    }
  };

  const handleCheckboxChange = (index: number) => {
    const newIsTestValue = !isChecked;
    setIsChecked(newIsTestValue);
    setValue(
      `subjects[${index}].is_test` as any,
      newIsTestValue == true ? 1 : 0
    );
  };

  return (
    <>
      {!fetchingDetailClassroom ? (
        <section className="create-classroom">
          <div className="d-flex align-items-center gap-3 mb-8">
            <i
              className="fa fa-angle-left fs-4 me-3 pointer"
              aria-hidden="true"
              onClick={() =>  router.back()}
            />
            <p className="fw-bold fs-2">{detailClassroom?.classrooms?.name}</p>
          </div>

          <div className="info-wrapper">
            <div className="header-section d-flex align-items-center justify-content-between px-2 fw-bold">
              <p>
                {trans.info_classroom} <span className="danger">*</span>
              </p>
              <Image
                src={`${globalPath.pathSvg}/edit.svg`}
                width={24}
                height={24}
                alt="edit"
                onClick={() => handleEditFormInfoClass()}
              />
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
                  disabled={disabledFormEditInfoClass}
                />

                {errors.classroom_name?.message && (
                  <p className="mt-2 text-danger">
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
                  rules={{ required: true }}
                  render={({ field: { onChange } }: any) => (
                    <Select
                      placeholder="Chọn độ tuổi"
                      isDisabled={disabledFormEditInfoClass}
                      options={RangeAge}
                      defaultValue={
                        detailClassroom?.classrooms?.age
                          ? {
                              value: detailClassroom?.classrooms?.age,
                              label: `${
                                RangeAge.find(rangeAge => rangeAge.value === detailClassroom?.classrooms?.age)
                                  ?.label
                              }`,
                            }
                          : null
                      }
                      onChange={(selectedOption: any) => {
                        onChange(selectedOption ? selectedOption.value : "");
                      }}
                    />
                  )}
                  control={control}
                />

                {errors.age?.message && (
                  <p className="mt-2 text-danger">
                    {trans.validateForm.range_age}
                  </p>
                )}
              </Form.Group>

              <Form.Group className="mb-3 mw-50 fw-bold">
                <Form.Label htmlFor="teacher_common">
                  Giáo viên chủ nhiệm
                </Form.Label>
                <Controller
                  name="teacher_ids"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }: any) => (
                    <Select
                      key={JSON.stringify(valueDefaultTeacher)}
                      placeholder={trans.selectHolder["teacher"]}
                      options={formatedListTeacher}
                      isDisabled={disabledFormEditInfoClass}
                      isMulti
                      defaultValue={valueDefaultTeacher}
                      onChange={(selectedOptions: any) => {
                        const selectedValues = selectedOptions
                          ? (selectedOptions || []).map(
                              (option: any) => option.value
                            )
                          : [];
                        onChange(selectedValues);
                      }}
                    />
                  )}
                  control={control}
                />
              </Form.Group>
            </div>
          </div>

          <div className="info-wrapper">
            <div className="header-section d-flex align-items-center justify-content-between px-2 fw-bold">
              <p>
                {trans.subject} <span className="danger">*</span>
              </p>
              <Image
                src={`${globalPath.pathSvg}/edit.svg`}
                width={24}
                height={24}
                alt="edit"
                onClick={() => handleEditFormInfoSubject()}
              />
            </div>

            <div className="info-detail my-2 row fw-bold mx-3">
              {subjectFields.map((subject: any, index) => {
                return (
                  <Fragment key={subject.id}>
                    {
                      (typeAccount === TYPE_ACCOUNT_ADMIN) && (<div className="course_name d-flex gap-4">
                          <p className="">Monkey Kindy</p>
                          <input
                              value={109}
                              checked={checkedCourseKindy}
                              type="checkbox"
                              disabled={disabledFormEditInfoSubject || !isEditKindy}
                              {...register(`subjects[${index}].course_id` as any)}
                              onChange={(e: any) => {
                                setCheckedCourseKindy(e.target.checked);
                                if (!e.target.checked) {
                                  setValue(`subjects[${index}].course_id` as any, null);
                                  setValue(`subjects[${index}].level_id` as any, null);
                                }
                              }}
                          />
                        </div>)
                    }
                    {(checkedCourseKindy && typeAccount === TYPE_ACCOUNT_ADMIN) && (
                        <>
                          <Col md={3} sm={6} className="mb-3">
                            <Form.Label className="mt-2">
                              {trans.rank} <span>*</span>
                            </Form.Label>
                            <Controller
                                name={`subjects[${index}].level_id` as any}
                                rules={{required: true}}
                                control={subjectControl}
                                render={({field}: any) => (
                                    <Select
                                        placeholder={trans.selectHolder["choose_level"]}
                                        options={levelDefault}
                                        defaultValue={
                                          detailClassroom?.classrooms?.enrollment
                                    ?.courses?.[0]?.level_id
                                    ? {
                                        value:
                                          detailClassroom?.classrooms
                                            ?.enrollment?.courses?.[0]
                                            ?.level_id,
                                        label:
                                          levelDefault.find(
                                            (level: any) =>
                                              level.id ===
                                              detailClassroom?.classrooms
                                                ?.enrollment?.courses?.[0]
                                                ?.level_id
                                          )?.label || "",
                                      }
                                    : null
                                }
                                isDisabled={disabledFormEditInfoSubject || !isEditKindy}
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
                              {errors?.subjects?.[index]?.level_id?.message}
                            </p>
                          )}
                        </Col>

                        <Col md={3} sm={6} className="mb-3">
                          <Form.Label className="mt-2">
                            {trans.model} <span>*</span>
                          </Form.Label>

                          <Controller
                            name={`subjects[${index}].model_id` as any}
                            control={subjectControl}
                            render={({ field: { onChange, value } }: any) => (
                              <Select
                                placeholder={trans.selectHolder["model"]}
                                options={LEARN_MODELS}
                                defaultValue={
                                  detailClassroom?.classrooms?.enrollment
                                    ?.courses?.[0]?.model_id
                                    ? {
                                        value:
                                          detailClassroom?.classrooms
                                            ?.enrollment?.courses?.[0]
                                            ?.model_id,
                                        label:
                                          LEARN_MODELS.find(
                                            (level: any) =>
                                              level.id ===
                                              detailClassroom?.classrooms
                                                ?.enrollment?.courses?.[0]
                                                ?.model_id
                                          )?.label || "",
                                      }
                                    : null
                                }
                                isDisabled={disabledFormEditInfoSubject || !isEditKindy}
                                onChange={(selectedOption: any) => {
                                  setValue(
                                    `subjects[${index}].model_id` as any,
                                    selectedOption?.value
                                  );
                                  trigger(`subjects[${index}].model_id` as any);
                                }}
                              />
                            )}
                          />

                          {errors?.subjects?.[index]?.model_id?.message && (
                            <p className="mt-2 text-danger">
                              {trans.validateForm.model}
                            </p>
                          )}
                        </Col>

                        <Col md={3} sm={6} className="mb-3">
                          <Form.Label className="mt-2">
                            {trans.teacher} <span>*</span>
                          </Form.Label>

                          <Controller
                            name={`subjects[${index}].teacher_id` as any}
                            render={({ field: { onChange, value } }: any) => (
                              <Select
                                placeholder={trans.selectHolder["teacher"]}
                                isDisabled={disabledFormEditInfoSubject || !isEditKindy}
                                options={listTeacherSchoolAndMK}
                                value={valueDefaultTeacherInClass}
                                onChange={(selectedOption: any) => {
                                  setValue(
                                    `subjects[${index}].teacher_id` as any,
                                    selectedOption?.value
                                  );
                                  trigger(
                                    `subjects[${index}].teacher_id` as any
                                  );
                                  setValueDefaultTeacherInClass(selectedOption);
                                }}
                              />
                            )}
                            control={control}
                          />

                          {errors?.subjects?.[index]?.teacher_id?.message && (
                            <p className="mt-2 text-danger">
                              {trans.validateForm.teacher}
                            </p>
                          )}
                        </Col>

                        <Col md={3} sm={6}>
                          <div className="course_name d-flex mt-8">
                            <p className=""> Đăng ký test</p>
                            <input
                              type="checkbox"
                              value={1}
                              disabled={disabledFormEditInfoSubject || !isEditKindy}
                              onChange={(e: any) => {
                                handleCheckboxChange(index);
                                register(`subjects[${index}].is_test` as any);
                              }}
                              checked={isChecked}
                              // {...register(`subjects[${index}].is_test` as any)}
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
                          disabled={disabledFormEditInfoSubject}
                          onChange={(e: any) => {
                            const isChecked = e.target.checked;
                            setValue(checkboxName, isChecked);
                          }}
                          {...(register(checkboxName) as any)}
                        />
                      </div>
                    </Col>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="d-flex justify-content-end gap-6"
            style={{ maxWidth: "95%" }}
          >
            <Button
              variant="success"
              type="submit"
              className="text-white fw-bold"
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              {
                isSaving ? "Đang lưu ..." : "Cập nhật thông tin"
              }
            </Button>
          </div>
        </section>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default FormEditClassroom;
