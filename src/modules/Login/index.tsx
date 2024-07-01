import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import Image from "next/image";
import { clearDataUser } from "src/services/auth";
import {
  addLocalStorage,
  addLocalStorageUserInfo,
  checkTypeAccount,
  cleanLocalStorage,
  cleanSessionStorage,
  getDataModelsStorage,
  getUserIdFromSession,
} from "../../selection";
import useTrans from "src/hooks/useTrans";
import useDeviceDetect from "src/hooks/useDetectDevice";
import styles from "./Login.module.scss";
import Loading from "src/components/Loading";
import {
  getListCourseByAccount,
  getListCourses,
  loginAccount,
} from "src/services/common";
import { globalPath } from "src/global";
import { useAppStore } from "src/stores/appStore";
import {
  TYPE_ACCOUNT_ADMIN,
  TYPE_ACCOUNT_PARENTS,
  TYPE_ACCOUNT_SCHOOL,
  TYPE_ACCOUNT_TEACHER,
} from "src/constant";
import validateEmail from "src/utils/validateEmail";
import { nunito } from "@styles/font";

interface IFormInputs {
  userName: any;
  password: any;
  remember_me: boolean;
}

const Login = () => {
  const router = useRouter();
  const trans = useTrans();
  const { isMobile } = useDeviceDetect();

  const [isPassword, setStatePassword] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const fetchDataModels = useAppStore((state: any) => state.fetchDataModels);
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data: IFormInputs) => {
    setRememberMe(data.remember_me);
    setLoading(true);
    let dataLogin: any = {
      password: data.password.trim(),
    };
    const userName = data.userName.trim();
    if (validateEmail(userName)) {
      dataLogin = {
        ...dataLogin,
        email: userName,
      };
    } else {
      dataLogin = {
        ...dataLogin,
        phone: userName,
      };
    }
    try {
      const res = await loginAccount(dataLogin);

      if (res && res.meta.code === 200) {
        toast.success(trans.login.success);
        addLocalStorageUserInfo(JSON.stringify(res.result?.userInfo));
        Cookies.set("access_token", res.result.access_token, {
          expires: 1,
        });

        if (data.remember_me) {
          localStorage.setItem("access_token", res.result.access_token);
        }

        const isViewV1 = await fetchDataModels();
        const listCourses = await fetchListCourses();

        setTimeout(() => {
          if (res?.result?.userInfo?.role_id === TYPE_ACCOUNT_PARENTS) {
            router.push("/hoc-lieu");
          } else {
            router.push("/danh-sach-lop-hoc");
          }
        }, 300);
      } else {
        if (res.meta.code == 404) {
          toast.error(trans.login.status_404);
        } else {
          toast.error(trans.login.fail);
        }
      }
    } catch (error) {
      toast.error(trans.login.status_404);
    } finally {
      setLoading(false);
    }
  };

  const fetchListCourses = async () => {
    try {
      const res = await getListCourses({});
      if (res && res.code === 200) {
        localStorage.setItem("listCourses", JSON.stringify(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!rememberMe) {
      cleanLocalStorage();
    }
  }, []);
  return (
    <div
      className={`${nunito.className}`}
      style={{overflow:"hidden"}}
    >
      <Row>
        <Col lg={5} className="bg-white border" style={{padding:"60px"}}>
          <div className="d-flex justify-content-center">
            <a
              href={`${
                process.env.NODE_ENV !== "production"
                  ? process.env.NEXT_PUBLIC_WEB_URL
                  : ""
              }san-pham`}
            >
              <img src={`${global.pathSvg}/logo-monkey-class.svg`} alt="Logo" width={200}/>
            </a>
          </div>

          <p className="h4 my-8 fw-bold text-center">Chào mừng bạn đến với Monkey Class </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <Form.Label className="text-black" htmlFor="userName">
                {trans.login.account}
              </Form.Label>
              <Form.Control
                autoFocus
                {...register("userName")}
                placeholder={trans.login.account}
                aria-label="UserName"
                className={`${styles.formControlCustom}`}
              />
              {errors.userName && (
                <p className="text-danger mt-2">Vui lòng nhập tên tài khoản</p>
              )}
            </div>

            <div className="mb-3 position-relative">
              <Form.Label className="text-black" htmlFor="password">
                {trans.login.password}
              </Form.Label>
              <Form.Control
                type={isPassword ? "text" : "password"}
                {...register("password")}
                required
                placeholder={trans.login.password}
                aria-label="Password"
                className={`${styles.formControlCustom}`}
              />
              {errors.password && (
                <p className="text-danger mt-2">Vui lòng nhập mật khẩu</p>
              )}
              <i
                onClick={() => setStatePassword(!isPassword)}
                className={` ${styles.iconEye} fa position-absolute ${
                  styles.cursorPointer
                } ${isPassword ? "fa-eye monkey-bc-black" : "fa-eye-slash"}`}
                aria-hidden="true"
              ></i>
            </div>
            <div className="position-relative d-flex">
              <Form.Check
                {...register("remember_me")}
                id="save_login"
                style={{ marginRight: "8px" }}
              />
              <label htmlFor="save_login">Lưu thông tin đăng nhập</label>
            </div>

            {/* <Row className="justify-content-end">
                      <Col xs={6} className="text-end">
                        <button className="p-2 btn text-commit text-responsive" type="button">
                          Quên mật khẩu?
                        </button>
                      </Col>
                    </Row> */}
            <Col lg={12}>
              {!loading ? (
                <Button
                  className="px-4 w-100 mt-3 text-secondary bg-danger"
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  {trans.login.login}
                </Button>
              ) : (
                <Loading />
              )}
            </Col>
          </form>
          <div className={`${styles.footer_text}`}>
            <span>Web app owned by Early Start © 2023</span>
          </div>
        </Col>
        <Col lg={7} md={5} className="p-0 hide-mobile hide-tablet">
          <img
            width={"100%"}
            style={{height:"100vh",objectFit:"cover"}}
            className={`${styles.cursor_auto} position-relative`} 
            src={`${globalPath.pathImg}/login.jpg`}
            loading="lazy"
            alt="Login"
          />
        </Col>
      </Row>
    </div>
  );
};

export default Login;
