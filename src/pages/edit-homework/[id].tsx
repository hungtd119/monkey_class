import dynamic from "next/dynamic";
import Layout from "../../layout/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getToken } from "src/selection";
const EditAssignHomeworkForClassroom = dynamic(() => import('../../modules/GiaoBaiTap/EditAssignHomeworkForClassroom'), { ssr: false })
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
        <EditAssignHomeworkForClassroom />
      </Layout>
    </>
  );
};

export default GiaoBaiTapPage;
