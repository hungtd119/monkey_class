"use client";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Loading from "src/components/Loading";
import {
  COURSE_ID,
  TYPE_ACCOUNT_TEACHER
} from "src/constant";
import { usePreviousRoute } from "src/hooks/usePreviousUrl";
import { checkTypeAccount, getInfoFromLS, getSchoolId } from "src/selection";
import {
  getCourseRegister
} from "src/services/common";
import BaiTapVeNha from "./BaiTapVeNha";
import TabStudent from "./TabStudent";
import UICourse from "src/components/UICourse/UICourse";
import UIKindy from "./UIKindy";

function TabsClassroom() {
  const router = useRouter();
  const { id, p, tab_id, unit_id } = router.query;
  usePreviousRoute();

  const [typeAccount, setTypeAccount] = useState(null);

  const [listTabCourse, setListTabCourse] = useState([]);
  const [currentTab, setCurrentTab] = useState<any>(tab_id);
  const [currentUnit, setCurrentUnit] = useState<any>(unit_id);

  const [page, setPage] = useState(Number(p) || 1);
  const [perPage, setPerPage] = useState(4);
  const [totalCourse, setTotalCourse] = useState(0);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  const storedClassName = getInfoFromLS("className");

  const [key, setKey] = useState<any>(null);
  const tabActive = typeof sessionStorage !== "undefined" && sessionStorage.getItem("tabActive")

  useEffect(() => {
    const previousUrl = typeof window !== "undefined" && localStorage.getItem('previousUrl');
    const type = checkTypeAccount();
    setTypeAccount(type);
    if (previousUrl && previousUrl.includes(String(id))) {
      setKey(tabActive);
    } else {
      setKey("students");
      if (type === TYPE_ACCOUNT_TEACHER) {
        setKey("homeworks");
      }
    }
  }, [id]);

  useEffect(() => {
    if (page || currentTab || currentUnit) {
      router.replace(buildUrl());
    }
  }, [page, currentTab, currentUnit]);

  const buildUrl = () => {
    if (page || currentTab || currentUnit) {
      const url = '/chi-tiet-lop-hoc/' + id;
      const data: any = _.pickBy(
        {
          p: page,
          tab_id: currentTab,
          unit_id: currentUnit
        },
        (value: any) => !!value
      );

      const searchParams = new URLSearchParams(data);
      return `${url}?${searchParams}`;
    }
    return '';
  };

  useEffect(() => {
    fetchDataCourses();
  }, [page]);

  const fetchDataCourses = async () => {
    setIsLoadingCourse(true);
    try {
      const response = await getCourseRegister({ class_id: id, page, per_page: perPage });

      if (response.meta.code === 200) {
        setIsLoadingCourse(false);
        setListTabCourse(response.result.data);
        setPerPage(response.result.per_page);
        setPage(response.result.current_page);
        setTotalCourse(response.result.total);
      }
    } catch (error) {
      setIsLoadingCourse(false);
      console.error(error);
    }
  };

  if (typeAccount === null) {
    return <Loading />;
  }

  const handleBackPage = () => {
    router.push(`/danh-sach-lop-hoc?s=${getSchoolId()}`);
  };

  const handleChangeTab = (tab: string) => {
    setCurrentTab(tab);
  }
  
  return (
    <>
      <div className="d-flex align-items-center py-4">
        <i
          className="fa fa-angle-left fs-4 me-3 pointer"
          aria-hidden="true"
          onClick={() => handleBackPage()}
        />
        <div className="fw-bold fs-2">{storedClassName?.className ?? ""}</div>
      </div>
      <div className="my-7">
        <div className={"mb-2 d-flex justify-content-end"}>
          <Button variant={"success"} className={"mx-1"} onClick={() => setPage(page - 1 <= 0 ? 1 : page - 1)}
            disabled={page <= 1}
          >
            {"<"}
          </Button>
          <Button variant={"success"} onClick={() => setPage(page + 1 > Math.floor(totalCourse / perPage) ? page : page + 1)}
            disabled={page + 1 > Math.floor(totalCourse / perPage)}
          >
            {">"}
          </Button>
        </div>
        <Tabs
          defaultActiveKey={
            tab_id !== "undefined" ?
              tab_id?.toString() :
              typeAccount === TYPE_ACCOUNT_TEACHER ? "109" : "students"
          }
          id="fill-tab"
          className="mb-7"
          fill
          onSelect={(tab: any) => handleChangeTab(tab)}
          transition={false}
          mountOnEnter={true}
        >
          <Tab eventKey="students" title="Học sinh">
            <TabStudent typeAccount={typeAccount} id={id} storedClassName={storedClassName} />
          </Tab>
          <Tab eventKey="homeworks" title="Bài tập về nhà">
            <BaiTapVeNha id={id} />
          </Tab>
          {
            listTabCourse &&
            listTabCourse.map((tab: any) => {
              return (
                <Tab
                  eventKey={tab.course_id}
                  title={<span>{tab.title}</span>}
                  key={tab.course_id}
                >
                  {tab.course_id === COURSE_ID ? (
                    <UIKindy id={id} setCurrentUnit={setCurrentUnit} />
                  ) :
                    <UICourse courseTitle={tab.title} courseId={tab.course_id} id={id}
                    />
                  }
                </Tab>
              );
            })
          }
        </Tabs>
      </div>
    </>
  );
}

export default TabsClassroom;
