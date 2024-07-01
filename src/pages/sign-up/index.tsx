import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { nunito } from "@styles/font";
import { globalPath } from "src/global";
import SignUp from "src/modules/Signup";
import VerifyOtp from "src/modules/VerifyOtp";
import { registerAccount, verifyAccountOtp } from "src/services/common";
import { addLocalStorageUserInfo } from "src/selection";
import { useAppStore } from "src/stores/appStore";

const Signup = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>({
    email: "",
    phone: "",
    role: "" || null,
  });

  const [showSection, setShowSection] = useState({
    signUp: true,
    verifyOtp: false,
  });

  const onSubmitSection = (section: string, data?: any) => {
    if (data) {
      setUserData(data);
      const params = {
        ...data,
        roles: [data.role]
      }
      setLoading(true);
      registerAccount(params).then((res: any) => {
        if(res.status === "success") {
          setShowSection((prev: any) => ({
            signUp: false,
            verifyOtp: false,
            [section]: true,
          }));
        }else {
         toast.error("Đã có lỗi xảy ra!")
        }
      }).catch((err: any)=> {
        toast.error(err.response.data?.errors)
      }).finally(() => {
        setLoading(false);
      });
    }
  }

  const onHanldeGetResendOtp = () => {
    onSubmitSection("verifyOtp", userData)
  }

  const onVerifyOtp = async (otp: number) => {
    const params = {
      phone: userData.phone,
      otp
    }

    try {
      const res = await verifyAccountOtp(params);
      setLoading(true);
      if(res.status === "success") {
            toast.success("Xác thực thành công!")
            Cookies.set("access_token", res.data.access_token);
            addLocalStorageUserInfo(JSON.stringify(res.data?.userInfo));
            
            router.push(`/add-school?role=${userData.role}`)
          }else {
            toast.error("Xác thực thất bại!")
          }
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Monkey Class - Đăng ký tài khoản </title>
        <meta name="description" content="Đăng ký tài khoản" />
      </Head>
      <div
        className={`bg-light min-vh-95 d-flex flex-row align-items-center dark:bg-transparent ${nunito.className}`}
      >
        <Container>
          <Col className="rounded-4">
            <Row>
              {showSection.signUp && (
                <SignUp onSubmitSection={onSubmitSection} loading={loading} />
              )}
              {showSection.verifyOtp && (
                <VerifyOtp
                  userData={userData}
                  onHanldeGetOtp={onHanldeGetResendOtp}
                  onVerifyOtp={onVerifyOtp}
                  loading={loading}
                />
              )}

              <Col className="p-0 hide-mobile">
                <Image
                  fill
                  priority
                  className="h-100 position-relative rounded-right-16"
                  src={`${globalPath.pathImg}/img_sign_up.png`}
                  alt="Login"
                />
              </Col>
            </Row>
          </Col>
        </Container>
      </div>
    </>
  );
};

export default Signup;
