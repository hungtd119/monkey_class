import { getDetailHomework, getListClassroomAssignHomework, getListHomework, progressHomework } from "src/services/common";
import { create } from "zustand";

export const useHomeworkStore = create((set: any) => ({
  listHomework: null,
  fetchingListHomework: false,
  progessHomework: null,
  fetchingProgressHomework: false,
  detailHomework: null,
  fetchingDetailHomework: false,
  listClassroomAssignHomework: null,
  infoLessonNeedAssign: {},

  setInfoLessonNeedAssign: (infoLessonNeedAssign: any) => set({ infoLessonNeedAssign }),
  setListHomework: (listHomework: any) => set({ listHomework }),
  setProgressHomework: (progessHomework: any) => set({ progessHomework }),
  setDetailHomework: (detailHomework: any) => set({ detailHomework }),
  setListClassroomAssignHomework: (listClassroomAssignHomework: any) => set({ listClassroomAssignHomework }),

  fetchListHomework: async (params: any) => {
    set({ fetchingListHomework: true });
    const res = await getListHomework(params);

    if (res.status === "success") {
      const listHomework = res?.data ? res?.data : [];

      set({ listHomework });
    }
    set({ fetchingListHomework: false });
  },

  fetchProgressHomework: async (params: any) => {
    set({ fetchingProgressHomework: true });
    const res = await progressHomework(params);

    if (res.status === "success") {
      const progessHomework = res?.data ? res?.data : [];

      set({ progessHomework });
    }
    set({ fetchingProgressHomework: false });
  },

  fetchDetailHomework: async (params: any) => {
    set({ fetchingDetailHomework: true });
    const res = await getDetailHomework(params);

    if (res.status === "success") {
      const detailHomework = res?.data ? res?.data : [];

      set({ detailHomework });
    }
    set({ fetchingDetailHomework: false });
  },

  fetchListClassroomAssignHomework: async (params: any) => {
    const res = await getListClassroomAssignHomework(params);

    if (res.status === "success") {
      const listClassroomAssignHomework = res?.data ? res?.data : [];

      set({ listClassroomAssignHomework });
    }
  },
}));
