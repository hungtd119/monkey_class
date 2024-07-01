import { getDetailLesson, getLessonByParams } from "src/services/common";
import { create } from "zustand";

export const useTaiLieuStore = create((set: any) => ({
  listLesson: null,
  fetchingLesson: false,
  total: 0,
  listLessonTruyenTho: null,
  totalLessonTruyenTho: 0,
  fetchingLessonTruyenTho: false,
  detailLesson: null,
  fetchingDetailLeson: null,

  subjectId: null,
  rangeAgeId: null,
  modelId: null,
  topicId: null,
  page: null,

  setListLesson: (listLesson: any) => set({ listLesson }),
  setSubjectId: (subjectId: any) => set({ subjectId }),
  setRangAgeId: (rangeAgeId: any) => set({ rangeAgeId }),
  setModelId: (modelId: any) => set({ modelId }),
  setTopicId: (topicId: any) => set({ topicId }),
  setPage: (page: any) => set({ page }),

  fetchListLesson: async (params: any) => {
    set({ fetchingLesson: true });
    const res = await getLessonByParams(params);

    if (res.meta?.code === 200) {
      const listLesson = res?.result.data ? res?.result.data : [];
      const total = res?.result.total

      set({ listLesson, total });
    }
    set({ fetchingLesson: false });
  },

  fetchListLessonTruyenTho: async (params: any) => {
    set({ fetchingLessonTruyenTho: true });
    const res = await getLessonByParams(params);

    if (res.meta?.code === 200) {
      const listLessonTruyenTho = res?.result.data ? res?.result.data : [];
      const totalLessonTruyenTho = res?.result.total

      set({ listLessonTruyenTho, totalLessonTruyenTho });
    }
    set({ fetchingLessonTruyenTho: false });
  },

  fetchDetailLesson: async (params: any)  => {
    set({ fetchingDetailLeson: true });
    const res = await getDetailLesson(params);
    if (res.meta?.code === 200) {
      const detailLesson = res?.result ? res?.result : [];
      set({ detailLesson });
      set({ fetchingDetailLeson: false });
      return detailLesson;
    } else {
      set({ fetchingDetailLeson: false });
    }
  },

}));
