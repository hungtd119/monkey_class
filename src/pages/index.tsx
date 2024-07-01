import { NextPage } from 'next';
import Head from 'next/head';
import useTrans from '../hooks/useTrans';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { clearDataUser } from 'src/services/auth';
import { cleanLocalStorage, cleanSessionStorage } from 'src/selection';
import { useAppStore } from 'src/stores/appStore';
import { useRouter } from 'next/router';
import { set } from 'date-fns';
import Loading from 'src/components/Loading';
import SignIn from './sign-in';

const DangNhap: NextPage = () => {
  const router = useRouter();
  const trans = useTrans();
  const fetchDataModels = useAppStore((state: any) => state.fetchDataModels);
  const [loading, setLoading] = useState(true);
  const loginAuto = async (accessToken: string) => {
    if (accessToken !== "") {
      Cookies.set("access_token", accessToken, {
        expires: 1,
      });
      const isViewV1 = await fetchDataModels();

      if (isViewV1) {
        router.push("/hoc-lieu")
      } else {
        router.push("/danh-sach-lop-hoc");
      }
      return true;
    }
    return false;
  }

  useEffect(() => {
    // Clear data user last login
    const accessToken = localStorage.getItem("access_token") || "";
    loginAuto(accessToken).then(res => {
      setLoading(res);
      if (!res) {
        clearDataUser();
        cleanLocalStorage();
        cleanSessionStorage();
      }
    })
  }, []);

  return (
    <>
      {
        !loading ? <>
          <Head>
            <title>{trans.login.login}</title>
            <meta name="description" content={trans.login.login} />
          </Head>
          <SignIn />
        </> : <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Loading />
        </div>
      }
    </>
  );
};

export default DangNhap;
