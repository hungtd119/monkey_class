import React, { useEffect } from "react";
import Head from "next/head";
import Hoclieu from "../../modules/Hoc-lieu"
import Layout from "../../layout/Layout";
import { useRouter } from "next/router";
import { getToken } from "src/selection";
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
        <Hoclieu />
      </Layout>
    </>
  );
};

export default HoclieuPage;
