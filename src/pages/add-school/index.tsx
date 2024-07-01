"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Container, Row } from "react-bootstrap";
import { nunito } from "@styles/font";
import InfoSchoolForm from "src/modules/AddNewSchool/InfoSchoolForm";
import CreateClassroom from "src/modules/AddNewSchool/CreateClassroom";
import RequestSchoolVerify from "src/modules/SchoolVerify";
import Head from "next/head";
import FormRequestVerifySuccess from "src/modules/SchoolVerify/FormRequestVerifySuccess";
import AddSchoolToSelectAdmin from "src/components/AddSchoolToSelect";
import { useRouter } from "next/router";
import SelectSearchSchool from "src/components/SelectSearchSchool";
import { useSchoolStore } from "src/stores/schoolStore";

const AddSchool = () => {
  const router = useRouter();
  const { role } = router.query;
  const fetchListSchool = useSchoolStore((state: any) => state.fetchListSchool);
  const listSchool = useSchoolStore((state: any) => state.listSchool);

  const [showSection, setShowSection] = useState({
    addNewSchool: true,
    infoSchool: false,
    createFormSchool: false,
    requestSchool: false,
  });

  const [selectedSchool, setSelectedSchool] = useState<any | null>(null);
  const [showRequestVerifySuccess, setShowRequestVerifySuccess] =
    useState(false);

  useEffect(() => {
    const params = {
      page: 1,
      per_page: 1000,
    };
    fetchListSchool(params);
  }, []);

  const formatListSchool = (listSchool || []).map((school: any) => ({
    value: school.id,
    label: school.name,
    address: school.address,
    isVerify: school.is_verify,
  }));

  const onSelectSchool = (value: any, section: string) => {
    section === "requestVerifySuccess"
      ? setShowRequestVerifySuccess(true)
      : setShowRequestVerifySuccess(false);
    setShowSection({
      addNewSchool: false,
      infoSchool: false,
      createFormSchool: false,
      requestSchool: false,
      [section]: true,
    });
    setSelectedSchool(value);
  };

  return (
    <>
      <Head>
        <title>Monkey Class - Thêm trường của bạn</title>
        <meta name="description" content="Thêm trường của bạn" />
      </Head>
      <div className={`bg-light min-vh-95 ${nunito.className}`}>
        <Container className="py-64">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Image
              src={`${global.pathSvg}/logo_monkey_class.svg`}
              width={164}
              height={50}
              className="d-flex"
              alt="Monkey Class"
            />

            {showSection.addNewSchool && role == "School" && (
              <AddSchoolToSelectAdmin
                onSelectSchool={onSelectSchool}
                selectedSchool={selectedSchool}
                title="Thêm trường của bạn"
                listSchool={formatListSchool}
              />
            )}

            {showSection.addNewSchool && role == "Teacher" && (
              <>
                <SelectSearchSchool
                  onSelectSchool={onSelectSchool}
                  selectedSchool={selectedSchool}
                  listSchool={formatListSchool}
                />
                {/* <p
                  onClick={() => onSelectSchool(null, "createFormSchool")}
                  className="mt-5 fw-bolder pointer"
                  style={{ color: "#3393FF", fontSize: 18 }}
                >
                  Tôi không hoạt động trong trường
                </p> */}
              </>
            )}

            {showSection.infoSchool && (
              <InfoSchoolForm
                onSelectSchool={onSelectSchool}
                selectedSchool={selectedSchool}
              />
            )}
            {/* {showSection.createFormSchool && (
              <CreateClassroom
                selectedSchool={selectedSchool}
                role={role}
              />
            )} */}
            {showSection.requestSchool && (
              <RequestSchoolVerify
                selectedSchool={selectedSchool}
                onSelectSchool={onSelectSchool}
              />
            )}
            {showRequestVerifySuccess && (
              <FormRequestVerifySuccess
                onSelectSchool={onSelectSchool}
                selectedSchool={selectedSchool}
              />
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default AddSchool;
