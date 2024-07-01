import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getListNotification, updateReadNotification } from 'src/services/common';
import { HTTP_STATUS_CODE_OK } from 'src/constant';
import { getSchoolId, getUserIdFromSession } from 'src/selection';

interface NotificationState {
  listNoti: any[];
  totalNoti: number;
  isShowNotificationVerify: boolean;
  fetchNotifications: (schoolId?: string) => void;
  fetchReadNotification: (id: number[]) => void;
  setIsShowNotificationVerify: (value: boolean) => void;
}

const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      listNoti: [],
      totalNoti: 0,
      totalNotiUnread: 0,
      isShowNotificationVerify: false,
      setIsShowNotificationVerify: (value: boolean) => set({ isShowNotificationVerify: value }),
      fetchNotifications: (schoolId) => {
        const params = {
          school_id: schoolId,
        };
        getListNotification(params)
          .then((res: any) => {
            if (res.meta.code === HTTP_STATUS_CODE_OK) {
              set({
                listNoti: res.result?.notifications,
                totalNoti: res.result?.total,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      fetchReadNotification: (id: number[]) => {
        const params = {
          notification_ids: id,
          school_id: getSchoolId() || getUserIdFromSession()
        }
        updateReadNotification(params).then((res: any)=> {
          if(res.meta.code === HTTP_STATUS_CODE_OK){
            set({ totalNoti: res.result.total_unread })
          }
        }).catch((err: any) => {
          console.log(err)
        })
      }
    }),
    {
      name: 'notification-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useNotificationStore;
