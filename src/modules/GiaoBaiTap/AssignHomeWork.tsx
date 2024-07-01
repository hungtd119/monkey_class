import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { globalPath } from "src/global";
import PopupDanhSachHocSinhTrongLop from "./PopupDanhSachHocSinhTrongLop";
import { toast } from "react-toastify";
import Select from "react-select";
import useDeviceDetect from "src/hooks/useDetectDevice";
import ActivityDescription from "src/components/ActivityDescription";
import { getInfoFromLS, getSchoolId } from "src/selection";
import { useHomeworkStore } from "src/stores/homeworkStore";
import { createAssignHomeworkClassrooms } from "src/services/common";
import ClassroomSection from "./ClassroomSection";

type ClassroomField = {
  id_classroom: number | null;
  class_name: string;
  student_assigned: string | null;
  time_start: number | null;
  time_end: number | null;
};

type AssignHomeWorkFormData = {
  classrooms: ClassroomField[];
  classroom_id: number | null;
};

type ClassroomOption = { value: string; label: string };

const AssignHomeWork = () => {
  const router = useRouter();
  const { isMobile } = useDeviceDetect();
  const { id } = router.query;

  const { control: classroomControl } = useForm({});

  const {
    fields: classroomFields,
    append: appendClassroom,
    remove: removeClassroom,
  }: any = useFieldArray({
    control: classroomControl,
    name: "classrooms",
  });

  const {
    handleSubmit,
    trigger,
    control,
    formState: { errors },
    reset,
    setValue,
    setError,
    clearErrors,
    watch,
    getValues,
  } = useForm<AssignHomeWorkFormData>({
    mode: "onChange",
    defaultValues: {
      classrooms: [
        {
          id_classroom: null,
          time_start: null,
          time_end: null,
        },
      ],
      classroom_id: null,
    },
  });

  const [showPopupDanhSachHocSinh, setShowPopupDanhSachHocSinh] =
    useState(false);
  const [quantityStudentAssigns, setQuantityStudentAssigns] = useState<
    string[]
  >([]);
  const [studentAssigned, setStudentAssigned] = useState<any>([]);
  const [classNames, setClassNames] = useState<string[]>([]);
  const [fieldDates, setFieldDates] = useState<any>([]);
  const [detailClassroom, setDetailClassroom] = useState("");
  const [isShowButtonSubmit, setIsShowButtonSubmit] = useState(false);
  const [isShowButtonAddClass, setIsShowButtonAddClass] = useState(true);
  const [listStudentForPopup, setListStudentForPopup] = useState<any>([]);
  const [selectedClassroomIndex, setSelectedClassroomIndex] =
    useState<number | null>(null);
  const [classroomId, setClassroomId] = useState<any>(null);
  const [classroomIndex, setClassroomIndex] = useState<any>(null);
  const [formatedListClassroom, setFormatedListClassroom] = useState<any>([]);

  const dataActivity = getInfoFromLS("dataActivity");

  const fetchListClassroomAssignHomework = useHomeworkStore(
    (state: any) => state.fetchListClassroomAssignHomework
  );
  const listClassroomAssignHomework = useHomeworkStore(
    (state: any) => state.listClassroomAssignHomework
  );
  const infoLessonNeedAssign = getInfoFromLS("infoLessonNeedAssign");
  const [showButtonSelectClass, setShowButtonSelectClass] = useState(false);

  const handleBackPage = () => {
    router.back();
    removeDataLocalStorage();
  };

  useEffect(() => {
    if (infoLessonNeedAssign) {
      const params = {
        school_id: getSchoolId(),
        course_id: 109 || infoLessonNeedAssign?.courseId,
        level_id: 20 || infoLessonNeedAssign?.levelId,
        activity_id: id,
        unit_id: infoLessonNeedAssign?.unitId ?? "",
        lesson_id: infoLessonNeedAssign?.lessonId ?? "",
      };
      fetchListClassroomAssignHomework(params);
    }
  }, []);

  useEffect(() => {
    if (classroomFields.length === 0) {
      setIsShowButtonSubmit(false);
    } else {
      setIsShowButtonSubmit(true);
    }

    if (classroomFields.length === listClassroomAssignHomework?.length) {
      setIsShowButtonAddClass(false);
    } else {
      setIsShowButtonAddClass(true);
    }
  }, [classroomFields]);

  useEffect(() => {
    listClassroomAssignHomework &&
      setFormatedListClassroom(
        listClassroomAssignHomework.map((item: any) => ({
          value: item.id,
          label: item.name,
        }))
      );
  }, [listClassroomAssignHomework]);

  const handleClosePopupDanhSachHocSinh = () => {
    setShowPopupDanhSachHocSinh(false);
  };

  const handleAssignStudent = (index: number, classId: number) => {
    const classroom = listClassroomAssignHomework.find(
      (item: any) => item.id === classId
    );
    const listStudentForClassroom = classroom?.enrollment_students || [];

    const storageKey = `checkedStudents_${classId}`;
    const storedCheckedStudents = JSON.parse(
      localStorage.getItem(storageKey) || "{}"
    );

    const initialCheckedStudents: Record<number, boolean> = {};
    listStudentForClassroom.forEach((student: any) => {
      initialCheckedStudents[student.id] =
        storedCheckedStudents[student.id] || false;
    });

    localStorage.setItem(storageKey, JSON.stringify(initialCheckedStudents));

    setDetailClassroom(classNames[index]);
    setShowPopupDanhSachHocSinh(true);
    setListStudentForPopup(listStudentForClassroom);
    setSelectedClassroomIndex(index);
    setClassroomId(classId);
    setClassroomIndex(index);
  };

  const onSubmitAssignStudent = (
    checkedStudents: Record<number, boolean> | undefined,
    classroomIndex?: number | null,
    classroomId?: number | null
  ) => {
    if (
      !checkedStudents ||
      classroomIndex === null ||
      classroomIndex === undefined ||
      classroomId === undefined ||
      classroomId === null
    ) {
      return;
    }

    const selectedStudentCount = Object.keys(checkedStudents).filter(
      (studentId: any) => checkedStudents[studentId]
    ).length;

    setQuantityStudentAssigns((prev: any) => {
      const newQuantityStudentAssigns = [...prev];
      newQuantityStudentAssigns[classroomIndex] =
        selectedStudentCount === Object.keys(checkedStudents).length
          ? "Tất cả học sinh"
          : `${selectedStudentCount} học sinh`;
      return newQuantityStudentAssigns;
    });
    setStudentAssigned((prev: any) => {
      const newStudentAssigns = [...prev];
      newStudentAssigns[classroomIndex] = {
        id_classroom: classroomId,
        students: checkedStudents,
      };
      return newStudentAssigns;
    });
    setShowPopupDanhSachHocSinh(false);
  };

  const handleAssignHomeWork = (data: any) => {
    const existingClassroomIds = classroomFields.map(
      (field: any) => field.id_classroom
    );

    const updatedFilteredData = existingClassroomIds
      .map((classroomId: any) => {
        const classroomAssignment = studentAssigned.find(
          (assignment: any) => assignment.id_classroom === classroomId
        );

        if (classroomAssignment) {
          const selectedClassroom = data.classrooms.find(
            (item: any) => item.id_classroom === classroomId
          );

          if (
            selectedClassroom &&
            selectedClassroom.time_end !== undefined &&
            !selectedClassroom.time_start
          ) {
            selectedClassroom.time_end = null;
            return {
              ...selectedClassroom,
              student_assigned: classroomAssignment.students,
              activity_id: id,
            };
          }

          return selectedClassroom
            ? {
                ...selectedClassroom,
                time_start: selectedClassroom.time_start?.getTime() / 1000,
                time_end: selectedClassroom.time_end?.getTime() / 1000,
                student_assigned: classroomAssignment.students,
                activity_id: id,
              }
            : null;
        }

        return null;
      })
      .filter((item: any) => item !== null);

    let hasError = false;

    updatedFilteredData.forEach((item: any, index: number) => {
      if (!item.time_start && !item.time_end) {
        setError(`classrooms[${index}].time_start` as any, {
          type: "manual",
          message: "Vui lòng chọn ngày bắt đầu",
        });
        setError(`classrooms[${index}].time_end` as any, {
          type: "manual",
          message: "Vui lòng chọn ngày hết hạn",
        });
        hasError = true;
      } else if (!item.time_start) {
        setError(`classrooms[${index}].time_start` as any, {
          type: "manual",
          message: "Vui lòng chọn ngày bắt đầu",
        });
        hasError = true;
      } else if (!item.time_end) {
        setError(`classrooms[${index}].time_end` as any, {
          type: "manual",
          message: "Vui lòng chọn ngày hết hạn",
        });
        hasError = true;
      }
    });

    if (!hasError) {
      createAssignHomeworkClassrooms(updatedFilteredData)
        .then((res: any) => {
          if (res.status === "success") {
            toast.success("Giao bài tập thành công!");
            removeDataLocalStorage();
            handleBackPage();
          } else {
            toast.error("Giao bài tập thất bại!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDateStartChange = (date: any, index: number) => {
    setFieldDates((prevFieldDates: any) => {
      const newFieldDates = [...prevFieldDates];
      newFieldDates[index] = {
        startDate: date,
        endDate: prevFieldDates[index]?.endDate,
      };
      return newFieldDates;
    });
    const updatedClassroomFieldsWithDates = classroomFields.map(
      (classroom: any, i: number) => {
        const date = fieldDates[i];

        return {
          ...classroom,
          time_start: date?.startDate || null,
          time_end: date?.endDate || null,
        };
      }
    );

    setValue("classrooms", updatedClassroomFieldsWithDates);
  };

  const handleDateEndChange = (date: any, index: number) => {
    setFieldDates((prevFieldDates: any) => {
      const newFieldDates = [...prevFieldDates];
      newFieldDates[index] = {
        startDate: prevFieldDates[index]?.startDate,
        endDate: date,
      };
      if (!newFieldDates[index]?.startDate) {
        toast.error("Vui lòng chọn ngày bắt đầu trước khi chọn ngày hết hạn");
        return prevFieldDates;
      }
      const updatedClassroomFieldsWithDates = classroomFields.map(
        (classroom: any, i: number) => {
          const date = fieldDates[i];

          return {
            ...classroom,
            time_start: date?.startDate || null,
            time_end: date?.endDate || null,
          };
        }
      );

      setValue("classrooms", updatedClassroomFieldsWithDates);
      return newFieldDates;
    });
  };

  const handleAddClassroom = () => {
    setShowButtonSelectClass(true);
  };

  const handleSelectClassroom = (selectedOption: any) => {
    if (selectedOption) {
      const selectedClassroom = listClassroomAssignHomework.find(
        (item: any) => item.id === selectedOption.value
      );

      if (selectedClassroom) {
        setClassNames((prevClassNames: string[]) => [
          ...prevClassNames,
          selectedClassroom.name,
        ]);
        setFormatedListClassroom((prevOptions: any) =>
          prevOptions.filter(
            (option: any) => option.value !== selectedOption.value
          )
        );
        appendClassroom({
          id_classroom: selectedClassroom.id,
          class_name: selectedClassroom.name,
          time_start: null,
          time_end: null,
        });

        const currentClassrooms = getValues("classrooms");

        setValue("classrooms", [
          ...currentClassrooms,
          {
            id_classroom: selectedClassroom.id,
            class_name: selectedClassroom.name,
            time_start: null,
            time_end: null,
            student_assigned: null,
          },
        ]);

        setQuantityStudentAssigns((prev: string[]) => [
          ...prev,
          "Tất cả học sinh",
        ]);

        const studentTransformed =
          selectedClassroom?.enrollment_students.reduce(
            (acc: Record<string, boolean>, item: any) => {
              acc[item.id.toString()] = true;
              return acc;
            },
            {}
          );
        setStudentAssigned((prev: any) => [
          ...prev,
          {
            id_classroom: selectedClassroom.id,
            students: studentTransformed,
          },
        ]);

        localStorage.setItem(
          `checkedStudents_${selectedClassroom.id}`,
          JSON.stringify(studentTransformed)
        );
        setShowButtonSelectClass(false);
      }
    }
  };

  const handleDeleteAssignClass = (index: number) => {
    const deletedClassroom = classroomFields[index];
    const deletedClassName = classroomFields[index]?.class_name;
    const classroomId = deletedClassroom.id_classroom;

    clearErrors(`classrooms[${index}].time_start` as any);
    clearErrors(`classrooms[${index}].time_end` as any);

    removeClassroom(index);

    setFormatedListClassroom((prevOptions: any) => [
      ...prevOptions,
      { value: classroomId, label: deletedClassName },
    ]);

    setClassNames((prevClassNames: string[]) =>
      prevClassNames.filter(
        (className: string) => className !== deletedClassName
      )
    );

    // Remove the deleted field from fieldDates
    setFieldDates((prevFieldDates: any) => {
      const newFieldDates = [...prevFieldDates];
      newFieldDates.splice(index, 1);
      return newFieldDates;
    });

    // Update time_start and time_end based on updated fieldDates
    const updatedClassroomFieldsWithDates = classroomFields.map(
      (classroom: any, i: number) => {
        const date = fieldDates[i];

        return {
          ...classroom,
          time_start: date?.startDate || null,
          time_end: date?.endDate || null,
        };
      }
    );

    setValue("classrooms", updatedClassroomFieldsWithDates);
    setQuantityStudentAssigns((prevQuantityStudentAssigns: string[]) => {
      const newQuantityStudentAssigns = [...prevQuantityStudentAssigns];
      newQuantityStudentAssigns.splice(index, 1);
      return newQuantityStudentAssigns;
    });

    setStudentAssigned((prevStudentAssigned: any) =>
      prevStudentAssigned.filter((_: any, i: number) => i !== index)
    );

    if (index === selectedClassroomIndex) {
      setSelectedClassroomIndex(null);
    }

    localStorage.removeItem(`checkedStudents_${classroomId}`);
  };

  const removeDataLocalStorage = () => {
    listClassroomAssignHomework?.forEach((classroom: any) => {
      localStorage.removeItem(`checkedStudents_${classroom.id}`);
    });
  };

  return (
    <>
      <section className="giao-bai">
        <div className="d-flex gap-3 mb-8">
          <i
            className="fa fa-angle-left fs-4 me-1 pointer"
            aria-hidden="true"
            onClick={() => handleBackPage()}
          />
          <p className="fw-bold fs-2">Giao bài tập</p>
        </div>

        {dataActivity && (
          <ActivityDescription
            pathThumb={dataActivity?.path_thumb}
            activityTitle={dataActivity?.name}
            activityDescription={dataActivity?.description}
          />
        )}

        {classroomFields.map((data: any, index: number) => (
          <ClassroomSection
            index={index}
            data={data}
            classNames={classNames}
            quantityStudentAssigns={quantityStudentAssigns}
            handleAssignStudent={(index: number, classId: number) => handleAssignStudent(index, classId)}
            handleDateStartChange={(date: any, index: number) => handleDateStartChange(date, index)}
            handleDateEndChange={(date: any, index: number) => handleDateEndChange(date, index)} 
            handleDeleteAssignClass={(index: number) => handleDeleteAssignClass(index)}
            control={control}
            trigger={trigger}
            errors={errors}
            fieldDates={fieldDates}
          />
        ))}

        {isShowButtonAddClass && (
          <div className="d-flex mb-4">
            <div
              className="d-flex align-items-center gap-3"
              onClick={() => handleAddClassroom()}
            >
              <Image
                className=""
                src={`${globalPath.pathSvg}/icon-plus.svg`}
                width={32}
                height={32}
                alt="icon_plus"
              />
              <p className="fw-bold pointer" style={{ color: "#000" }}>
                Thêm lớp học
              </p>
            </div>
          </div>
        )}
        {showButtonSelectClass && (
          <Col md={4} className="mt-3">
            <Controller
              name="classroom_id"
              rules={{ required: true }}
              render={({ field: { onChange, value } }: any) => (
                <Select
                  placeholder="Chọn lớp"
                  options={formatedListClassroom}
                  onChange={(selectedOption: any) => {
                    onChange(selectedOption ? selectedOption.value : "");
                    handleSelectClassroom(selectedOption);
                  }}
                />
              )}
              control={control}
            />
          </Col>
        )}
        {isShowButtonSubmit && (
          <div className="submit-assign d-flex justify-content-end mt-72">
            <form onSubmit={handleSubmit(handleAssignHomeWork)}>
              <Button variant="success" type="submit">
                Giao bài
              </Button>
            </form>
          </div>
        )}
      </section>

      {showPopupDanhSachHocSinh && (
        <PopupDanhSachHocSinhTrongLop
          show={showPopupDanhSachHocSinh}
          handleClose={handleClosePopupDanhSachHocSinh}
          onSubmit={onSubmitAssignStudent}
          classroomName={detailClassroom}
          listStudent={listStudentForPopup}
          classroomId={classroomId}
          classroomIndex={classroomIndex}
        />
      )}
    </>
  );
};

export default AssignHomeWork;
