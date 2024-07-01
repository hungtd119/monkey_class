import React from "react";
import Head from "next/head";
import RequestSchoolVerify from "src/modules/SchoolVerify";
import { Container } from "react-bootstrap";
import { nunito } from "@styles/font";

const SchoolVerify = () => {

  return (
    <>
      <Head>
        <title>Monkey Class - Xác thực trường</title>
        <meta name="description" content="Xác thực trường" />
      </Head>
      <div
      className={`bg-light min-vh-95 dark:bg-transparent ${nunito.className}`}
    >
      <Container className="py-64">
        {/* <RequestSchoolVerify /> */}

      </Container>
    </div>

    </>
  );
};

export default SchoolVerify;
