import _ from "lodash";
import {
	getDetailStudent,
	getDetailStudentV2,
	getListStudent,
	getListStudentInClass,
	getListStudentV2
} from "src/services/common";
import { create } from "zustand";

export const useStudentStore = create((set: any) => ({
  listStudent: null,
  fetchingStudent: false,
  totalOverview: 0,
  total: 0,
  detailStudent: null,
  fetchingDetailStudent: false,
  infoClassroom: null,
  listStudentInClass: null,

  setListStudent: (listStudent: any) => set({ listStudent }),
  setListStudentinClass: (listStudentInClass: any) => set({ listStudentInClass }),

  fetchListStudent: async (params: any) => {
    set({ fetchingStudent: true });
    const res = await getListStudentV2(params);

    if (res?.code === 200) {
      const listStudent = res?.data ? res.data : [];
      // const totalOverview = res?.result.overview.count;
      const total = res?.meta.total

      set({ listStudent, total });
    }
    set({ fetchingStudent: false });
  },

  fetchListStudentInClass: async (params: any) => {
    const res = await getListStudentInClass(params);
    if (res?.code === 200) {
      const listStudentInClass = res?.data ? res?.data : [];

      set({ listStudentInClass });
      return listStudentInClass
    }
  },

  fetchDetailStudent: async (params: any) => {
    set({ fetchingDetailStudent: true });
    const res = await getDetailStudentV2(params);

    if (res?.code === 200) {
      const detailStudent = res?.data.student_info ? res.data.student_info : [];
      const infoClassroom = res?.data.classrooms ? res.data.classrooms : [];
      set({ detailStudent, infoClassroom });
    }
    set({ fetchingDetailStudent: false });
  }

}));
