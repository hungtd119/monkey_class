import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Loading from "src/components/Loading";
import Select from "react-select";
import { Button, Col } from "react-bootstrap";
import {
  getDetailTeacher,
  getLessonByParams,
  getUnitByLevel,
} from "src/services/common";
import {
  COURSE_ID,
  LEARN_MODELS,
  RangeAge,
  TYPE_ACCOUNT_ADMIN,
} from "src/constant";
import ReactPaginate from "react-paginate";
import { globalPath } from "src/global";
import Image from "next/image";
import ModalPlayVideo from "src/components/ModalPlayListVideo/PlayVideo";
import { useTaiLieuStore } from "../../stores/tailieuStore";
import { useRouter } from "next/router";
import { checkTypeAccount } from "../../selection";
import { id } from "date-fns/locale";
import OptionStatus from "src/components/OptionStatus/OptionStatus";
import { useSchoolStore } from "../../stores/schoolStore";

const DanhSachTaiLieuClassOffline = (props: any) => {
  const { infoCourse, loading, classId, setCurrentUnit, teacherName } = props;
  const router = useRouter();
  const { unit_id } = router.query;

  const [typeAccount, setTypeAccount] = useState(null);

  const [listUnit, setListUnit] = useState([]);
  const [page, setPage] = useState(0);
  const [urlVideo, setUrlVideo] = useState("");
  const [showModalPlayVideo, setShowModalPlayVideo] = useState(false);

  const listLesson = useTaiLieuStore((state: any) => state.listLesson);
  const fetchListLesson = useTaiLieuStore(
    (state: any) => state.fetchListLesson
  );
  const fetchingLesson = useTaiLieuStore((state: any) => state.fetchingLesson);
  const total = useTaiLieuStore((state: any) => state.total);
  const fetchDetailLesson = useTaiLieuStore(
    (state: any) => state.fetchDetailLesson
  );
  const detailLesson = useTaiLieuStore((state: any) => state.detailLesson);
  const userId =
    typeof localStorage !== "undefined" ? localStorage.getItem("userId") : "";

  const { control, watch } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      unit_id: "",
    },
  });
	const { schoolActive } = useSchoolStore((state: any) => ({
		schoolActive: state.schoolActive,
	}));

  const selectedUnitId = watch("unit_id");

  useEffect(() => {
    const params = {
      level_id: infoCourse?.level,
      course_id: COURSE_ID,
      model_id: infoCourse?.model,
      user_id: userId,
	    school_id:schoolActive?.id
    };
    if (infoCourse?.level || infoCourse?.model) {
      getUnitByLevel(params)
        .then((res) => {
          if (res.meta.code === 200) {
            const unitFormated = res.result.map((unit: any) => ({
              value: unit.id,
              label: unit.name,
              available: unit.available,
            }));
            setListUnit(unitFormated);
          } else {
            setListUnit([]);
          }
        })
        .catch((err) => {
          console.log(err);
          setListUnit([]);
        });
    }
    setTypeAccount(checkTypeAccount());
  }, []);

  useEffect(() => {
    const params = {
      per_page: 12,
      page: page + 1,
      course_id: COURSE_ID,
      level_id: infoCourse?.level,
      model_id: infoCourse?.model,
      unit_id: selectedUnitId === "" ? unit_id : selectedUnitId,
      class_id: classId,
      user_id: userId,
	    school_id:schoolActive?.id
    };
    if (infoCourse?.level || infoCourse?.model) {
      fetchListLesson(params);
    }
  }, [selectedUnitId, page]);

  const handlePlayVideo = async (idLesson: number, classID: number) => {
    localStorage.setItem("isAssignOneClass", String(true));
    router.push(`/view-material/${idLesson}?class_id=${classID}`);
  };

  const handleClickCalender = async (idClass: number) => {
    router.push(`/calender-class/${idClass}`);
  };

  return (
    <>
      <section className="lessons-detail">
        {!loading ? (
          <div className="d-flex justify-content-between">
            <div className="header-lessons py-5 ps-72">
              <p className="fm-mtr my-4">
                Mô hình:{" "}
                <span style={{ fontWeight: 500 }}>
                  {
                    LEARN_MODELS.find(
                      (model: any) => model.value === infoCourse?.model
                    )?.label
                  }
                </span>
              </p>
              <p className="fm-mtr my-4">
                Cấp độ:{" "}
                <span style={{ fontWeight: 500 }}>
                  {
                    RangeAge.find((age: any) => age.value === infoCourse?.level)
                      ?.label
                  }
                </span>
              </p>
              <p className="fm-mtr my-4">
                Giáo viên:{" "}
                <span style={{ fontWeight: 500 }}>{teacherName}</span>
              </p>
            </div>
            <div>
              {typeAccount === TYPE_ACCOUNT_ADMIN && (
                <Button
                  variant={"outline-danger"}
                  size={"lg"}
                  onClick={() => handleClickCalender(classId)}
                >
                  Lịch học
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Loading />
        )}

        <Col md={2}>
          <Controller
            render={({ field: { onChange } }: any) => (
              <Select
                placeholder="Chọn unit"
                className="ps-3 pt-2 mb-3"
                options={listUnit}
                value={listUnit.find(
                  (unit: any) => unit.value === Number(unit_id)
                )}
                isClearable
                onChange={(selectedOption: any) => {
                  onChange(selectedOption ? selectedOption.value : "");
                  setCurrentUnit(selectedOption ? selectedOption.value : "");
                  setPage(0);
                }}
                components={{ Option: OptionStatus }}
              />
            )}
            name="unit_id"
            control={control}
          />
        </Col>

        {!fetchingLesson ? (
          <>
            <div className="row material mt-6">
              {listLesson?.length > 0 ? (
                <div className="col-md-12 material-wrapper d-flex flex-wrap gap-2 mb-7">
                  {listLesson?.length > 0 &&
                    listLesson.map((lesson: any, index: number) => (
                      <Col
                        md={4}
                        sm={6}
                        className="material-wrapper__img position-relative"
                        key={index}
                        onClick={() => handlePlayVideo(lesson.id, classId)}
                      >
                        <div className="d-flex flex-column align-items-center">
                          <img
                            width="auto"
                            height={152}
                            className={"rounded-12"}
                            src={
                              lesson.path_thumb ??
                              `${globalPath.pathImg}/default.png`
                            }
                            alt="thumb_material"
                          />
                        </div>
                        {/* <div className="position-absolute play-video">
                        <Image
                          src={`${globalPath.pathSvg}/play-circle.svg`}
                          width={48}
                          height={48}
                          alt="icon play"
                          onClick={() => handlePlayVideo(lesson.id)}
                        />
                      </div> */}

                        <div
                          className="mt-4"
                          onClick={() => handlePlayVideo(lesson.id, classId)}
                        >
                          <a
                            target="_blank"
                            className="fw-bold pointer text-black"
                          >
                            {lesson.title}
                          </a>
                        </div>
                      </Col>
                    ))}
                </div>
              ) : (
                <div className="fw-bold text-center fs-2">Không có dữ liệu</div>
              )}
            </div>
            {total > 1 && (
              <ReactPaginate
                previousLabel={""}
                previousClassName={"icon icon-prev"}
                nextLabel={""}
                nextClassName={"icon icon-next"}
                breakLabel={"..."}
                pageCount={Math.ceil(total / 12)}
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
      <ModalPlayVideo
        show={showModalPlayVideo}
        handleClose={() => setShowModalPlayVideo(false)}
        urlVideo={urlVideo}
      />
    </>
  );
};

export default DanhSachTaiLieuClassOffline;
