import Layout from "../../layout/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ThongTinHocSinh from "src/modules/Hocsinh/ThongtinHocSinh";
import { getToken } from "src/selection";
const ChiTietHocSinh = () => {
  const router= useRouter();
  useEffect(()=> {
    if(!getToken()) {
      router.push("/sign-in")
    }
  },[])
  return (
    <>
      <Head>
        <title>Monkey Class - Chi tiết học sinh</title>
        <meta name="description" content="Chi tiết học sinh" />
      </Head>
      <Layout>
       <ThongTinHocSinh />
      </Layout>
    </>
  );
};

export default ChiTietHocSinh;
