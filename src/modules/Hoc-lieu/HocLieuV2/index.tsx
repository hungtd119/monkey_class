import { keepPreviousData, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import Loading from "src/components/Loading";
import OptionStatus from "src/components/OptionStatus/OptionStatus";
import {
	COURSE_ID,
	LEARN_MODELS,
	LEARN_MODELS_COLLAPSE,
	MODE_SMART_CLASS,
	TYPE_ACCOUNT_ADMIN,
	TYPE_ACCOUNT_PARENTS,
	TYPE_ACCOUNT_SCHOOL, TYPE_ACCOUNT_TEACHER,
} from "src/constant";
import useTrans from "src/hooks/useTrans";
import TaiLieuItem from "src/modules/Lop-hoc/TaiLieu";
import {
	getLessonByParams,
	getLevelByCourse, getListCourses, getTypeAccount,
	getUnitByLevel,
} from "src/services/common";
import { useTaiLieuStore } from "../../../stores/tailieuStore";
import { checkTypeAccount, getDataModelsStorage } from "src/selection";
import OptionStatusUnit from "src/components/OptionStatus/OptionStatusUnit";
import { useSchoolStore } from "../../../stores/schoolStore";
import useSafeState from "@restart/hooks/useSafeState";

const HoclieuV2 = () => {
  const trans = useTrans();
  const router = useRouter();

  const { control, setValue } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      course_id: "",
      level_id: "",
      model_id: "",
      unit_id: "",
    },
  });

  const { subject, age, model, topic, p } = router.query;
  const userId =
    typeof localStorage !== "undefined" ? localStorage.getItem("userId") : "";

  const subjectId =
    useTaiLieuStore((state: any) => state.subjectId) || subject || "109";
  const rangeAgeId = useTaiLieuStore((state: any) => state.rangeAgeId) ?? age;
  const modelId = useTaiLieuStore((state: any) => state.modelId) ?? model;
  const topicId = useTaiLieuStore((state: any) => state.topicId) ?? topic;
  const setSubjectId = useTaiLieuStore((state: any) => state.setSubjectId);
  const setRangAgeId = useTaiLieuStore((state: any) => state.setRangAgeId);
  const setModelId = useTaiLieuStore((state: any) => state.setModelId);
  const setTopicId = useTaiLieuStore((state: any) => state.setTopicId);

  const [page, setPage] = useState(p ? Number(p) : 1);
  const [total, setTotal] = useState(0);
	
	const [listFormatCourses,setListFormatCourses] = useState<any>([])
	
	const [selectedSubject,setSelectedSubject] = useState<any>(null)

  const [defaultRangeAge, setDefaultRangeAge] = useState<any>();
  const [defaultValueTopic, setDefaultValueTopic] = useState<any>();
	const [listLevel,setListLevel] = useState<any>([])
	const [listUnit,setListUnit] = useState<any>([])
	const [listLesson,setListLesson] = useState<any>([])
	const [isLoadingListLesson,setIsLoadingListLesson] = useState(false)
	
	const { schoolActive } = useSchoolStore((state: any) => ({
		schoolActive: state.schoolActive,
	}));

  useEffect(() => {
    if (subjectId || rangeAgeId || modelId || topicId) {
      router.replace(buildUrl());
    }
    setPage(1);
  }, [subjectId, rangeAgeId, modelId, topicId]);

  useEffect(() => {
    router.replace(buildUrl());
  }, [page]);

  // const { data: listCourse } = useQuery({
  //   queryKey: ["listCourse",page,schoolActive?.id],
  //   queryFn: () => {
  //     return fetchListCourse();
  //   },
  //   staleTime: 15 * 1000 * 60,
  // });

  // const { data: listLevel } = useQuery({
  //   queryKey: ["listLevel", subjectId,page,schoolActive?.id],
  //   queryFn: () => {
  //     return getLevelWithCourse();
  //   },
  //   staleTime: 15 * 1000 * 60,
  // });
	//
  // const { data: listUnit } = useQuery({
  //   queryKey: ["listUnit", subjectId, rangeAgeId, modelId,page,schoolActive?.id],
  //   queryFn: () => {
  //     if (subjectId == COURSE_ID) {
  //       return getListUnitByLevel();
  //     }
  //     return Promise.resolve([]);
  //   },
  //   staleTime: 15 * 1000 * 60,
  // });
	//
  // const { data: listLesson, isLoading: isLoadingListLesson } = useQuery({
  //   queryKey: ["listLesson", subjectId, rangeAgeId, modelId, topicId, page,schoolActive?.id],
  //   queryFn: () => {
  //     return getListLesson();
  //   },
  //   staleTime: 15 * 1000 * 60,
  //   refetchOnWindowFocus: false,
  //   placeholderData: keepPreviousData,
  // });

  const getLevelWithCourse = async () => {
    try {
      const res = await getLevelByCourse({
        course_id: subjectId,
        user_id: userId,
	      school_id: schoolActive?.id,
      });
      if (res.meta.code === 200) {
        const levelFormated = res.result.map((level: any) => ({
          value: level.id,
          label: level.name,
          available: level.available,
        }));
        setDefaultRangeAge(
          levelFormated &&
            levelFormated.find((level: any) => level.value == rangeAgeId)
        );
        setListLevel(levelFormated);
      } else {
        throw new Error("Failed to fetch list level");
      }
    } catch (error) {
      console.error("Error fetching list level:", error);
      throw error;
    }
  };

  const getListUnitByLevel = async () => {
    const params = {
      course_id: subjectId,
      level_id: rangeAgeId,
      model_id: subjectId == 109 ? modelId : MODE_SMART_CLASS,
      user_id: userId,
	    school_id: schoolActive?.id,
    };
    try {
      const res = await getUnitByLevel(params);
      if (res.meta.code === 200) {
        const unitFormated = res.result.map((unit: any) => ({
          value: unit.id,
          label: unit.name,
          available: unit.available,
        }));
        setDefaultValueTopic(
          unitFormated &&
            unitFormated.find((unit: any) => unit.value === topicId)
        );
        setListUnit(unitFormated);
      } else {
        throw new Error("Failed to fetch list unit");
      }
    } catch (error) {
      console.error("Error fetching list unit:", error);
      throw error;
    }
  };

  const getListLesson = async () => {
    const params = {
      course_id: subjectId,
      user_id: userId,
      level_id: rangeAgeId,
      model_id: Number(subjectId) === COURSE_ID ? modelId : MODE_SMART_CLASS,
      unit_id: topicId,
      per_page: 12,
	    school_id: schoolActive?.id,
      page,
    };
    try {
      const res = await getLessonByParams(params);
      if (res.meta.code === 200) {
        const listLesson = res.result.data;
        setTotal(res.result.total);
				setListLesson(listLesson);
      } else {
        throw new Error("Failed to fetch list lesson");
      }
    } catch (error) {
      console.error("Error fetching list lesson:", error);
      throw error;
    }
  };

  const buildUrl = () => {
    if (subjectId || rangeAgeId || modelId || topicId || page) {
      const url = "danh-sach-hoc-lieu";
      const data: any = _.pickBy(
        {
          subject: Number(subjectId),
          age: Number(rangeAgeId),
          model: Number(modelId),
          topic: Number(topicId),
          p: page,
        },
        (value: any) => !!value
      );

      const searchParams = new URLSearchParams(data);
      return `${url}?${searchParams}`;
    }
    return "";
  };
	
	const fetchListCourses = async () => {
		try {
			const res = await getListCourses({});
			if (res && res.code === 200) {
				const data = res.data;
				const dataModels = getDataModelsStorage();
				const listCourse = checkTypeAccount() === TYPE_ACCOUNT_TEACHER ? JSON.parse(localStorage.getItem("listCourseOf") || "[]") : dataModels?.find((item: any) => item.school_id === schoolActive?.id)?.list_course;
				
				let listCourseOf = listCourse || [];
				const formatedListCourse = data
					.filter(
						(course: any) => Object.values(listCourseOf).indexOf(course.id) !== -1
					)
					.map((course: any) => ({
						value: course.id,
						label: course.title,
					}));
				setListFormatCourses(formatedListCourse);
				const selectedSubject = formatedListCourse.find((item: any) => item.value === Number(subjectId));
				if (selectedSubject.value) {
					setSelectedSubject({
						value: selectedSubject.value,
						label: selectedSubject.label,
					});
					}
			}
		} catch (error) {
			console.log(error);
		}
	};
	
	useEffect (() => {
		fetchListCourses ();
		getListLesson ();
		getLevelWithCourse ();
		getListUnitByLevel ();
	}, [schoolActive?.id, subjectId, rangeAgeId, modelId, topicId, page]);
	
	function handleChangeLevelSelect (selectedOption: any) {
		setRangAgeId(selectedOption ? selectedOption?.value : "");
		setValue("unit_id", null);
		setTopicId("");
		setDefaultRangeAge(selectedOption);
	}
	
	function handleChangeModelSelect (selectedOption: any, onChange: any) {
		onChange(selectedOption ? selectedOption.value : "");
		setModelId(selectedOption ? selectedOption.value : "");
		setTopicId("");
	}
	
	function handleChangeUnitSelect (selectedOption:any) {
		setTopicId(selectedOption ? selectedOption.value : "");
		setDefaultValueTopic(selectedOption);
	}
	
	function handleChangeCourseSelect (selectedOption: any, onChange: any) {
		onChange(selectedOption ? selectedOption.value : "");
		setSubjectId(selectedOption?.value);
		setModelId(
			selectedOption?.value === COURSE_ID ? modelId : ""
		);
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
      </div>

      <div className="row ps-4">
        <Col md={3} className="nav-level-v2">
          <div className="mt-3">
            {listFormatCourses?.length > 0 && (
              <Controller
                render={({ field: { onChange, value } }: any) => (
                  <Select
                    placeholder={trans.subject}
                    className="ps-3 pt-2 mb-3"
                    options={listFormatCourses}
                    defaultValue={selectedSubject ?? null}
                    onChange={(selectedOption: any) => {
                      handleChangeCourseSelect(selectedOption, onChange);
                    }}
                  />
                )}
                name="course_id"
                control={control}
              />
            )}

            <Controller
              render={({ field: { onChange, value } }: any) => (
                <Select
                  placeholder={trans.range_age}
                  className="ps-3 pt-2 mb-3"
                  options={listLevel}
                  value={defaultRangeAge}
                  isClearable
                  onChange={(selectedOption: any) => {
                    handleChangeLevelSelect(selectedOption);
                  }}
                  components={{ Option: OptionStatus }}
                />
              )}
              name="level_id"
              control={control}
            />

            {(Number(subjectId) === COURSE_ID ||
              selectedSubject?.value === COURSE_ID) && (
              <Controller
                render={({ field: { onChange } }: any) => (
                  <Select
                    placeholder={trans.model}
                    className="ps-3 pt-2 mb-3"
                    isClearable
                    options={
                      checkTypeAccount() === TYPE_ACCOUNT_SCHOOL ||
                      TYPE_ACCOUNT_PARENTS
                        ? [
                            {
                              id: getDataModelsStorage()[0]?.models.find(
                                (model: any) => model.id !== MODE_SMART_CLASS
                              )?.id,
                              value: getDataModelsStorage()[0]?.models.find(
                                (model: any) => model.id !== MODE_SMART_CLASS
                              )?.id,
                              label: "Monkey Kindy Pro",
                            },
                            ...LEARN_MODELS_COLLAPSE,
                          ]
                        : LEARN_MODELS
                    }
                    defaultValue={
                      modelId ? LEARN_MODELS[Number(modelId) - 1] : null
                    }
                    onChange={(selectedOption: any) => {
                      handleChangeModelSelect(selectedOption, onChange);
                    }}
                  />
                )}
                name="model_id"
                control={control}
              />
            )}

            {(Number(subjectId) === COURSE_ID ||
              selectedSubject?.value === COURSE_ID) && (
              <Controller
                render={({ field: { onChange } }: any) => (
                  <Select
                    placeholder={trans.topic}
                    className="ps-3 pt-2 mb-3"
                    options={listUnit}
                    value={defaultValueTopic}
                    isClearable
                    onChange={(selectedOption: any) => {
                      handleChangeUnitSelect(selectedOption);
                    }}
                    components={{ Option: OptionStatusUnit }}
                  />
                )}
                name="unit_id"
                control={control}
              />
            )}
          </div>
        </Col>

        {!isLoadingListLesson ? (
          <Col md={9} className="ps-8 material mt-3 mb-5">
            <div className="material-wrapper row gap-6">
              {listLesson?.length > 0 ? (
                listLesson.map((lesson: any) => (
                  <TaiLieuItem
                    key={`item-${lesson.id}`}
                    title={lesson.title}
                    description={lesson.description}
                    name={lesson.name}
                    idLesson={lesson.id}
                    pathThumb={lesson.path_thumb}
                  />
                ))
              ) : (
                <div className="text-center fw-bold fs-3">
                  {trans.no_documents}
                </div>
              )}
            </div>
          </Col>
        ) : (
          <Col md={9}>
            <Loading />
          </Col>
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
            setPage(data.selected + 1);
          }}
          forcePage={page - 1}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="active"
          previousLinkClassName="page-link page-link--prev"
          nextLinkClassName="page-link page-link--next"
          hrefAllControls
        />
      )}
    </section>
  );
};

export default HoclieuV2;
