"use client";
import React from "react";
import Head from "next/head";
import XemChiTietHocLieu from "src/modules/XemChiTietHocLieu";

const titlePage = "Monkey Class - Xem tài liệu";

const ViewDetailMaterial = () => {

  return (
    <>
      <Head>
        <title>{titlePage}</title>
        <meta name="description" content="Học liệu" />
      </Head>
      <XemChiTietHocLieu />
    </>
  );
};

export default ViewDetailMaterial;
