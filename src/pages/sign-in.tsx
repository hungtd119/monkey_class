import Head from "next/head";
import Image from "next/image";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { globalPath } from "src/global";
import { nunito } from "@styles/font";
import { NextPage } from "next";
import DangNhap from "src/modules/DangNhap/DangNhap";

const SignIn: NextPage = () => {

  return (
    <>
        <Head>
          <title>Monkey Class - Đăng nhập tài khoản </title>
          <meta name="description" content="Đăng nhập tài khoản" />
        </Head>
        <div
          className={`bg-light min-vh-95 d-flex flex-row align-items-center dark:bg-transparent ${nunito.className}`}
        >
          <Container>
            <Col className="rounded-4">
              <Row>
                <DangNhap />

                <Col className="p-0 hide-mobile">
                  <Image
                    fill
                    priority
                    className="h-100 position-relative rounded-right-16"
                    src={`${globalPath.pathImg}/img_sign_up.png`}
                    alt="Login"
                  />
                </Col>
              </Row>
            </Col>
          </Container>
        </div>
      );
    </>
  );
};

export default SignIn;
