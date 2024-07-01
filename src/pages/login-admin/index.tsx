import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from 'src/components/Loading';
import { addLocalStorage, addLocalStorageUserInfo } from 'src/selection';
import { getListCourses, loginAdminCms } from 'src/services/common';
import { useAppStore } from 'src/stores/appStore';

const LoginAdminFromCMS = ({s, t}:any) => {
    const router = useRouter();
    if (t) {
      Cookies.set("access_token", String(t), {
        expires: 1,
      });
    }
    const fetchDataModels = useAppStore((state: any) => state.fetchDataModels);

    useEffect(()=> {

      const fetchLoginAdminCms = ()=> {
        loginAdminCms({school_id: s}).then((res: any)=> {
            if(res.meta.code === 200){
              fetchListCourses();
              addLocalStorageUserInfo(JSON.stringify(res.result?.user_info));
                router.push(`danh-sach-lop-hoc?s=${res.result.school_id}`)
                fetchDataModels();

            } else {
                toast.error("Đăng nhập thất bại");
                router.push("/sign-in")
            }
        }).catch((err)=> {
            console.log(err)
        });
        }
        fetchLoginAdminCms()
    },[]);
  const fetchListCourses = async () => {
    try {
      const res = await getListCourses({});
      if (res && res.code === 200) {
        localStorage.setItem("listCourses", JSON.stringify(res.data));
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
   <Loading />
  )
}

export const getServerSideProps = async (context: any) => {
  const { s, t } = context.query;

  return {
    props: {
      s: s || null,
      t: t || null,
    },
  };
};

export default LoginAdminFromCMS