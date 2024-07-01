import Layout from "../../layout/Layout";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NOT_ACCEPT, PENDING_ACCEPTED } from "src/constant";
import { globalPath } from "src/global";
import Tongquan from "src/modules/Giaovien/Tongquan";
import { getSchoolId, getToken } from "src/selection";
import { useSchoolStore } from "src/stores/schoolStore";

const DanhSachGiaoVien = () => {
  const router= useRouter();
  const { schoolActive } = useSchoolStore((state: any) => ({
    schoolActive: state.schoolActive,
  }));

  useEffect(()=> {
    if(!getToken()) {
      router.push("/sign-in")
    }
    if(schoolActive?.value ||  getSchoolId()) {
      router.replace(`${router.pathname}?s=${schoolActive?.value || getSchoolId()}`)
    }
  },[schoolActive?.value])

  return (
    <>
      <Head>
        <title>Monkey Class -  Giáo viên</title>
        <meta name="description" content="Lớp học" />
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
        <Tongquan />
      )}

      </Layout>
    </>
  );
};

export default DanhSachGiaoVien;
