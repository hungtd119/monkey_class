import { create } from "zustand";
import { persist } from "zustand/middleware";
import _ from "lodash";
import { getInfoAccount, getInfoAccountAdmin, getListHoclieu, loginWithAdmin } from "src/services/common";
import {
  TYPE_ACCOUNT_ADMIN,
  TYPE_ACCOUNT_PARENTS,
} from "src/constant";
import {
  addLocalStorage,
  checkTypeAccount,
} from "src/selection";

interface AppStoreState {
  typeAccount: number | null;
  schoolId: number | null;
  courseId: number | null;
  learnModelId: number | null;
  levelId: number | null;
  unitLevelId: number | null;
  activeUnit: number | null;
  fetchingHoclieu: boolean;
  listHocLieu: any[]; // Adjust the type as needed
  dataModels: any; // Adjust the type as needed
  fetchingInfoMeta: boolean | null;
  showModalLogout: boolean;
  showButtonAcceptRequest: boolean;
  setTypeAccount: (account: number) => void;
  setListHocLieu: (listHocLieu: any) => void;
  setDataModels: (dataModels: any) => void;
  setSchoolId: (schoolId: number) => void;
  setActiveUnit: (activeUnit: number) => void;
  setCourseId: (courseId: number) => void;
  setLearnModelId: (learnModelId: number) => void;
  setLevelId: (levelId: number) => void;
  setUnitLevelId: (unitLevelId: number) => void;
  setOpenLogoutModal: (showModalLogout: boolean) => void;
  fetchHoclieu: (params: any) => Promise<any>;
  fetchDataModels: () => Promise<void>;
  loginWithAdmin: (tokenAdmin: string) => Promise<void>;
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      typeAccount: null,
      schoolId: null,
      courseId: null,
      learnModelId: null,
      levelId: null,
      unitLevelId: null,
      activeUnit: null,
      fetchingHoclieu: false,
      listHocLieu: [],
      dataModels: null,
      fetchingInfoMeta: null,
      showModalLogout: false,
      showButtonAcceptRequest: true,

      setTypeAccount: (account: number) => set({ typeAccount: account }),

      setShowButtonAcceptRequest: (value: boolean) => set({ showButtonAcceptRequest: value }),

      setListHocLieu: (listHocLieu: any) => set({ listHocLieu }),

      setDataModels: (dataModels: any) => {
        set({ dataModels });
        localStorage.setItem("dataModels", JSON.stringify(dataModels));
      },

      setSchoolId: (schoolId: number) => set({ schoolId }),

      setActiveUnit: (activeUnit: number) => set({ activeUnit }),

      setCourseId: (courseId: number) => set({ courseId }),

      setLearnModelId: (learnModelId: number) => set({ learnModelId }),

      setLevelId: (levelId: number) => set({ levelId }),

      setUnitLevelId: (unitLevelId: number) => set({ unitLevelId }),

      setOpenLogoutModal: (showModalLogout: boolean) => set({ showModalLogout }),

      fetchHoclieu: async (params: any) => {
        set({ fetchingHoclieu: true });

        const res = await getListHoclieu(params);

        if (res.meta?.code === 200) {
          const listHocLieu = _.isArray(res.result?.levels)
            ? res.result?.levels
            : [];
          set({ listHocLieu });
          set({ fetchingHoclieu: false });
          return listHocLieu;
        } else {
          set({ fetchingHoclieu: false });
        }
        set({ fetchingHoclieu: false });
      },

      fetchDataModels: async () => {
        try {
          set({ fetchingInfoMeta: true });
          const res = await getInfoAccount({});

          if (res.status === "success") {
            const listCourse = checkTypeAccount() !== TYPE_ACCOUNT_ADMIN ? res.data?.list_course : res.data?.[0]?.list_course;
            const dataModels =
              checkTypeAccount() !== TYPE_ACCOUNT_ADMIN
                ? res.data?.schools
                : res.data;
            const userId =
              checkTypeAccount() !== TYPE_ACCOUNT_ADMIN
                ? res.data?.user_id
                : res.data?.[0]?.id;
            const studentIds = checkTypeAccount() === TYPE_ACCOUNT_PARENTS ? res.data?.student_ids : [];
            set({ dataModels });
            localStorage.setItem("dataModels", JSON.stringify(dataModels));
            localStorage.setItem("userId", userId);
            localStorage.setItem("studentIds", JSON.stringify(studentIds));
            localStorage.setItem("listCourseOf", JSON.stringify(listCourse ?? []));
            addLocalStorage("accountName", checkTypeAccount() === TYPE_ACCOUNT_ADMIN ? JSON.stringify(res.data[0]?.account_name) : JSON.stringify(res.data.account_name));
            checkTypeAccount() !== TYPE_ACCOUNT_ADMIN &&
              sessionStorage.setItem("school", JSON.stringify(dataModels));
          }
        } catch (error) {
          console.error("Error fetching data models:", error);
          // Handle error if needed
        } finally {
          set({ fetchingInfoMeta: false });
        }
      },
      
      loginWithAdmin: async (tokenAdmin: string) => {
            try {
                set({ fetchingInfoMeta: true });
                const params = {
                    token: tokenAdmin
                };
                const res = await loginWithAdmin( params);
                if (res.status === "success") {
                    return res.data;
                }
            } catch (error) {
                console.error("Error fetching data models:", error);
                // Handle error if needed
            } finally {
                set({ fetchingInfoMeta: false });
            }
        },
        
        
    }),
    {
      name: "app-store",
      getStorage: () => localStorage, 
      partialize: (state) => ({ showButtonAcceptRequest: state.showButtonAcceptRequest }),
    }
  )
);
