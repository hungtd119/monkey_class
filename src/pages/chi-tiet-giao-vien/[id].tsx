import FormGiaoVienAccountSchool from "src/modules/Giaovien/FormGiaoVienAccountSchool";
import Layout from "../../layout/Layout";
import Head from "next/head";
import { useEffect, useState } from "react";
import { checkTypeAccount, getToken } from "src/selection";
import { TYPE_ACCOUNT_ADMIN } from "src/constant";
import FormGiaoVienAccountAdmin from "src/modules/Giaovien/FormGiaoVienAccountAdmin";
import { useRouter } from "next/router";

const ChiTietHocSinh = () => {
  const router = useRouter()
  const [typeAccount, setTypeAccount] = useState(null);

  useEffect(() => {
    if(!getToken()) {
      router.push("/sign-in")
    }
    setTypeAccount(checkTypeAccount());
  }, []);

  return (
    <>
      <Head>
        <title>Monkey Class - Chi tiết giáo viên</title>
        <meta name="description" content="Chi tiết giáo viên" />
      </Head>
      <Layout>
        {typeAccount === TYPE_ACCOUNT_ADMIN ? <FormGiaoVienAccountAdmin /> : <FormGiaoVienAccountSchool />}
      </Layout>
    </>
  );
};

export default ChiTietHocSinh;
