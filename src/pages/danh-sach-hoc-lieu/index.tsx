import React, { useEffect } from "react";
import Head from "next/head";
import Layout from "../../layout/Layout";
import { useRouter } from "next/router";
import { getToken } from "src/selection";
import HoclieuV2 from "src/modules/Hoc-lieu/HocLieuV2";
const titlePage = "Monkey Class -  Học liệu";

const HoclieuPage = () => {
  const router= useRouter();
  useEffect(()=> {
    if(!getToken()) {
      router.push("/sign-in")
    }
  },[])

  return (
    <>
      <Head>
        <title>{titlePage}</title>
        <meta name="description" content="Học liệu" />
      </Head>
      <Layout>
        <HoclieuV2 />
      </Layout>
    </>
  );
};

export default HoclieuPage;
