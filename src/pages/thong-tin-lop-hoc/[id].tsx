import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../../layout/Layout";
import FormEditClassroom from "src/modules/Lop-hoc/FormEditClassroom";
import { checkTypeAccount, getToken } from "src/selection";
import { useClassroomStore } from "src/stores/classroomStore";
import FormEditClassroomV2 from "../../modules/Lop-hoc/FormEditClassroomV2";

const ThongTinLopHoc = () => {
  const router= useRouter();
  const { id,school_id } = router.query;
  const [typeAccount, setTypeAccount] = useState(null)

  const fetchDetailClassroom = useClassroomStore(
    (state: any) => state.fetchDetailClassroom
  );

  const fetchingDetailClassroom = useClassroomStore(
    (state: any) => state.fetchingDetailClassroom
  );
  const detailClassroom = useClassroomStore((state: any) => state.detailClassroom);
  const setDetailClassroom = useClassroomStore((state: any) => state.setDetailClassroom);

  useEffect(()=> {
    if(!getToken()) {
      router.push("/sign-in")
    }
    fetchDetailClassroom({id})
    setTypeAccount(checkTypeAccount());
  },[id])

  const handleCloseDetailClass = () => {
    setDetailClassroom(null);
    router.push("/danh-sach-lop-hoc?s=" + school_id);
  }

  return (
    <>
      <Head>
        <title>Monkey Class - Thông tin lớp học </title>
        <meta name="description" content="Thông tin lớp học " />
      </Head>
      <Layout>
        <FormEditClassroomV2
          detailClassroom={detailClassroom}
          fetchingDetailClassroom={fetchingDetailClassroom}
          onClose={() => handleCloseDetailClass()}
          typeAccount={typeAccount}
          classID={id}
        />
      </Layout>
    </>
  );
};

export default ThongTinLopHoc;
