import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../layout/Layout";
import AssignHomeWork from "src/modules/GiaoBaiTap/AssignHomeWork";
import { getToken } from "src/selection";

const GiaoBaiTapPage = () => {
  const router= useRouter();
  useEffect(()=> {
    if(!getToken()) {
      router.push("/sign-in")
    }
  },[])

  return (
    <>
      <Head>
        <title>Monkey Class -  Giao bài tập</title>
        <meta name="description" content="Giao bài tập" />
      </Head>
      <Layout>
        <AssignHomeWork />
      </Layout>
    </>
  );
};

export default GiaoBaiTapPage;
