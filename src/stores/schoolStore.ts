import { create } from "zustand";
import { persist } from "zustand/middleware";
import _ from "lodash";
import { getListSchoolName } from "src/services/common";

export const useSchoolStore = create(
  persist(
    (set) => ({
      listClassroom: null,
      listSchool: null,
      schoolActive: null,
      showNotiVerifying: false,
      setShowNotiVerifying: (value: boolean) => set({ showNotiVerifying: value }),
      setSchoolActive: (value: any) => set({schoolActive: value}),

      fetchListSchool: async (params: any) => {
        const res = await getListSchoolName(params);

        if (res.meta?.code === 200) {
          const listSchool = res?.result.school
            ? res?.result.school
            : [];

          set({ listSchool });
        }
      },
    }),
    {
      name: "school-storage",
      getStorage: () => localStorage,
    }
  )
);
