import _ from "lodash";
import {
	getAllSchool,
	getDetailClassroom, getDetailClassroomV2,
	getListClassroom,
	getListClassroomSmart, getListClassroomV2,
	getListSchool,
	getTotalClassroom, getTotalStudent, getTotalTeacher,
	getUnitLesson
} from "src/services/common";
import { create } from "zustand";

export const useClassroomStore = create((set) => ({
  listUnitLesson: null,
	currentSchedule: null,
	// optionalSchedule: null,
  fetchingUnitLesson: false,
  listClassroomSmart: null,
  listClassroom: null,
  detailClassroom: null,
  listSchool: null,
  listTeacherInClass: null,
  total: 0,
  totalClassroom: 0,
  totalTeacher: 0,
  totalStudent: 0,
  overview: null,
  listAllSchool: null,
  fetchingClassroom: false,
  fetchingDetailClassroom: false,

  setListUnitLesson: (listUnitLesson: any) => set({ listUnitLesson }),
  setListClassroomSmart: (listClassroomSmart: any) => set({ listClassroomSmart }),
  setListClassroom: (listClassroom: any) => set({ listClassroom }),
  setDetailClassroom: (detailClassroom: any) => set({ detailClassroom }),

  fetchDataUnitLesson: async (params: any) => {
    set({ fetchingUnitLesson: true });
    const res = await getUnitLesson(params);

    if (res.meta?.code === 200) {
      const listUnitLesson = _.isArray(res.result['list_levels']['levels'])
        ? res.result['list_levels']['levels']
        : [];
      set({ listUnitLesson });
	    set({ currentSchedule: res.result['current_schedule'] });
	    // set({ optionalSchedule: res.result['optional_schedule'] });
    }
    set({ fetchingUnitLesson: false });
  },

  fetchListClassroom: async (params: any) => {
    set({ fetchingClassroom: true });
    const res = await getListClassroomV2(params);

    if (res.meta?.code === 200) {
      const listClassroom = res?.result.data
        ? res.result?.data
        : [];
      const total = res?.result?.total || 0;

      set({ listClassroom,  total });
    }
    set({ fetchingClassroom: false });
  },

  fetchAllListSchools: async (params: any) => {
    const res = await getAllSchool(params);

    if (res.meta?.code === 200) {
      const listAllSchool = res?.result
        ? res.result
        : [];

      set({ listAllSchool });
    }
  },

  fetchDetailClassroom : async (params: any) => {
    set({ fetchingDetailClassroom: true });
    const res = await getDetailClassroomV2(params);

    if (res.meta?.code === 200) {
      const detailClassroom = res?.result
        ? res.result
        : [];

      set({ detailClassroom });
    }
    set({ fetchingDetailClassroom: false });
  },

  fetchListSchool : async (params: any) => {
   
    const res = await getListSchool(params);

    if (res.meta?.code === 200) {
      const listSchool = res?.result.data
        ? res?.result.data
        : [];

      set({ listSchool });
    }
  },

  fetchTotalClassroom: async (params: any) => {

    const res = await getTotalClassroom(params);

    if (res?.code === 200) {
      const totalClassroom = res?.data
          ? res?.data
          : [];

      set({
        totalClassroom
      });
    }
  },
  fetchTotalTeacher : async (params: any) => {

    const res = await getTotalTeacher(params);

    if (res?.code === 200) {
      const totalTeacher = res?.data
          ? res?.data
          : [];

      set({ totalTeacher });
    }
  },
  fetchTotalStudent : async (params: any) => {

    const res = await getTotalStudent(params);

    if (res?.code === 200) {
      const totalStudent = res?.data
          ? res?.data
          : [];

      set({ totalStudent });
    }
  },
}));
