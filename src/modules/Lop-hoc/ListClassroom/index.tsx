import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import useTrans from "src/hooks/useTrans";
import PopupCreateClass from "../PopupCreateClass";
import LopHoc from "../ListBaiHoc";
import { checkTypeAccount, getLevelClassroom, getModelClassroom } from "src/selection";
import { TYPE_ACCOUNT_ADMIN } from "src/constant";
import { useClassroomStore } from "src/stores/classroomStore";
import Loading from "src/components/Loading";

const DanhsachLophoc = () => {
  const router = useRouter();

  const trans = useTrans();

  const listClassroom = useClassroomStore((state: any) => state.listClassroom);
  const fetchListClassroom = useClassroomStore((state: any) => state.fetchListClassroom);
  const fetchingClassroom = useClassroomStore((state: any) => state.fetchingClassroom);

  const storedSchoolData =
    typeof sessionStorage !== "undefined" && sessionStorage.getItem("school");
  const dataSchool = storedSchoolData ? JSON.parse(storedSchoolData) : null;
  const [typeAccount, setTypeAccount] = useState(null); // dung local storage nen SSR bi loi phai dung state de goi o client
  const [showPopupCreateClass, setShowPopupCreateClass] = useState(false);
  const [showDetailClassroom, setShowDetailClassroom] = useState(false);
  const [idClassroomActive, setIdClassroomActive] = useState<number | null>(null);

  const isAdmin = typeAccount === TYPE_ACCOUNT_ADMIN;

  useEffect(() => {
    setTypeAccount(checkTypeAccount());
    fetchListClassroom();
  }, []);


  const showPopupCreate = () => {
    setShowPopupCreateClass(true);
  };

  const handleShowDetailClassroom = (id: number) => {
    setShowDetailClassroom(!showDetailClassroom);
    setIdClassroomActive(id);
  };


  const handleRedirectPage = () => {
    // router.push('/truong-hoc');
  };

  return (
    <>
      {!showDetailClassroom ? (
        <section className="info-class px-3">
          {/* <div className="d-flex align-items-center header-classes mt-3 mb-6 gap-2">
            <Image
              src={`${global.pathSvg}/icon-home.svg`}
              width={36}
              height={36}
              alt="home"
              onClick={() => handleRedirectPage()}
            />
            <i
              className="fa fa-angle-left fs-4 ms-3 pointer"
              aria-hidden="true"
              onClick={() => handleRedirectPage()}
            />
          </div> */}
          {/* <div className="d-flex justify-content-between">
            <p className="fw-bold">{trans.list_classroom}</p>
            {isAdmin && (
              <Button
                variant="button"
                className="d-flex align-items-center text-white gap-3"
                onClick={() => showPopupCreate()}
              >
                <i className="fa fa-plus" aria-hidden="true" />
                <span>{trans.create_classroom}</span>
              </Button>
            )}
          </div> */}

          {!fetchingClassroom ? <div className="row classrooms gap-8">
            {(listClassroom || []).map((classroom: any, index: number) => (
              <Col className="col-classroom mt-72" sm={6} md={4} key={index}>
                <div className="fw-bold fs-2 pt-4 ps-5">
                  <p>{classroom.name}</p>
                  <p>{trans.model}: {getModelClassroom(classroom.model_id)}</p>
                  <p>{trans.rank}: {getLevelClassroom(classroom.level_id)}</p>
                  <p>{trans.progress_class}: {classroom.count}/{classroom.total_count} buổi </p>
                </div>
                <div className="d-flex justify-content-end px-4 pb-3">
                  <Image
                    src={`${global.pathSvg}/icon-in-class.svg`}
                    width={35}
                    height={35}
                    alt="icon"
                    onClick={() => handleShowDetailClassroom(classroom.id)}
                  />
                </div>
              </Col>
            ))}
          </div> : <Loading />}
        </section>
      ) : (
        <LopHoc
          handlePreviousPage={() => setShowDetailClassroom(false)}
          idClassroom={idClassroomActive}
        />
      )}

      <PopupCreateClass
        show={showPopupCreateClass}
        onClose={() => setShowPopupCreateClass(false)}
      />
    </>
  );
};

export default DanhsachLophoc;
