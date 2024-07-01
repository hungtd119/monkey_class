import React, { useEffect } from "react";
import Head from "next/head";
import Layout from "../../layout/Layout";
import TongQuanLopHoc from "src/modules/Lop-hoc/TongQuanLopHoc";
import { useRouter } from "next/router";
import { getSchoolId, getToken } from "src/selection";
import { useTeacherStore } from "../../stores/teacherStore";
import { useSchoolStore } from "src/stores/schoolStore";
import { globalPath } from "src/global";
import Image from "next/image";
import { NOT_ACCEPT, PENDING_ACCEPTED } from "src/constant";
import CardCustom from "../../modules/Lop-hoc/CardCustom";

const titlePage = "Monkey Class -  Lớp học";

const LopHocPage = () => {
  const router = useRouter();
  const { schoolActive } = useSchoolStore((state: any) => ({
    schoolActive: state.schoolActive,
  }));

  useEffect(()=> {
    if(!getToken()) {
      router.push("/sign-in")
    }
    if(schoolActive ||  getSchoolId()) {
      router.replace(`${router.pathname}?s=${schoolActive?.value || getSchoolId()}`)
    }
  },[schoolActive?.value])

  return (
    <>
      <Head>
        <title>{titlePage}</title>
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
          <TongQuanLopHoc />
        )}
      </Layout>
    </>
  );
};

export default LopHocPage;
