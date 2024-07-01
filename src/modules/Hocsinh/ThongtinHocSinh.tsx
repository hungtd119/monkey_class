import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "src/components/Loading";
import useTrans from "src/hooks/useTrans";
import styles from "./Hocsinh.module.scss";
import { useStudentStore } from "src/stores/studentStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StudentInfomation from "./StudentInfomation";
import AttendenceHistory from "./AttendenceHistory";
import { getSchoolId } from "../../selection";


const ThongTinHocSinh = () => {
  const router = useRouter();
  const trans = useTrans();
  const { id, class_id } = router.query;
  const fetchingDetailStudent = useStudentStore(
    (state: any) => state.fetchingDetailStudent
  );
  const fetchDetailStudent = useStudentStore(
    (state: any) => state.fetchDetailStudent
  );
  const infoClassroom = useStudentStore((state: any) => state.infoClassroom);
  
  const [activeTab, setActiveTab] = useState('personalInfo');
  const detailStudent = useStudentStore((state: any) => state.detailStudent);

  useEffect(() => {
    fetchDetailStudent({ id,school_id:getSchoolId() });
  }, [id]);

  return (
    <>
      {!fetchingDetailStudent ? (
        <section className="info-student">
          <div className="d-flex align-items-center py-4">
            <FontAwesomeIcon icon={faChevronLeft}
              onClick={() => {
                localStorage.setItem("previousTabId", 'students');
                router.back()
              }}
              className="pe-3 pointer"
            />
            <p className="fw-bold fs-2">{detailStudent?.name}</p>
          </div>

          <div className={styles.tabs}>
            <div className={`${styles.tab__item} ${activeTab === 'personalInfo' ? styles.active : ''}`}
              onClick={() => setActiveTab('personalInfo')}
            >
              Thông tin cá nhân
            </div>
            <div className={`${styles.tab__item} ${activeTab === 'attendanceHistory' ? styles.active : ''}`}
              onClick={() => setActiveTab('attendanceHistory')}
            >
              Lịch sử điểm danh
            </div>
          </div>
          <div className={styles.tab_content}>
            {activeTab === 'personalInfo' && <StudentInfomation detailStudent={detailStudent} />}
            {activeTab === 'attendanceHistory' && <AttendenceHistory studentID={id} classroom={infoClassroom}/>}
          </div>
        </section>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ThongTinHocSinh;
