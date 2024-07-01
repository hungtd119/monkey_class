import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import Image from "next/image";
import styles from "./DangNhap.module.scss";
import { useRouter } from "next/router";
import { signInWithPhone, verifyOtp } from "src/services/common";
import { toast } from "react-toastify";
import VerifyOtp from "../VerifyOtp";
import { HTTP_STATUS_CODE_OK, TYPE_TEACHER } from "src/constant";
import { addLocalStorageUserInfo, getDataModelsStorage, getToken } from "src/selection";
import { useAppStore } from "src/stores/appStore";
import { useSchoolStore } from "src/stores/schoolStore";

const phoneRegExp = /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;

const DangNhap = (props: any) => {
  const router = useRouter();
  const token  = getToken();

  const fetchDataModels = useAppStore((state: any) => state.fetchDataModels);
  const { schoolActive, setSchoolActive } = useSchoolStore((state: any) => ({
    schoolActive: state.schoolActive,
    setSchoolActive: state.setSchoolActive
  }));

  const [userData, setUserData] = useState({
    email: "",
    phone: "",
    role: "" || null,
  });

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
  });

  useEffect(() => {
    if(schoolActive?.value && token) router.push(`/danh-sach-lop-hoc?s=${schoolActive.value}`);
  }, [schoolActive])

  const [showSection, setShowSection] = useState({
    signIn: true,
    verifyOtp: false,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: any, section: string) => {
    setLoading(true);
    setUserData({...userData, phone: data.phone});
    const params = {
      phone: data.phone,
    };
    signInWithPhone(params)
      .then((res) => {
        if (res.code === HTTP_STATUS_CODE_OK) {
          setShowSection((prev: any) => ({
            signIn: false,
            verifyOtp: false,
            [section]: true,
          }));
        } else {
          toast.error(res.message);
        }
      })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onHanldeGetOtp = (data: any) => {
    onSubmit(data, "verifyOtp")
  }

  const onVerifyOtp = async (data: any) => {
    const params = {
      phone: userData.phone,
      otp: data
    };
  
    try {
      const res = await verifyOtp(params);
      setLoading(true);
      if (res.status === "success") {
        Cookies.set("access_token", res.data.access_token);
        addLocalStorageUserInfo(JSON.stringify(res.data?.userInfo));
        toast.success(res.message);

        await fetchDataModels();
        const schoolIdFirst = getDataModelsStorage()[0]?.school_id
          router.push(`/danh-sach-lop-hoc?s=${schoolIdFirst}`);
      } else {
        toast.error(res.message); 
      }
    } catch (error) {
      console.log(error);
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showSection.signIn && ( 
        <Col lg={5} className="bg-white px-8 pt-7 rounded-left-16 position-relative">
          <Image
            src={`${global.pathSvg}/logo_monkey_class.svg`}
            width={164}
            height={50}
            className="d-flex"
            alt="Monkey Class"
          />
          <p className="fw-bold fs-3 mt-8">Chào mừng bạn đến với Monkey Class</p>

          <form onSubmit={handleSubmit((data) => onSubmit(data, "verifyOtp"))}>
            <Row className="mt-3">
              <Col md={12}>
                <div className="mb-3 mt-6">
                  <Form.Control
                    autoFocus
                    {...register("phone", {
                      required: "Vui lòng nhập số điện thoại",
                      pattern: {
                        value: phoneRegExp,
                        message: "Số điện thoại không hợp lệ",
                      },
                    })}
                    aria-label="phone"
                    placeholder="Nhập số điện thoại"
                    className="input-custom"
                    isInvalid={!!errors.phone}
                    disabled={loading}
                  />
                </div>
                {errors?.phone && (
                  <p
                    className="mt-2 text-danger fw-medium"
                    style={{ fontStyle: "italic" }}
                  >
                    {errors?.phone?.message}
                  </p>
                )}
              </Col>
            </Row>

            <Col lg={12}>
              <Button
                className="px-4 w-100 fw-bold mt-3 text-secondary bg-button-v2 input-custom"
                variant="primary"
                type="submit"
                disabled={loading || !isValid}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Tiếp tục"}
              </Button>
            </Col>
          </form>
          <div className={`d-flex gap-2 py-2 position-absolute ${styles.positionRegister}`}>
            <p>Chưa có tài khoản?</p>
            <a href="/sign-up" className="text-decoration-underline">
              Đăng ký
            </a>
          </div>
        </Col>
      )}
      {showSection.verifyOtp && <VerifyOtp userData={userData} onHanldeGetOtp={onHanldeGetOtp} onVerifyOtp={onVerifyOtp} loading={loading}/>}
    </>
  );
};

export default DangNhap;
