import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Table } from "react-bootstrap";
import { RangeAge, TYPE_ACCOUNT_PARENTS, TYPE_ACCOUNT_TEACHER } from "src/constant";
import { globalPath } from "src/global";

const TableListClassroom = (props: any) => {
  const { listClassroom, handleShowFormEditClass, handleShowPopupDeleteClass, listTeacherInClass, typeAccount } = props;
  const router = useRouter();

  const handleViewDetailClass = (id: number, className: any) => {
    const dataClass = {id, className}
    localStorage.setItem("className", JSON.stringify(dataClass));
    router.push(`/chi-tiet-lop-hoc/${id}`);
  };

  return (
    <>
      <Table bordered hover responsive className="text-center mb-8">
        <thead>
          <tr>
            <th>Tên lớp</th>
            <th>Số học sinh</th>
            <th>Độ tuổi</th>
            <th>Giáo viên chủ nhiệm</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {listClassroom?.length > 0 ? (
            (listClassroom || []).map((classroom: any, index: number) => {
              const ageRange = RangeAge.find(rangeAge=>rangeAge.value === classroom.age);
              const teacherNames = classroom.classroom_has_teacher?.map((teacherInfo: any) => teacherInfo?.name).join('<br />');
              return (
                <tr key={index}>
                  <td
                    className="pointer"
                    onClick={() => handleViewDetailClass(classroom.id, classroom.name)}
                  >
                    {classroom.name}
                  </td>
                  <td>{classroom.total_student ?? 0}</td>
                  <td>{ageRange ? ageRange.label : ""}</td>
                  <td dangerouslySetInnerHTML={{ __html: teacherNames }} />
                  <td>
                    <Image
                      className="me-2"
                      src={`${globalPath.pathSvg}/info.svg`}
                      width={25}
                      height={25}
                      alt="info"
                      onClick={() => handleShowFormEditClass(classroom.id)}
                    />
                    {typeAccount !== TYPE_ACCOUNT_TEACHER && <Image
                      src={`${globalPath.pathSvg}/trash.svg`}
                      width={30}
                      height={30}
                      alt="trash"
                      onClick={()=> handleShowPopupDeleteClass(classroom.id,classroom.name)}
                    />}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5}>Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default TableListClassroom;
