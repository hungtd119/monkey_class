import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Table } from "react-bootstrap";
import { globalPath } from "src/global";
import { useRouter } from "next/router";
import { formatTimestampToYYYYMMDD } from "src/selection";
import PopupProgressHomeWork from "../GiaoBaiTap/PopupProgressHomeWork";
import { useHomeworkStore } from "../../stores/homeworkStore";
import PopupDeleteActivity from "../GiaoBaiTap/PopupDeleteActivity";
import { deleteActivityHomework } from "src/services/common";
import { toast } from "react-toastify";
import Loading from "src/components/Loading";

const BaiTapVeNha = (props: any) => {
  const { id } = props;

  const [showPopupProgressHomeWork, setShowPopupProgressHomework] = useState(false);
  const [processHomework, setProcessHomework] = useState({});
  const [dataActivityDelete, setDataActivityDelete] = useState<any>()
  const [showPopupDeleteActivity, setShowPopupDeleteActivity] = useState(false);
  const router = useRouter();

  const listHomework = useHomeworkStore((state: any) => state.listHomework);
  const fetchListHomework = useHomeworkStore((state: any) => state.fetchListHomework);
  const fetchingListHomework = useHomeworkStore((state: any) => state.fetchingListHomework);

  const handleEditAssignHomework = (id: number) => {
    localStorage.setItem("isAssignOneClass", String(false));
    router.push(`/edit-homework/${id}`);
  };
  const handleShowProgressHomework = (homework: any) => {
    setProcessHomework(homework?.assign_home_work_students);
    setShowPopupProgressHomework(true);
  }

  const handleDeleteActivity = (id: number, activityName: string) => {
    setDataActivityDelete({ id, name: activityName })
    setShowPopupDeleteActivity(true);
  }

  const onSubmitDeleteActivity = () => {
    deleteActivityHomework({ id: dataActivityDelete.id }).then((res: any) => {
      if (res.data.status === 'success') {
        toast.success("Xóa hoạt động thành công!");
        setShowPopupDeleteActivity(false);
        fetchListHomework({ class_id: id })
      }
    }).catch((err: any) => {
      toast.error("Xóa hoạt động thất bại!")
    })
  }

  useEffect(() => {
    fetchListHomework({ class_id: id });
  }, [id]);

  return (
    <div className="info-homework">
      {
        !fetchingListHomework ? <Table bordered hover responsive className="text-center mb-8">
        <thead>
          <tr>
            <th>Hoạt động</th>
            <th>Giao cho</th>
            <th>Ngày bắt đầu</th>
            <th>Hạn làm bài</th>
            <th>Tiến độ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {listHomework?.length > 0 ? (
            (listHomework || []).map((homework: any) => {
              return (
                <>
                  <tr key={homework.id}>
                    <td>
                      <div className="mb-6 mt-4">
                        <div className="d-flex gap-7">
                          <img
                            src={
                              homework.path_thumb !== ""
                                ? `${process.env.NEXT_PUBLIC_CDN}upload/cms_platform/thumb/activity/hdr/${homework.path_thumb}`
                                : `/${globalPath.pathImg}/default.png`
                            }
                            width={130}
                            height={84}
                            alt="default act"
                          />
                          <div className="d-flex flex-column justify-content-around">
                            <p className="fw-bold fs-2 text-start">
                              {homework.name}
                            </p>
                            <p className="text-story text-start">
                              {homework.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {homework.students > 0 ? homework.students : 0} học sinh
                    </td>
                    <td>{formatTimestampToYYYYMMDD(homework?.start_date)}</td>
                    <td>{formatTimestampToYYYYMMDD(homework.end_date)}</td>
                    <td
                      className="pointer"
                      onClick={() => handleShowProgressHomework(homework)}
                    >
                      {homework.student_done}/{homework.students}
                    </td>
                    <td>
                      <Image
                        className="me-2"
                        src={`${globalPath.pathSvg}/trash.svg`}
                        width={30}
                        height={30}
                        alt="trash"
                        onClick={() =>
                          handleDeleteActivity(homework.id, homework.name)
                        }
                      />
                      <Image
                        src={`${globalPath.pathSvg}/edit.svg`}
                        width={25}
                        height={25}
                        alt="info"
                        onClick={() => handleEditAssignHomework(homework.id)}
                      />
                    </td>
                  </tr>
                </>
              );
            })
          ) : (
            <tr>
              <td colSpan={6}>Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
        {showPopupProgressHomeWork && (
          <PopupProgressHomeWork
            show={showPopupProgressHomeWork}
            handleClose={() => setShowPopupProgressHomework(false)}
            progessHomework={processHomework}
          />
        )}
      </Table> : <Loading/>
      }
      {showPopupDeleteActivity && (
        <PopupDeleteActivity
          show={showPopupDeleteActivity}
          handleClose={() => setShowPopupDeleteActivity(false)}
          dataActivityDelete={dataActivityDelete}
          onSubmit={onSubmitDeleteActivity}
        />
      )}
    </div>
  );
};

export default BaiTapVeNha;
