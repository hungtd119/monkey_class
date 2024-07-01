import TongQuanHocsinh from "src/modules/Hocsinh/TongQuanHocsinh";
import Layout from "../../layout/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getSchoolId, getToken } from "src/selection";
import { useSchoolStore } from "src/stores/schoolStore";
import Image from "next/image";
import { globalPath } from "src/global";
import { NOT_ACCEPT, PENDING_ACCEPTED } from "src/constant";

const DanhSachHocSinh = () => {
  const router = useRouter();

  const { schoolActive } = useSchoolStore((state: any) => ({
    schoolActive: state.schoolActive,
  }));

  useEffect(()=> {
    if(!getToken()) {
          router.push("/sign-in")
    }
    if(schoolActive ||  getSchoolId()){
       router.replace(`${router.pathname}?s=${schoolActive?.value || getSchoolId()}`)
    }

  },[schoolActive])
  

  return (
    <>
      <Head>
        <title>Monkey Class - Danh sách học sinh</title>
        <meta name="description" content="Danh sách học sinh" />
      </Head>
      <Layout>
        {schoolActive?.isAccept === NOT_ACCEPT || schoolActive?.isAccept === PENDING_ACCEPTED ? (
          <div
            className="d-flex justify-content-center"
            style={{ paddingTop: "20vh" }}
          >
            <Image
              src={`${globalPath.pathImg}/requests.png`}
              width={520}
              height={300}
              alt="Need request"
            />
          </div>
        ) : (
          <TongQuanHocsinh />
        )}
      </Layout>
    </>
  );
};

export default DanhSachHocSinh;
