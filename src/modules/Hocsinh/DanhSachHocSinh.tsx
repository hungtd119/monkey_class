import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import {TYPE_ACCOUNT_ADMIN, TYPE_ACCOUNT_TEACHER} from "src/constant";
import { globalPath } from "src/global";
import { formatTimestampToYYYYMMDD } from "src/selection";

const TableListStudent = (props: any) => {
  const {
    typeAccount,
    handleChangeClass,
    handleDeleteStudent,
    fetchingStudent,
    listStudent,
    classID,
  } = props;
  const router = useRouter();
  const { pathname } = router;

  const handleViewDetailStudent = (id: number,classID:number) => {
    router.push(`/chi-tiet-hoc-sinh/${id}?class_id=${classID}`);
  };
  const isDanhSachHocSinhPage = pathname.includes('danh-sach-hoc-sinh');

  const isShowButtonChangeClass = typeAccount !== TYPE_ACCOUNT_ADMIN && !isDanhSachHocSinhPage;

  return (
    <>
      {!fetchingStudent && (
        <Table bordered hover responsive className="text-center mb-8">
          <thead>
            <tr>
              <th>Tên học sinh</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Tên bố/ mẹ</th>
              <th>Email bố/ mẹ</th>
              <th>SĐT phụ huynh</th>
              {/* {typeAccount === TYPE_ACCOUNT_ADMIN && <th>Trường</th>} */}
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {listStudent?.length > 0 ? (
              (listStudent || []).map((student: any, index: number) => {
                return (
                  <tr key={index}>
                    <td
                      className="pointer"
                      onClick={() => handleViewDetailStudent(student.id,classID)}
                    >
                      {student.name}
                    </td>
                    <td>{student.gender === 1 ? "Nam" : "Nữ"}</td>
                    <td>{formatTimestampToYYYYMMDD(student.date_of_birth)}</td>
                    <td>{student.parent_name}</td>
                    <td>{student?.email ?? ""}</td>
                    <td>{student?.phone ?? ""}</td>
                    {/* {typeAccount === TYPE_ACCOUNT_ADMIN && (
                      <td>{student?.school_name ?? ""}</td>
                    )} */}
                    <td>
                      <Image
                        className="me-2"
                        src={`${globalPath.pathSvg}/info.svg`}
                        width={25}
                        height={25}
                        onClick={() => handleViewDetailStudent(student.id,classID)}
                        alt="rotate"
                      />
                      {isShowButtonChangeClass && <Image
                        className="me-2"
                        src={`${globalPath.pathSvg}/rotate.svg`}
                        width={38}
                        height={38}
                        alt="trash"
                        hidden={typeAccount === TYPE_ACCOUNT_TEACHER}
                        onClick={() => handleChangeClass(student.id)}
                      />}
                      {
                        typeAccount !== TYPE_ACCOUNT_TEACHER ? <Image
                            className="me-2"
                            src={`${globalPath.pathSvg}/trash.svg`}
                            width={30}
                            height={30}
                            onClick={() =>
                                handleDeleteStudent(student.id, student.name, student.user_id)
                            }
                            alt="trash"
                        />:<></>
                      }
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TableListStudent;
