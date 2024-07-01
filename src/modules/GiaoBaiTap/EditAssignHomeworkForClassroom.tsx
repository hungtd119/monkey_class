import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import * as yup from "yup";
import { globalPath } from "src/global";
import PopupDanhSachHocSinhTrongLop from "./PopupDanhSachHocSinhTrongLop";
import { toast } from "react-toastify";
import useDeviceDetect from "src/hooks/useDetectDevice";
import ActivityDescription from "src/components/ActivityDescription";
import { useHomeworkStore } from "src/stores/homeworkStore";
import Loading from "src/components/Loading";
import { createAssignHomeworkClassrooms, editHomework } from "src/services/common";
import { getInfoFromLS } from "src/selection";
import { useStudentStore } from "src/stores/studentStore";

const schema: any = yup
  .object()
  .shape({
    time_start: yup.string().required("Vui lòng chọn ngày bắt đầu"),
    time_end: yup.string().required("Vui lòng chọn ngày hết hạn"),
  })
  .required();

const EditAssignHomeworkForClassroom = () => {
  const router = useRouter();
  const {id} = router.query;
  const { isMobile } = useDeviceDetect();

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    setValue
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      time_start: null,
      time_end: null,
    },
  });

  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<any>(null);

  const [showPopupDanhSachHocSinh, setShowPopupDanhSachHocSinh] =
    useState(false);
  const [quantityStudentAssign, setQuantityStudentAssign] =
    useState<string>("");
  const [studentsId, setStudentId] = useState<any>({});
  const [errorQuantityStudent, setErrorQuantityStudent] = useState("");

  const fetchDetailHomework = useHomeworkStore((state: any) => state.fetchDetailHomework);
  const detailHomework = useHomeworkStore((state: any) => state.detailHomework);
  const fetchingDetailHomework = useHomeworkStore((state: any) => state.fetchingDetailHomework);

  const fetchListStudentInClass = useStudentStore((state: any) => state.fetchListStudentInClass);
  const listStudentInClass = useStudentStore((state: any) => state.listStudentInClass);

  const isAssignHomeworkOneClass = getInfoFromLS("isAssignOneClass");
  const dataActivity = getInfoFromLS("dataActivity");
  const storedClassName = getInfoFromLS("className") ?? "";

  useEffect(()=> {
    !isAssignHomeworkOneClass && fetchDetailHomework({id});
    if(isAssignHomeworkOneClass) {
      setQuantityStudentAssign("Tất cả học sinh");
    }
  },[id]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if(isAssignHomeworkOneClass) {
          const listStudentInClass = await fetchListStudentInClass({ class_id: storedClassName.id });
          if (listStudentInClass) {
            const studentObject: { [key: number]: boolean } = {};
    
            listStudentInClass.forEach((student: any) => {
              studentObject[student.id] = true;
            });
            setStudentId(studentObject);
            localStorage.setItem(`checkedStudents_${storedClassName.id}`, JSON.stringify(studentObject));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [])

  useEffect(()=> {
    if (detailHomework) {
      const timeStart = detailHomework.end_date
        ? new Date(detailHomework.start_date * 1000)
        : null;
      const timeEnd = detailHomework.end_date
        ? new Date(detailHomework.end_date * 1000)
        : null;
      setValue("time_start", timeStart?.getTime() || null as any);
      setValue("time_end", timeEnd?.getTime() || null as any);
      setSelectedDate(timeStart);
      setSelectedEndDate(timeEnd);
      setStudentId(detailHomework?.student_assigned);
      const studentAssign = Object.keys(
        detailHomework?.student_assigned
      ).filter((studentId: any) => detailHomework?.student_assigned[studentId]);
      setStudentId(detailHomework?.student_assigned);
      if (
        studentAssign.length ===
        Object.keys(detailHomework?.student_assigned).length
      ) {
        setQuantityStudentAssign("Tất cả học sinh");
      } else {
        setQuantityStudentAssign(`${studentAssign.length} học sinh`);
      }
      localStorage.setItem(`checkedStudents_${id}`, JSON.stringify(detailHomework?.student_assigned));
    }

  },[detailHomework])

  const handleBackPage = () => {
    localStorage.setItem("previousTabId", 'homeworks');
    router.back();
    localStorage.removeItem(`checkedStudents_${storedClassName.id}`);
    localStorage.removeItem(`checkedStudents_${id}`);
  };

  const handleClosePopupDanhSachHocSinh = () => {
    setShowPopupDanhSachHocSinh(false);
  };

  const handleAssignStudent = () => {
    setShowPopupDanhSachHocSinh(true);
  };

  const onSubmitAssignStudent = (
    checkedStudents: Record<number, boolean> | undefined
  ) => {
    if (!checkedStudents) {
      return;
    }

    const student_id = Object.keys(checkedStudents).filter((studentId: any) => checkedStudents[studentId]);
    setStudentId(checkedStudents)
    if (student_id.length === Object.keys(checkedStudents).length) {
      setQuantityStudentAssign("Tất cả học sinh");
    } else {
      setQuantityStudentAssign(`${student_id.length} học sinh`);
    }
    setErrorQuantityStudent("");
    setShowPopupDanhSachHocSinh(false);

  };

  const handleAssignHomeWork = () => {
    const startTimeStamp = selectedDate
      ? Math.floor(selectedDate.getTime() / 1000)
      : null;
    const endTimeStamp = selectedEndDate
      ? Math.floor(selectedEndDate.getTime() / 1000)
      : null;
    
    if(isAssignHomeworkOneClass) {
      const dataAssignHomework = [
        {
          id_classroom: storedClassName.id,
          activity_id: id,
          time_start: startTimeStamp,
          time_end: endTimeStamp,
          student_assigned: studentsId
        },
      ];
      createAssignHomeworkClassrooms(dataAssignHomework).then((res: any) => {
        if(res.status === "success"){
          toast.success("Giao bài tập thành công");
          handleBackPage();
        }
      }).catch((err)=> {
        console.log(err)
      })
    } else {
      const dataUpdateHomeWork = {
        student_assigned: studentsId,
        start_date: startTimeStamp,
        end_date: endTimeStamp,
        id: detailHomework.id,
      };
      editHomework(dataUpdateHomeWork)
        .then((res: any) => {
          if (res.status === "success") {
            toast.success("Cập nhật thành công!");
            handleBackPage();
          } else {
            toast.error("Cập nhật thất bại!");
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  const handleDateStartChange = (date: any) => {
    setSelectedDate(date);
  };

  const handleDateEndChange = (date: any) => {
    if(selectedDate == null) {
      return toast.error("Vui lòng chọn ngày bắt đầu trước khi chọn ngày hết hạn!")
    }
    setSelectedEndDate(date);
  }

  return (
    <>
      <section className="giao-bai">
        <div className="d-flex gap-3 mb-8">
          <i
            className="fa fa-angle-left fs-4 me-1 pointer"
            aria-hidden="true"
            onClick={() => handleBackPage()}
          />
          <p className="fw-bold fs-2">{!isAssignHomeworkOneClass ? "Chỉnh sửa hoạt động" : "Giao bài tập"}</p>
        </div>

       {!fetchingDetailHomework || isAssignHomeworkOneClass ? <div>
          <ActivityDescription
            pathThumb={isAssignHomeworkOneClass ? dataActivity?.path_thumb : detailHomework?.path_thumb}
            activityTitle={isAssignHomeworkOneClass ? dataActivity?.name : detailHomework?.name}
            activityDescription={isAssignHomeworkOneClass ? dataActivity?.description : detailHomework?.description}
          />

          <div className="description-activity p-7">
            <p className="fs-2 text-story fw-bold mb-4">{storedClassName?.className ?? ""}</p>
            <div className="d-flex justify-content-center">
              <Col md={9} sm={12} className="mb-5">
                <Form.Label className="fw-bold text-story">
                  Danh sách học sinh <span>*</span>
                </Form.Label>
                <div className="input-assign d-flex align-items-center justify-content-between p-4">
                  <p className="text-story fw-bold">{quantityStudentAssign}</p>
                  <Image
                    src={`${globalPath.pathSvg}/edit.svg`}
                    width={24}
                    height={24}
                    alt="edit"
                    onClick={() => handleAssignStudent()}
                  />
                </div>
                {errorQuantityStudent && (
                  <p className="mt-2 text-danger">{errorQuantityStudent}</p>
                )}
              </Col>
            </div>
            <div
              className={`d-flex justify-content-center ${
                isMobile ? "flex-column gap-5" : "gap-72"
              }`}
            >
              <Col md={4} className="d-flex flex-column">
                <Form.Label className="fw-bold text-story" htmlFor="time_start">
                  Ngày bắt đầu <span>*</span>
                </Form.Label>
                <Controller
                  control={control}
                  name="time_start"
                  render={({ field }: any) => (
                    <DatePicker
                      onChange={(date: any) => {
                        handleDateStartChange(date);
                        field.onChange(date);
                      }}
                      selected={selectedDate}
                      minDate={new Date()}
                      onBlur={field.onBlur}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày bắt đầu"
                      className="form-control"
                    />
                  )}
                />
                {errors?.time_start?.message && (
                  <p className="mt-2 text-danger">
                    {errors?.time_start?.message}
                  </p>
                )}
              </Col>

              <Col md={4} className="d-flex flex-column">
                <Form.Label className="fw-bold text-story" htmlFor="time_start">
                  Ngày hết hạn
                </Form.Label>
                <Controller
                  control={control}
                  name="time_end"
                  render={({ field }: any) => (
                    <DatePicker
                      onChange={(date: any) => {
                        handleDateEndChange(date);
                        field.onChange(date);
                      }}
                      selected={selectedEndDate}
                      onBlur={field.onBlur}
                      minDate={
                        selectedDate
                          ? new Date(selectedDate.getTime() + 86400000)
                          : undefined
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày hết hạn"
                      className="form-control"
                    />
                  )}
                />
                {errors?.time_end?.message && (
                  <p className="mt-2 text-danger">
                    {errors?.time_end?.message}
                  </p>
                )}
              </Col>
            </div>
          </div>

          <div className="submit-assign d-flex justify-content-end gap-3 mt-72">
            <Button variant="danger" type="button" onClick={()=> handleBackPage()}>
              Hủy
            </Button>
            <form onSubmit={handleSubmit(handleAssignHomeWork)}>
              <Button variant="success" type="submit">
                Giao bài
              </Button>
            </form>
            
          </div>
        </div> : <Loading />}
      </section>

      {showPopupDanhSachHocSinh && (
        <PopupDanhSachHocSinhTrongLop
          show={showPopupDanhSachHocSinh}
          handleClose={handleClosePopupDanhSachHocSinh}
          onSubmit={onSubmitAssignStudent}
          classroomName={storedClassName.className}
          listStudent={!isAssignHomeworkOneClass ? detailHomework?.student_infos : listStudentInClass}
          classroomId={!isAssignHomeworkOneClass ? Number(id) : Number(storedClassName?.id)}
        />
      )}
    </>
  );
};

export default EditAssignHomeworkForClassroom;
