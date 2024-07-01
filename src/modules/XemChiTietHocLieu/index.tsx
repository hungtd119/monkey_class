"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { globalPath } from "src/global";
import { getDetailLesson } from "src/services/common";
import { COURSE_ID, MODE_SMART_CLASS, TYPE_LESSON_PLAN, TYPE_LESSON_PLAN_WORKSHEET, TYPE_TAI_LIEU_GUI_TRUOC, TYPE_VIDEO_HOC_LIEU } from "src/constant";
import ReactPlayer from "react-player";
import Loading from "src/components/Loading";
import ModalPlayListVideo from "src/components/ModalPlayListVideo";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { getInfoFromLS } from "src/selection";
import { useAppStore } from "src/stores/appStore";
import { nunito } from "@styles/font";


const XemChiTietHocLieu = () => {
  const router = useRouter();
  const { id,class_id } = router.query;
  const [dataPdf, setDataPdf] = useState<any>([]);
  const [thumb, setThumb] = useState("");
  const [urlVideo, setUrlVideo] = useState("");
  const [dataDetail, setDataDetail] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [showPlayVideoSM, setShowPlayVideoSM] = useState(false);
  const [listPlayVideoSM, setListPlayVideoSM] = useState<any>([]);
  const [thumbVideoSM, setThumbVideoSM] = useState("");
  const isAssignHomeworkOneClass = getInfoFromLS("isAssignOneClass");
  const setOpenLogoutModal = useAppStore((state: any) => state.setOpenLogoutModal);
  useEffect(() => {
    setLoading(true);
    getDetailLesson({ lesson_id: id,class_id:class_id || null})
      .then((res: any) => {
        if (res.meta.code === 200) {
          const coursewaresPdf =
            res.result?.coursewares?.filter(
              (courseware: any) =>
                courseware.type === TYPE_LESSON_PLAN_WORKSHEET || courseware.type === TYPE_LESSON_PLAN || courseware.type === TYPE_TAI_LIEU_GUI_TRUOC
            ) || [];

          const coursewareVideo = res.result?.coursewares?.find(
            (courseware: any) => courseware.type === TYPE_VIDEO_HOC_LIEU
          );

          setDataPdf(coursewaresPdf);
          setThumb(res.result.path_thumb);
          setDataDetail(res.result);
          if (coursewareVideo) {
            setUrlVideo(
              `${process.env.NEXT_PUBLIC_CDN}${coursewareVideo.path}`
            );
            setThumbVideoSM(coursewareVideo.path_thumb)
          }
        }
      })
      .catch((error) => {
        if (error?.response?.data?.meta?.code === 401) {
          setOpenLogoutModal(true)
        }
      }).finally(()=> setLoading(false));
  }, [id]);

  const handleBackPage = () => {
    router.back();
  };

  const handleCloseModalVideo = () => {
    setShowPlayVideoSM(false);
  };

  const handlePlayListVideoSM = (listVideo: any, dataLesson: any) => {
    let listVideoNew: any = [];

    Object.keys(listVideo).forEach((key)=> {
      let item = listVideo[key];
      if  (item.type === TYPE_VIDEO_HOC_LIEU) {
        listVideoNew.push(
          {
            name: item?.name_original,
            link: `${process.env.NEXT_PUBLIC_CDN}${item?.path}`,
            path_thumb: item.path_thumb,
            question_set_id: item?.question_set_id ?? 0,
            dataQuestion: dataLesson,
            isShow: true
          }
        );
        if(item.question_set_id != 0) {
          listVideoNew.push(
            {
              name: item?.name_original,
              link: `${process.env.NEXT_PUBLIC_CDN}${item?.path}`,
              path_thumb: item.path_thumb,
              question_set_id: item?.question_set_id ?? 0,
              dataQuestion: dataLesson,
              isShow: false
            }
          );
        }
      }
      
    })

    // const videoSM = listVideo && listVideo?.filter((item: any) => item.type === TYPE_VIDEO_HOC_LIEU) || [];
    // const formatListVideoSM = videoSM && videoSM.map((video:any)=> ({
    //   name: video?.name_original,
    //   link: `${process.env.NEXT_PUBLIC_CDN}${video?.path}`,
    //   path_thumb: video.path_thumb,
    //   question_set_id: video?.question_set_id ?? 0,
    //   dataQuestion: dataLesson
    // }))
    setListPlayVideoSM(listVideoNew);
    setShowPlayVideoSM(true);
  }

  const handleAssignHomeWork = (id: number, dataActivity: any) => {
    const dataInfoLessonNeedAssign = {
      courseId: dataDetail?.curriculum_id,
      levelId: dataDetail?.level_id,
      unitId: dataDetail?.game_category_id,
      lessonId: dataDetail?.id,
    }

    localStorage.setItem("dataActivity", JSON.stringify(dataActivity));
    localStorage.setItem("infoLessonNeedAssign", JSON.stringify(dataInfoLessonNeedAssign));

    isAssignHomeworkOneClass ?router.push(`/edit-homework/${id}`) : router.push(`/giao-bai-tap/${id}`);
  }

  return (
    <>
      {!loading ? (
        <div className={`bg-primary ${nunito.className}`}>
          <div className="d-flex align-items-center mt-7 px-7">
            <i
              className="fa fa-angle-left fs-4 me-3 pointer"
              aria-hidden="true"
              onClick={() => handleBackPage()}
            />
            <p className="fw-bold fs-3">{dataDetail?.title}</p>
          </div>

          {dataDetail?.curriculum_id !== COURSE_ID && (
            <div className="description-material row justify-content-center p-6">
              <div
                className="d-flex justify-content-evenly flex-wrap"
                style={{
                  borderRadius: "24px",
                  background: "#fff",
                  padding: "30px 10px",
                  maxWidth: "76%",
                }}
              >
                <img
                  width="auto"
                  height={148}
                  src={thumb ? thumb : `${globalPath.pathImg}/default.png`}
                  alt="thumb_material"
                />
                <div className="mw-50 d-flex flex-column align-items-center ms-64 ml-0">
                  <p className="fw-bold ff-i mb-3 fs-4">{dataDetail?.title}</p>
                  <p className="fs-2">{dataDetail?.description}</p>
                </div>
              </div>
            </div>
          )}
          {dataPdf?.length > 0 &&
            dataPdf.map((data: any, index: number) => (
              <div key={index} className="d-flex justify-content-center mb-8">
                <div
                  className={`view-material col-md-12 mb-4 ${
                    dataPdf[index].type === TYPE_LESSON_PLAN_WORKSHEET
                      ? "worksheet"
                      : "lesson-plan"
                  }`}
                  style={{ height: 930, width: "75%" }}
                >
                  <DocViewer
                    key={data.id}
                    pluginRenderers={DocViewerRenderers}
                    documents={[
                      { uri: `${process.env.NEXT_PUBLIC_CDN}${data.path}` },
                    ]}
                    config={{
                      header: {
                        disableHeader: true,
                        disableFileName: true,
                        retainURLParams: true,
                      },
                    }}
                    className="remove-scroll-docs-view rounded"
                  />
                </div>
              </div>
            ))}

          {dataDetail?.model_id === MODE_SMART_CLASS &&
          dataDetail?.curriculum_id === COURSE_ID ? (
            dataDetail?.coursewares?.filter((c:any) => c.type === TYPE_VIDEO_HOC_LIEU).length > 1 ? (
              <div className="video-sm d-flex justify-content-center">
              <div
                className="position-relative"
                style={{ maxWidth: "75%" }}
                onClick={() => handlePlayListVideoSM(dataDetail?.coursewares, dataDetail?.data_question)}
              >
                <Image
                  src={thumbVideoSM ?? `${globalPath.pathImg}/default.png`}
                  width={1440}
                  height={700}
                  alt="thumb"
                />
                <div className="position-absolute video-sm">
                  <Image
                    src={`${globalPath.pathSvg}/play-circle.svg`}
                    width={60}
                    height={60}
                    alt="icon play"
                  />
                </div>
              </div>
            </div>
            )
            : (
              <div className="video-wrapper d-flex justify-content-center mt-5 pb-64">
                <div style={{ width: "75%" }}>
                  <ReactPlayer
                    url={process.env.NEXT_PUBLIC_CDN + dataDetail?.coursewares?.filter((c:any) => c.type === TYPE_VIDEO_HOC_LIEU)[0]?.path}
                    controls={true}
                    config={{
                      file: {
                        attributes: {
                          controlsList: "nodownload",
                        },
                      },
                    }}
                    width="100%"
                    height="100%"
                    style={{ minHeight: "70vh" }}
                  />
                </div>
              </div>
            )
          ) : (
            urlVideo && (
              <div className="video-wrapper d-flex justify-content-center mt-5 pb-64">
                <div style={{ width: "75%" }}>
                  <ReactPlayer
                    url={urlVideo}
                    controls={true}
                    config={{
                      file: {
                        attributes: {
                          controlsList: "nodownload",
                        },
                      },
                    }}
                    width="100%"
                    height="100%"
                    style={{ minHeight: "70vh" }}
                  />
                </div>
              </div>
            )
          )}
          {dataDetail?.activities?.length > 0 && <div className="description-homework row justify-content-center p-6">
            <div
              style={{
                borderRadius: "24px",
                background: "#fff",
                padding: "30px",
                maxWidth: "76%",
              }}
            >
              <p className="fw-bold text-story fs-3 mb-4">Hoạt động</p>
              {(dataDetail?.activities || []).map((activity: any, index: number) => {
                return (
                  <div
                    className="activity-lesson pt-2 px-5 pb-5 mb-6"
                    key={activity.id}
                  >
                    <div className="d-flex justify-content-end">
                      <Button
                        disabled={activity.is_assigned === 1}
                        variant="success"
                        onClick={() => handleAssignHomeWork(activity?.id, activity)}
                      >
                        Giao bài
                      </Button>
                    </div>
                    <div className="d-flex gap-7">
                      <img
                        src={`${process.env.NEXT_PUBLIC_CDN}upload/cms_platform/thumb/activity/hdr/${activity?.path_thumb}`}
                        width={248}
                        height={156}
                        alt="default act"
                      />
                      <div className="d-flex flex-column justify-content-around">
                        <p className="fw-bold fs-2">
                          {activity?.name}
                        </p>
                        <p className="text-story">
                          {activity?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>}
        </div>
      ) : (
        <Loading />
      )}

      {showPlayVideoSM && (
        <ModalPlayListVideo
          show={showPlayVideoSM}
          handleClose={handleCloseModalVideo}
          listPlayVideo={listPlayVideoSM}
        />
      )}
    </>
  );
};

export default XemChiTietHocLieu;
