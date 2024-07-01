import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { LIST_ROLE_NAME_FOR_TEACHER, TYPE_ACCOUNT_ADMIN, TYPE_TEACHER_MONKEY } from "src/constant";
import { globalPath } from "src/global";

const TableListTeacher = (props: any) => {
  const {
    editTeacher,
    listTeacher,
    typeAccount,
    handleShowPopupDeleteTeacher,
  } = props;
  const router = useRouter();

  const handleViewDetailTeacher = (id: number) => {
    router.push(`/chi-tiet-giao-vien/${id}`);
  };

  return (
    <>
      <Table bordered hover responsive className="text-center">
        <thead>
        <tr>
	        <th>Tên giáo viên</th>
	        <th>Email</th>
	        <th>SĐT</th>
	        <th>Vai trò</th>
	        <th>Lớp</th>
	        { typeAccount === TYPE_ACCOUNT_ADMIN && <th>Loại giáo viên</th> }
	        {/* {typeAccount === TYPE_ACCOUNT_ADMIN && <th>Tỉnh</th>}
	         {typeAccount === TYPE_ACCOUNT_ADMIN && <th>Quận/ Huyện</th>} */ }
	        <th>Thao tác</th>
        </tr>
        </thead>
	      <tbody>
          {listTeacher?.length > 0 ?
            listTeacher.map((teacher: any) => {
              return (
	              <tr key={ teacher.id }>
		              <td
			              className="pointer"
			              onClick={ () => handleViewDetailTeacher (teacher.id) }
		              >
			              { teacher.name }
		              </td>
		              <td>{ teacher.email }</td>
		              <td>{ teacher.phone }</td>
		              <td>{ teacher?.role.length > 0  ? teacher?.role.map((role : any) => <div>{LIST_ROLE_NAME_FOR_TEACHER[role]}</div>) : <></> }</td>
		              <td>{ teacher?.classroom_of_teacher && teacher?.classroom_of_teacher.length > 0 ? teacher?.classroom_of_teacher.map ((classroom: any) => <div>{ classroom.name }</div>) : <></> }</td>
		              { typeAccount === TYPE_ACCOUNT_ADMIN && (
			              <td>
				              { teacher.type === TYPE_TEACHER_MONKEY
					              ? "GV Monkey"
					              : teacher.type === null
						              ? ""
						              : "GV trường" }
			              </td>
		              ) }
		              {/* {typeAccount === TYPE_ACCOUNT_ADMIN && (
		               <td>
		               {teacher.province_details
		               ? Object.values(teacher.province_details).join(", ")
		               : ""}
		               </td>
		               )}
		               
		               {typeAccount === TYPE_ACCOUNT_ADMIN && (
		               <td>
		               {teacher.district_details
		               ? Object.values(teacher.district_details).join(", ")
		               : ""}
		               </td>
		               )} */ }
		              <td>
			              <Image
				              className="me-2"
				              src={ `${ globalPath.pathSvg }/info.svg` }
				              width={ 25 }
				              height={ 25 }
				              alt="info"
				              onClick={ () => editTeacher (teacher.id) }
			              />
			              <Image
				              src={ `${ globalPath.pathSvg }/trash.svg` }
				              width={ 30 }
				              height={ 30 }
				              alt="trash"
				              onClick={ () =>
					              handleShowPopupDeleteTeacher (teacher.id, teacher.name, teacher.role)
				              }
			              />
		              </td>
	              </tr>
              );
            }) : <tr>
	          <td colSpan={5}>Không có dữ liệu</td>
          </tr>}
        </tbody>
      </Table>
    </>
  );
};

export default TableListTeacher;
