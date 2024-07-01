import Layout from "../../layout/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import TabsClassroom from "src/modules/Lop-hoc/Tabs";
import { getToken } from "src/selection";

const DanhSachGiaoVien = () => {
  const router= useRouter();
  useEffect(()=> {
    if(!getToken()) {
      router.push("/sign-in")
    }
  },[])

  return (
    <>
      <Head>
        <title>Monkey Class -  Chi tiết lớp học</title>
        <meta name="description" content="Chi tiết lớp học" />
      </Head>
      <Layout>
       <TabsClassroom />
      </Layout>
    </>
  );
};

export default DanhSachGiaoVien;
