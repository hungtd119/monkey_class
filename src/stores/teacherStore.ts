import _ from "lodash";
import {
	getDetailTeacher, getDetailTeacherV2,
	getInfoAccount,
	getListTeacher, getListTeacherAndAdminSchoolBySchoolID,
	getListTeacherNotAssigned,
	getListUserRequestJoinSchool,
	getTotalTeacher, getTypeAccount
} from "src/services/common";
import { create } from "zustand";
import {addLocalStorage, checkTypeAccount} from "../selection";
import {HTTP_STATUS_CODE_OK, TYPE_ACCOUNT_ADMIN} from "../constant";
import { useSchoolStore } from "./schoolStore";
import { de } from "date-fns/locale";

export const useTeacherStore = create((set: any) => ({
  listTeacher: null,
	listTeacherAndAdminSchool: null,
  listTeacherAssigned:null,
  fetchingListTeacher: false,
  total: 0,
  typeAccount:null,
  detailTeacher: null,
  totalTeacherInSchool: null,
  listUserRequestJoinSchool: [],
  fetchingDetailTeacher: false,
  loadingListUserRequestJoinSchool: false,
  fecthingListTeacherAssiged:false,

  setListTeacher: (listTeacher: any) => set({ listTeacher }),
  fetchTypeAccount: async (params: any) => {
    const res = await getTypeAccount({});
    if (res.meta?.code === 200) {
      const typeAccount = res?.data ? res.data : [];

      set({ typeAccount });
    }
  },
  fetchListTeacher: async (params: any) => {
    set({ fetchingListTeacher: true });
    const res = await getListTeacher(params);

    if (res.meta?.code === 200) {
      const listTeacher = res?.result.data ? res.result.data : [];
      const total = res?.result.total

      set({ listTeacher, total });
    }
    set({ fetchingListTeacher: false });
  },
	fetchListTeacherAndAdminSchoolBySchoolID: async (params: any) => {
		const res = await getListTeacherAndAdminSchoolBySchoolID(params);
		
		if (res?.code === 200) {
			const listTeacherAndAdminSchool = res?.data ? res.data : [];
			
			set({ listTeacherAndAdminSchool });
		}
		set({ fetchingListTeacher: false });
	},

  fetchDetailTeacher: async (params: any) => {
    set({ fetchingDetailTeacher: true });
    const res = await getDetailTeacherV2({params});

    if (res?.code === 200) {
      const detailTeacher = res?.data ? res.data : [];

      set({ detailTeacher });
    }
    set({ fetchingDetailTeacher: false });
  },

  fetchTotalTeacherInSchool: async (params: any) => {
    const res = await getTotalTeacher(params);

    if (res?.code === 200) {
      const totalTeacherInSchool = res.data ? res.data : [];

      set({ totalTeacherInSchool });
    }
  },

  fetchListTeacherNotAssigned: async (params: any) => {
    set({ fecthingListTeacherAssiged: true });
    const res = await getListTeacherNotAssigned(params);

    if (res?.code === 200) {
      const listTeacherAssigned = res?.data ? res.data : [];

      set({ listTeacherAssigned });
    }
    set({ fecthingListTeacherAssiged: false });
  },

  fetchGetListUserJoinSchool: async () => {
    set({ loadingListUserRequestJoinSchool: true });

    try {
      const { schoolActive } = useSchoolStore.getState() as any;

      const params = {
        school_id: schoolActive?.value
      };

      const res = await getListUserRequestJoinSchool(params);

      if (res.meta.code === HTTP_STATUS_CODE_OK) {
        const listUserRequestJoinSchool = res.result;
        set({ listUserRequestJoinSchool });
      } else {
        set({ listUserRequestJoinSchool: [] });
      }
    } catch (err) {
      set({ listUserRequestJoinSchool: [] });
    } finally {
      set({ loadingListUserRequestJoinSchool: false });
    }
  }

}));
