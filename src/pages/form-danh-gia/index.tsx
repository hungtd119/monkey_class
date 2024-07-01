import React, { useState } from "react";
import Layout from "../../layout/Layout";
import { Button } from "react-bootstrap";
import FormEvaluate from "../../modules/FormDanhGia";
import Head from "next/head";

const FormDanhGia = () => {
  const [phase, setPhase] = useState<number>(1);
  const [showPhase, setShowPhase] = useState(false);

  const handleCloseModal = () => setShowPhase(false);

  const openFormDanhGia = (value: number) => {
    setPhase(value);
    setShowPhase(true);
  };
  return (
    <>
      <Head>
        <title>Monkey Class -  Bảng đánh giá</title>
        <meta name="description" content="Học liệu" />
      </Head>
      <Layout>
        <div className="d-flex justify-content-center gap-4 mt-6">
          <Button variant="primary" onClick={() => openFormDanhGia(1)}>
            GIAI ĐOẠN 1
          </Button>{" "}
          <Button variant="success" onClick={() => openFormDanhGia(2)}>
            GIAI ĐOẠN 2
          </Button>{" "}
          <Button variant="danger" onClick={() => openFormDanhGia(3)}>
            GIAI ĐOẠN 3
          </Button>{" "}
        </div>
        <FormEvaluate
          phase={phase}
          show={showPhase}
          handleClose={handleCloseModal}
        />
      </Layout>
    </>
  );
};

export default FormDanhGia;
