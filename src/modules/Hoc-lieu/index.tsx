"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import _ from "lodash";
import Select from "react-select";
import { MaterialFile, TMaterialItem } from "src/components/MaterialItem";
import SelectLevelMenu from "src/components/SelectLevelMenu/SelectLevelMenu";
import {
  COURSE_ID,
  LEARN_MODELS,
  MODE_SMART_CLASS,
  TYPE_ACCOUNT_ADMIN,
  TYPE_ACCOUNT_PARENTS,
  TYPE_ACCOUNT_SCHOOL,
  TYPE_ACCOUNT_TEACHER,
  TYPE_LESSON_PLAN,
  TYPE_LESSON_PLAN_WORKSHEET,
  TYPE_TAI_LIEU_GUI_TRUOC,
  TYPE_VIDEO_HOC_LIEU,
} from "src/constant";
import { useAppStore } from "src/stores/appStore";
import SectionMaterialItem from "./SectionMaterialItem";
import useTrans from "src/hooks/useTrans";
import {
  checkLinksExistence,
  checkTypeAccount,
  getDataModelsStorage,
  getFirstCategoryId,
  getSchoolId,
  getUserIdFromSession,
  setEventGTM,
} from "src/selection";
import Loading from "src/components/Loading";
import ModalPlayVideo from "src/components/ModalPlayListVideo/PlayVideo";
import ModalPlayListVideo from "src/components/ModalPlayListVideo";

interface ExpandedSections {
  taiLieuGuiTruoc: boolean;
  lessonPlan: boolean;
  hocLieuVideo: boolean;
}

const Hoclieu = () => {
  const trans = useTrans();

  const schoolId = useAppStore((state: any) => state.schoolId) || getSchoolId();
  const courseId = useAppStore((state: any) => state.courseId);
  const learnModelId = useAppStore((state: any) => state.learnModelId);

  const setLearnModelId = useAppStore((state: any) => state.setLearnModelId);
  const fetchingHoclieu = useAppStore((state: any) => state.fetchingHoclieu);
  const dataModels =
    useAppStore((state: any) => state.dataModels) ?? getDataModelsStorage();
  const [urlVideo, setUrlVideo] = useState("");
  const [listPlayVideo, setListPlayVideo] = useState([]);
  const [idLesson, setIdLesson] = useState<null | number>(null);
  const [labelVideo, setLabelVideo] = useState("")

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    taiLieuGuiTruoc: true,
    lessonPlan: true,
    hocLieuVideo: true,
  });
  const [showPlayVideo, setShowPlayVideo] = useState(false);

  const listHocLieu = useAppStore((state: any) => state.listHocLieu);
  const fetchHoclieu = useAppStore((state: any) => state.fetchHoclieu);
  const [valueDefaultSchool, setValueDefaultSchool] = useState<any>();
  const [showSelectModel, setShowSelectModel] = useState(false)

  const unitLevelId = useAppStore((state: any) => state.unitLevelId) || getFirstCategoryId(listHocLieu);
  const setUnitLevelId = useAppStore((state: any) => state.setUnitLevelId)

  const [typeAccount, setTypeAccount] = useState(null); // dung local storage nen SSR bi loi phai dung state de goi o client
  useEffect(() => {
    setUnitLevelId(getFirstCategoryId(listHocLieu))
    if (listHocLieu.length > 0) {
      sessionStorage.setItem("unitActive", listHocLieu?.[0]?.game_categories?.[0]?.id);
    }
    setTypeAccount(checkTypeAccount());
  }, []);

  useEffect(() => {
    if (typeAccount === TYPE_ACCOUNT_TEACHER) {
      const transformedModels = getValueModelsSelect();
      setValueDefaultSchool(transformedModels[0]);
      setLearnModelId(modelsSchool[0]?.id);
    }
  }, [typeAccount]);

  useEffect(() => {
    setUnitLevelId(getFirstCategoryId(listHocLieu))

    const modelIdDefault = modelsSchool[0]?.id
    const userId = typeof localStorage !== "undefined" ? localStorage.getItem("userId") : "";

    const params = {
      curriculum_id: courseId || COURSE_ID,
      school_id: schoolId,
      model_id: learnModelId || modelIdDefault,
      user_id: userId,
      student_ids :JSON.parse(localStorage.getItem("studentIds") || "[]").join(",")
    }
    modelIdDefault && fetchHoclieu(params);
  }, [learnModelId, schoolId]);

  useEffect(() => {
    isHideSelectModel();
    setShowSelectModel(true)
    getValueModelsSelect();
    getDefaultValueModel();
    },[schoolId]);

  const isHasOneModel =
      dataModels?.length > 0 && dataModels[0].models?.length == 1;

  const handleToggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isModelSmartClass = learnModelId === MODE_SMART_CLASS || (isHasOneModel && dataModels[0]?.models[0]?.id === MODE_SMART_CLASS);

  const handleClickTLGT = (linkDocument: string) => {
    handleViewFileDocs(linkDocument);
  };

  const prepareTLGT = (lesson: any): TMaterialItem | null => {
    if (lesson.type !==  TYPE_TAI_LIEU_GUI_TRUOC) {
      return null; 
    }

    const coursewares =
      lesson.coursewares?.filter(
        (courseware: any) => courseware.type === TYPE_TAI_LIEU_GUI_TRUOC
      ) || [];

    const relevantCoursewares: MaterialFile[] = coursewares?.map((courseware: any) => {
  
      return {
        label: courseware.name_original,
        link: `${process.env.NEXT_PUBLIC_CDN}${courseware.path}`,
        isVideo: false,
        downloadable: false,
        onClick: handleClickTLGT,
      };
    }) || [];

    return {
      id: lesson.id,
      thumbnail: lesson.path_thumb,
      title: "",
      links: relevantCoursewares,
    };

  };
  
  const handleClickLessonPlan = (linkDocument: string, isDowloadable?: boolean, isVideo?: boolean, listVideo?: any) => {
    const downloadLink = document.getElementById("downloadLinkPdf");
    const isDocxFile = [".docx", ".pdf", ".pptx"].some(file => linkDocument.endsWith(file));

    if (downloadLink && isDowloadable) {
      fetch(linkDocument, {
        method: "GET",
        headers: {},
      })
        .then((response) => {
          response.arrayBuffer().then(function (buffer) {
            const url = window.URL.createObjectURL(new Blob([buffer]));
            const link = document.createElement("a");
            const fileName = linkDocument.substring(linkDocument.lastIndexOf("/") + 1);
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else if(isModelSmartClass && isVideo) {
      handleClickHLVideo("", listVideo);
    }
     else {
      handleViewFileDocs(linkDocument);
    }
  };

  const prepareLessonPlan = (lesson: any): TMaterialItem | null => {
    if (lesson.type !== TYPE_LESSON_PLAN) {
      return null; 
    }

    const coursewares = lesson.coursewares?.filter((courseware: any) => {
      if (isModelSmartClass) {
        return courseware.type === TYPE_VIDEO_HOC_LIEU || courseware.type === TYPE_LESSON_PLAN ||
        courseware.type === TYPE_LESSON_PLAN_WORKSHEET;
      } else {
        return (
          courseware.type === TYPE_LESSON_PLAN ||
          courseware.type === TYPE_LESSON_PLAN_WORKSHEET
        );
      }
    }) || [];

    const relevantCoursewares: MaterialFile[] = coursewares?.map((courseware: any) => {
      const downloadable = courseware.type === TYPE_LESSON_PLAN_WORKSHEET;
    
      if (courseware.type !== TYPE_VIDEO_HOC_LIEU) {
        return {
          id: courseware.id,
          label: courseware.name_original,
          link: `${process.env.NEXT_PUBLIC_CDN}${courseware.path}`,
          isVideo: isModelSmartClass,
          downloadable,
          type: null,
          onClick: handleClickLessonPlan,
        };
      } else {
        return {
          id: courseware.id,
          label: null,
          link: `${process.env.NEXT_PUBLIC_CDN}${courseware.path}`,
          isVideo: isModelSmartClass,
          downloadable,
          type: TYPE_VIDEO_HOC_LIEU,
          name: courseware.name_original,
          onClick: handleClickLessonPlan,
        }
      }
    }).filter(Boolean) || [];
    
    return {
      id: lesson.id,
      thumbnail: lesson.path_thumb,
      title: lesson.title,
      links: relevantCoursewares,
    };
  };

  const handleClickHLVideo = (link?: any, listVideo?: any) => {
    setEventGTM({
      event: "click_video",
      lesson_id: link?.id,
      user_id: getUserIdFromSession(),
      name_original: link.label,
      event_category: link.label
    });
    setLabelVideo(link.label)
    setIdLesson(link?.id)
    setUrlVideo(link?.link || "")
    setShowPlayVideo(true);

    const formatListVideo = listVideo && listVideo?.filter((item: any) => item.type === TYPE_VIDEO_HOC_LIEU) || [];
    setListPlayVideo(formatListVideo)
  };

  const prepareHLVideo = (lesson: any): TMaterialItem | null => {
    if (lesson.type !==  TYPE_VIDEO_HOC_LIEU) {
      return null; 
    }

    const coursewares =
      lesson.coursewares?.filter(
        (courseware: any) => courseware.type === TYPE_VIDEO_HOC_LIEU
      ) || [];

    const relevantCoursewares: MaterialFile[] = coursewares?.map((courseware: any) => {
  
      return {
        id: courseware.id,
        label: courseware.name_original,
        link: `${process.env.NEXT_PUBLIC_CDN}${courseware.path}`,
        isVideo: true,
        downloadable: false,
        onClick: handleClickHLVideo,
      };
    }) || []

    return {
      id: lesson.id,
      thumbnail: lesson.path_thumb,
      title: "",
      links: relevantCoursewares,
    };
  };

  const handleViewFileDocs = (path: string) => {
    if(path) {
      window.open(`/xem-tai-lieu/${encodeURIComponent(path)}`, "_blank");
    }
  }

  const [taiLieuGuiTruocData, setTaiLieuGuiTruocData] = useState<TMaterialItem[]>([]);
  const [lessonPlanData, setLessonPlanData] = useState<TMaterialItem[]>([]);
  const [hoclieuVideoData, setHoclieuVideoData] = useState<TMaterialItem[]>([]);

  useEffect(() => {
    if(listHocLieu.length > 0 && unitLevelId) {
      const currentLevel = listHocLieu.find((level: any) =>
        level.game_categories.some((category: any) => category.id === unitLevelId)
      );
  
      const currentUnit = currentLevel?.game_categories.find(
        (unit: any) => unit.id === unitLevelId
      );
  
      const lessons = currentUnit?.game_lessons || [];
  
      let newTLGTData: TMaterialItem[] = [];
      let newLessonPlanData: TMaterialItem[] = [];
      let newHoclieuVideoData: TMaterialItem[] = [];
  
      lessons.forEach((lesson: any) => {
        const preparedTLGT = prepareTLGT(lesson);
        if (preparedTLGT) {
          newTLGTData.push(preparedTLGT);
        }
  
        const preparedLessonPlan = prepareLessonPlan(lesson);
        if (preparedLessonPlan) {
          newLessonPlanData.push(preparedLessonPlan);
        }
  
        const preparedHLVideo = prepareHLVideo(lesson);
        if (preparedHLVideo) {
          newHoclieuVideoData.push(preparedHLVideo);
        }
      });
  
      setTaiLieuGuiTruocData(newTLGTData);
      setLessonPlanData(newLessonPlanData);
      setHoclieuVideoData(newHoclieuVideoData);

    }
  }, [unitLevelId, learnModelId, schoolId, listHocLieu]);

  const isShowSectionMaterial =
    !_.isEmpty(taiLieuGuiTruocData) ||
    !_.isEmpty(lessonPlanData) ||
    !_.isEmpty(hoclieuVideoData);

  const modelsSchool =
    (dataModels || []).find((school: any) => school.id === schoolId)?.models ||
    [];

  const isHideSelectModel = () => {
    const isHasOneModelACCountTeacher =
      modelsSchool?.length === 2 &&
      modelsSchool.some((model: any) => model.name === "Offline 40 phút") &&
      modelsSchool.some((model: any) => model.name === "Offline 55 phút");

    const isModelOffline =
      dataModels?.length > 0 &&
      dataModels[0].models?.length === 2 &&
      dataModels[0].models.some(
        (model: any) => model.name === "Offline 40 phút"
      ) &&
      dataModels[0].models.some(
        (model: any) => model.name === "Offline 55 phút"
      );

    if (typeAccount === TYPE_ACCOUNT_ADMIN) {
      return false;
    }
    if (
      (typeAccount === TYPE_ACCOUNT_SCHOOL && isHasOneModel) ||
      (typeAccount === TYPE_ACCOUNT_SCHOOL && isModelOffline)
    ) {
      return true;
    }

    if (
      (typeAccount === TYPE_ACCOUNT_TEACHER && isHasOneModelACCountTeacher) ||
      (typeAccount === TYPE_ACCOUNT_TEACHER && modelsSchool.length === 1)
    ) {
      return true;
    }
    if (
      typeAccount === TYPE_ACCOUNT_PARENTS ||
      (dataModels?.length > 0 && dataModels[0].models?.length <= 1)
    ) {
      return true;
    }
    return false;
  };

  const getValueModelsSelect = () => {
    if (typeAccount === TYPE_ACCOUNT_TEACHER) {

      const transformedModels = modelsSchool.map((model: any) => ({
        value: model.id,
        label: model.name,
      }));
      return transformedModels;
    }
    if (typeAccount === TYPE_ACCOUNT_SCHOOL) {
      const transformedModels = modelsSchool.map((model: any) => ({
        value: model.id,
        label: model.name,
      }));
      return transformedModels;
    }
    if (typeAccount === TYPE_ACCOUNT_ADMIN) {
      return LEARN_MODELS;
    }
  };

  const getDefaultValueModel = () => {
    if (typeAccount === TYPE_ACCOUNT_ADMIN) {
      return LEARN_MODELS[0];
    }
    if (
      typeAccount === TYPE_ACCOUNT_SCHOOL
    ) {
      return {
        value: modelsSchool[0]?.id ?? null,
        label: modelsSchool[0]?.name ?? "",
      };
    }
    if(typeAccount === TYPE_ACCOUNT_TEACHER) {
      setValueDefaultSchool(getValueModelsSelect()[0]);
    }
  };

  const handleCloseModalVideo = () => {
    setShowPlayVideo(false);
  };

  const handleChangeModel = (value: number) => {
    setLearnModelId(value || null);
  }

  return (
    <section className="section-hoclieu">
      <div className="title_page d-flex justify-content-between align-items-center pe-5 mb-8">
        <div className="d-flex align-items-center gap-4 fs-3 ms-3">
          <Image
            src={`${global.pathSvg}/book.svg`}
            width={48}
            height={48}
            alt="icon"
          />
          <p>{trans.list_material}</p>
        </div>
        {!isHideSelectModel() && (
          <div className="dropdown-custom">
            {showSelectModel && typeAccount === TYPE_ACCOUNT_TEACHER && (
              <Select
                className="d-block mt-2 pt-0"
                options={getValueModelsSelect()!}
                value={valueDefaultSchool}
                placeholder={trans.selectHolder["model"]}
                onChange={(selectOption: any) => {
                  handleChangeModel(selectOption.value);
                  setValueDefaultSchool(selectOption);
                }}
              />
            )}
            {showSelectModel && typeAccount !== TYPE_ACCOUNT_TEACHER && (
              <Select
                className="d-block mt-2 pt-0"
                defaultValue={getDefaultValueModel()!}
                options={getValueModelsSelect()!}
                placeholder={trans.selectHolder["model"]}
                onChange={({ value }: any) => handleChangeModel(value)}
              />
            )}
          </div>
        )}
      </div>
      {!fetchingHoclieu ? (
        <div className="row ms-3">
          {!_.isEmpty(listHocLieu) && (
            <div className="nav-level col-md-3 mt-3">
              <SelectLevelMenu listHocLieu={listHocLieu} />
            </div>
          )}

          {isShowSectionMaterial ? (
            <div className="col-md-9 section-material mt-3 ms-3">
              {/* section tai lieu gui truoc */}
              {checkLinksExistence(taiLieuGuiTruocData) && (
                <div className="material mb-7">
                  <SectionMaterialItem
                    titleSection="document_advance"
                    dataMaterial={taiLieuGuiTruocData}
                    expanded={expandedSections.taiLieuGuiTruoc}
                    onToggle={() => handleToggleSection("taiLieuGuiTruoc")}
                  />
                </div>
              )}
              {/* section lesson plan */}
              {checkLinksExistence(lessonPlanData) && (
                <div className="material mb-7">
                  <SectionMaterialItem
                    titleSection="lesson_plan"
                    dataMaterial={lessonPlanData}
                    expanded={expandedSections.lessonPlan}
                    onToggle={() => handleToggleSection("lessonPlan")}
                  />
                </div>
              )}

              {/* section hoc lieu video */}
              {checkLinksExistence(hoclieuVideoData) && !isModelSmartClass && (
                <div className="material mb-7">
                  <SectionMaterialItem
                    titleSection="video_material"
                    dataMaterial={hoclieuVideoData}
                    expanded={expandedSections.hocLieuVideo}
                    onToggle={() => handleToggleSection("hocLieuVideo")}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="col-md-9 section-material mt-3 text-center fs-4">
              {trans.no_documents}
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}

      {!isModelSmartClass ? (
        <ModalPlayVideo
          show={showPlayVideo}
          handleClose={handleCloseModalVideo}
          urlVideo={urlVideo}
          idLesson={idLesson}
          label={labelVideo}
        />
      ) : (
        <ModalPlayListVideo
          show={showPlayVideo}
          handleClose={handleCloseModalVideo}
          listPlayVideo={listPlayVideo}
        />
      )}
    </section>
  );
};

export default Hoclieu;
