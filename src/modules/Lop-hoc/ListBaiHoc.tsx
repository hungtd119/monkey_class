import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Col, Container, OverlayTrigger, Popover, Row } from "react-bootstrap";
import Loading from "src/components/Loading";
import ModalPlayListVideo from "src/components/ModalPlayListVideo";
import {
	LEARN_MODELS,
	RangeAge,
	STATUS_DONE, STATUS_UNLOCK,
	TYPE_ACCOUNT_ADMIN,
	TYPE_VIDEO_HOC_LIEU,
} from "src/constant";
import { checkTypeAccount, getFirstCategoryId } from "src/selection";
import { useClassroomStore } from "src/stores/classroomStore";
import ModalConfirmFinishLesson from "./ModalConfirmFinishLesson";
import { updateStatusLesson } from "src/services/common";
import { toast } from "react-toastify";
import SelectLevelMenu from "src/components/SelectLevelMenu/SelectLevelMenu";
import { useAppStore } from "src/stores/appStore";
import { da } from "date-fns/locale";

const ListBaiHoc = (props: any) => {
  const { idClassroom, infoCourse, teacherName } = props;

  const listUnitLesson = useClassroomStore(
    (state: any) => state.listUnitLesson
  );
	const currentSchedule = useClassroomStore(
		(state: any) => state.currentSchedule
	);
	// const optionalSchedule = useClassroomStore(
	// 	(state: any) => state.optionalSchedule
	// );
  const fetchDataUnitLesson = useClassroomStore(
    (state: any) => state.fetchDataUnitLesson
  );
  const fetchingUnitLesson = useClassroomStore(
    (state: any) => state.fetchingUnitLesson
  );
  const unitLevelId =
    useAppStore((state: any) => state.unitLevelId) ||
    getFirstCategoryId(listUnitLesson || []);

  const [popoverStates, setPopoverStates] = useState<boolean[] | undefined>();

  const [showPlayVideo, setShowPlayVideo] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [showPopOver, setShowPopOver] = useState(true);
  const [playListLesson, setPlayListLesson] = useState([]);
	const [lessonIdActive, setLessonIdActive] = useState(0);
	const [enrollmentIdActive, setEnrollmentIdActive] = useState(0);
	const [classIdActive, setClassIdActive] = useState(0);
  const [lessons, setLessons] = useState<any>([]);
  const [statusLessonActive, setStatusLessonActive] =
    useState<number | null>(null);

  useEffect(() => {
    const params = {
      class_id: idClassroom,
    };
    fetchDataUnitLesson(params);
  }, [fetchDataUnitLesson]);

  useEffect(() => {
    setPopoverStates(Array(listUnitLesson?.length || 0).fill(false));
  }, [listUnitLesson]);

  useEffect(() => {
    popover();
  }, [showPopOver]);

  const handleTogglePopover = (index: number) => {
    const newPopoverStates = (popoverStates || []).map(
      (state: any, i: number) => (i === index ? !state : false)
    );
    setPopoverStates(newPopoverStates);
  };

  const handlePlayVideo = (index: number, id: number, status: number,enrollment_id:number,class_id:number) => {
    setShowPlayVideo(!showPlayVideo);
    setShowPopOver(false);
    setLessonIdActive(id);
		setEnrollmentIdActive(enrollment_id);
		setClassIdActive(class_id);
    setStatusLessonActive(status);
    setShowModalConfirm(false);
    const lesson = lessons[index];

    if (lesson && lesson.coursewares) {
      // const videoCourseware =
      //   lesson.coursewares?.filter(
      //     (item: any) => item.type === TYPE_VIDEO_HOC_LIEU
      //   ) || [];

      // const transformedData = videoCourseware.map((item: any) => ({
      //   link: `${process.env.NEXT_PUBLIC_CDN}${item.path}`,
      //   name: item.name_original,
      //   path_thumb:item.path_thumb,
      //   question_set_id: item?.question_set_id ?? 0
      // }));

      let listVideoNew: any = [];

      Object.keys(lesson.coursewares).forEach((key) => {
        let item = lesson.coursewares[key];
        if (item.type === TYPE_VIDEO_HOC_LIEU) {
          listVideoNew.push({
            name: item?.name_original,
            link: `${process.env.NEXT_PUBLIC_CDN}${item?.path}`,
            path_thumb: item.path_thumb,
            question_set_id: item?.question_set_id ?? 0,
            dataQuestion: lesson.data_question,
            isShow: true,
          });
          if (item.question_set_id != 0) {
            listVideoNew.push({
              name: item?.name_original,
              link: `${process.env.NEXT_PUBLIC_CDN}${item?.path}`,
              path_thumb: item.path_thumb,
              question_set_id: item?.question_set_id ?? 0,
              dataQuestion: lesson.data_question,
              isShow: false,
            });
          }
        }
      });

      if (listVideoNew) {
        openModalVideo(listVideoNew);
      }
    }
  };

  const handleCloseModalVideo = () => {
    setShowPlayVideo(false);
    setShowPopOver(true);
    setShowModalConfirm(true);
  };

  const handleViewFileDocs = (path: string) => {
    const formatPath = `${process.env.NEXT_PUBLIC_CDN}${path}`;
    if (formatPath) {
      window.open(`/xem-tai-lieu/${encodeURIComponent(formatPath)}`, "_blank");
    }
  };

  const popover = (data?: any, index?: number) => {
    const courseware =
      data?.filter(
        (typeLesson: any) => typeLesson.type !== TYPE_VIDEO_HOC_LIEU
      ) || [];

    return (
      <Popover id={`popover-positioned-${index}`}>
        <Popover.Body>
          <div className="d-flex flex-column">
            {courseware.map((data: any, index: number) => (
              <a
                key={index}
                className="text-decoration-underline pb-2 pointer"
                onClick={() => handleViewFileDocs(data.path)}
              >
                {data.name_original}
              </a>
            ))}
          </div>
        </Popover.Body>
      </Popover>
    );
  };

  const openModalVideo = (data: any) => {
    setPlayListLesson(data || []);
    setPopoverStates(Array(listUnitLesson?.length || 0).fill(false));
  };

  const handleCloseModalConfirmLesson = () => {
    setShowModalConfirm(false);
  };

  const onSubmitModal = () => {
    setShowModalConfirm(false);
    const params = {
      schedule_id: lessonIdActive,
      status: STATUS_DONE,
	    // enrollment_id: enrollmentIdActive,
	    // unit_id: unitLevelId,
	    class_id: classIdActive,
    };
    updateStatusLesson(params)
      .then((res) => {
        if (res.meta.code === 200) {
          fetchDataUnitLesson({ class_id: idClassroom });
        } else {
          toast.error("Đã có lỗi xảy ra");
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (listUnitLesson?.length > 0 && unitLevelId) {
      const currentLevel = listUnitLesson.find((level: any) =>
        level.game_categories.some(
          (category: any) => category.id === unitLevelId
        )
      );

      const currentUnit = currentLevel?.game_categories.find(
        (unit: any) => unit.id === unitLevelId
      );

      const lessons = currentUnit?.game_lessons || [];
      setLessons(lessons);
    }
  }, [unitLevelId,listUnitLesson]);

  const openPopupWaring = (message:string) => {
    toast.error(message);
  }

  return (
    <>
      <section className="lessons-detail">
        {!fetchingUnitLesson ? (
          <Row className="me-4 justify-content-between">
            <Col lg={2} md={12} sm={12}>
              <div className="header-lessons py-5 ps-4">
                {/* <p className="fm-mtr my-4">
              Mô hình: <span style={{ fontWeight: 500 }}>{LEARN_MODELS.find((model:any) => model.value === infoCourse?.model)?.label}</span>
            </p>
            <p className="fm-mtr my-4">
              Cấp độ: <span style={{ fontWeight: 500 }}>{RangeAge.find((age:any) => age.value === infoCourse?.level)?.label}</span>
            </p>
            <p className="fm-mtr my-4">
              Giáo viên: <span style={{ fontWeight: 500 }}>{teacherName}</span>
            </p> */}
                <div className="nav-level col-md-3 mt-3">
                  <SelectLevelMenu isSm={true} listHocLieu={listUnitLesson || []} currentSchedule={currentSchedule}/>
                </div>
              </div>
            </Col>
            <Col lg={9} md={12} sm={12}>
              <Container fluid>
                <Row className="lessons gap-4 row-gap-8 pt-8">
                  {lessons &&
                    lessons.map((data: any, index: number) => {
                      const determineSrc = () => {
                        if (data?.schedule_status === STATUS_DONE) {
                          return "done";
                        }
                        return null;
                      };
                      const src = determineSrc();
                      const isConditionable =
                        data?.id === currentSchedule?.lesson_id ||
	                            data?.schedule_status === STATUS_DONE || data.schedule_status === STATUS_UNLOCK
											
                      return (
                        <Col
                          key={data.id}
                          lg={3}
                          md={6}
                          className={`col-lesson ${
                            isConditionable
                              ? "lesson-done"
                              : "lesson-not-completed"
                          } position-relative`}
                        >
                          {src && (
                            <Image
                              style={{ top: "-15%" }}
                              className="position-absolute start-50 translate-middle"
                              src={`${global.pathSvg}/${src}.svg`}
                              width={39}
                              height={39}
                              alt="icon"
                            />
                          )}
                          <div className="d-flex flex-column align-items-center gap-7">
                            <p className="fs-2 mt-3 fw-bold">
                              Lesson {index + 1}
                            </p>
                            <Image
                              src={`${global.pathSvg}/button_play.svg`}
                              width={62}
                              height={62}
                              // className={`${
                              //   isConditionable ||
                              //   checkTypeAccount() === TYPE_ACCOUNT_ADMIN
                              //     ? ""
                              //     : "pointer-disabled"
                              // }`}
                              alt="button play"
                              onClick={() =>
                                {
                                  if (data.id === currentSchedule.lesson_id || data.schedule_status === STATUS_DONE || data.schedule_status === STATUS_UNLOCK) {
                                    return handlePlayVideo(
                                      index,
                                      data.schedule_id,
                                      data.schedule_status,
	                                    data.enrollment_id,
	                                    data.class_id,
                                    )
                                  }
                                  else{
                                    return openPopupWaring("Bạn cần hoàn thành các bài học phía trước để mở khóa bài học này")
                                  }
                                }
                              }
                            />
                          </div>
                          {showPopOver && (
                            <OverlayTrigger
                              trigger="click"
                              key={`bottom-end-${index}`}
                              placement="bottom-end"
                              overlay={popover(data.coursewares, index)}
                              show={
                                isConditionable ||
                                checkTypeAccount() === TYPE_ACCOUNT_ADMIN
                                  ? popoverStates?.[index]
                                  : false
                              }
                            >
                              <div
                                className="d-flex justify-content-end mb-3"
                                onClick={() => handleTogglePopover(index)}
                              >
                                <Image
                                  src={`${global.pathSvg}/select.svg`}
                                  width={27}
                                  height={27}
                                  alt="icon select"
                                />
                              </div>
                            </OverlayTrigger>
                          )}
                        </Col>
                      );
                    })}
                </Row>
              </Container>
              {showPlayVideo && (
                <ModalPlayListVideo
                  show={showPlayVideo}
                  handleClose={handleCloseModalVideo}
                  listPlayVideo={playListLesson}
                />
              )}

              <ModalConfirmFinishLesson
                show={
                  showModalConfirm && statusLessonActive === STATUS_UNLOCK
                }
                onClose={() => handleCloseModalConfirmLesson()}
                onSubmit={() => onSubmitModal()}
              />
            </Col>
          </Row>
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
};

export default ListBaiHoc;
