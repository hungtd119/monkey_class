import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import NotificationHeader from "src/components/NotificationHeader";
import useNotificationStore from "src/stores/notiStore";
import { acceptRequestJoinSchool } from "src/services/common";
import { getSchoolId } from "src/selection";
import { toast } from "react-toastify";
import { HTTP_STATUS_CODE_OK } from "src/constant";
import { useAppStore } from "src/stores/appStore";

export default function HeaderNotificationNav(props: any) {
  const router = useRouter();
  const { s } = router.query;
  const [showNoti, setShowNoti] = useState(false);
  const [loading, setLoading] = useState(false);

  const { listNoti, totalNoti, fetchNotifications, fetchReadNotification } = props;
  const { showButtonAcceptRequest, setShowButtonAcceptRequest } = useAppStore((state: any) => ({
    showButtonAcceptRequest: state.showButtonAcceptRequest,
    setShowButtonAcceptRequest: state.setShowButtonAcceptRequest,
  }))

  const handleOpenNoti = () => {
    setShowNoti(prevShowNoti => {
      const params = listNoti.filter((item: any) => item.id !== undefined).map((item: any) => item.id);
      if (params.length > 0 && !prevShowNoti) {
        fetchReadNotification(params);
      }
      const newShowNoti = !prevShowNoti;
      setShowButtonAcceptRequest(!newShowNoti);
      return newShowNoti;
    });
  };

  const handleAcceptOrRejectRequestSchool = (status: number, userId: number, role: string) => {
    const params = {
      school_id: s || getSchoolId(),
      user_id: userId,
      status,
      role,
    };
    setLoading(true);
    acceptRequestJoinSchool(params)
      .then((res) => {
        if (res.meta.code === HTTP_STATUS_CODE_OK) {
          toast.success("Cập nhật thành công!");
          fetchNotifications(s as string);
        } else {
          toast.error("Cập nhật thất bại!");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Đã xảy ra lỗi!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const notificationDropdown = document.getElementById('notification-dropdown');
      
      if (notificationDropdown) {
        const rect = notificationDropdown.getBoundingClientRect();
        const isClickInside = (
          event.clientX >= rect.left - 50 &&
          event.clientX <= rect.right + 50 &&
          event.clientY >= rect.top - 50 &&
          event.clientY <= rect.bottom + 50
        );
  
        if (!isClickInside && 
            !notificationDropdown?.contains(event.target as Node)) {
          setShowNoti(false);
          setShowButtonAcceptRequest(true);
        }
      }
    };

    if (showNoti) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showNoti]);

  return (
    <>
      <Nav style={{ backgroundColor: "#ccc", borderRadius: "50%" }}>
        <Nav.Item onClick={handleOpenNoti} id="notification-icon">
          <div className="p-2 pointer">
            <FontAwesomeIcon icon={faBell} size="lg" />
          </div>
        </Nav.Item>
      </Nav>
      <div className="noti-number d-flex align-items-center justify-content-center">
        <span className="fw-bold">{totalNoti}</span>
      </div>

      {showNoti && (
          <NotificationHeader
            listNoti={listNoti}
            handleAcceptOrRejectRequestSchool={handleAcceptOrRejectRequestSchool}
            loading={loading}
          />
      )}
    </>
  );
}
