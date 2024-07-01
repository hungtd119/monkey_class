import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { addLocalStorage, getToken } from "src/selection";
import { useAppStore } from "src/stores/appStore";
import Image from "next/image";
import Cookies from "js-cookie";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { getInfoAccountAdmin, loginWithAdmin } from "../../services/common";
import { nunito } from "@styles/font";
import { globalPath } from "src/global";

const ChangeAdmin = () => {
  const router = useRouter();

  const { s, t } = router.query;

  const loginWithAdmin = useAppStore((state: any) => state.loginWithAdmin);

  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    if (t) {
      loginWithAdmin(t).then((res: any) => {
		res.userInfo.role_id = "School";
        setUserInfo(res.userInfo);
        // @ts-ignore
        setAccessToken(res.access_token);
        localStorage.setItem("user_info", JSON.stringify(res.userInfo));
        Cookies.set("access_token", res.access_token.toString());
      });
    } else {
      if (!getToken()) {
        router.push("/sign-in");
      } else {
        router.push("/danh-sach-hoc-lieu");
      }
    }
  }, [t, s]);

  const handleContinue = async () => {
    try {
      setLoading(true);
      const res = await getInfoAccountAdmin({});
      if (res.status === "success") {
        const dataModels = res.data?.schools;
        const userId = res.data?.user_id;

        localStorage.setItem("dataModels", JSON.stringify(dataModels));
        localStorage.setItem("userId", userId);
        addLocalStorage("accountName", JSON.stringify(res.data.account_name));
        sessionStorage.setItem("school", JSON.stringify(dataModels));
		router.push(`/danh-sach-lop-hoc?s=${s}`);
      }
    } catch (error) {
      console.error("Error fetching data models:", error);
      // Handle error if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Monkey Class - Change Admin</title>
        <meta name="description" content="Change Admin" />
      </Head>
      <div
        className={`bg-light min-vh-95 d-flex flex-row align-items-center dark:bg-transparent ${nunito.className}`}
      >
        <Container>
          <Col className="rounded-4">
            <Row>
              <Col
                lg={5}
                className="bg-white px-8 pt-7 rounded-left-16 position-relative"
              >
                <Image
                  src={`${global.pathSvg}/logo_monkey_class.svg`}
                  width={164}
                  height={50}
                  className="d-flex"
                  alt="Monkey Class"
                />
                <p className="fw-bold fs-3 mt-8">
                  Chào mừng bạn đến với Monkey Class
                </p>

                <form>
                  <Row className="mt-3">
                    <Col md={12}>
                      <div className="mb-3 mt-6">
                        Tên : <span className="fw-bold">{userInfo?.name}</span>
                      </div>
                      <div className="mb-3 mt-6">
                        Email:{" "}
                        <span className="fw-bold">{userInfo?.email}</span>
                      </div>
                    </Col>
                  </Row>

                  <Col lg={12}>
                    <Button
                      className="px-4 w-100 fw-bold mt-3 text-secondary bg-button-v2 input-custom"
                      variant="primary"
                      type="button"
                      onClick={() => handleContinue()}
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Tiếp tục"
                      )}
                    </Button>
                  </Col>
                </form>
              </Col>

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

export default ChangeAdmin;
