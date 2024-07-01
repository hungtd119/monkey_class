"use client";
import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useRouter } from "next/router";
import classNames from "classnames";
import Router from "next/router";
import useTrans from "src/hooks/useTrans";
import {
  checkTypeAccount,
} from "src/selection";
import { globalPath } from "../../global";
import {
  TYPE_ACCOUNT_ADMIN,
  TYPE_ACCOUNT_PARENTS,
  TYPE_ACCOUNT_TEACHER,
} from "src/constant";

export default function SidebarNav() {
  const router = useRouter();
  const { locale } = router;
  const trans = useTrans();
  const [typeAccount, setTypeAccount] = useState(null); // dung local storage nen SSR bi loi phai dung state de goi o client
  const [activeTabHref, setActiveTabHref] = useState(router.pathname); 

  useEffect(() => {
    setTypeAccount(checkTypeAccount());
  }, []);

  const checkShowNavbarHocLieu = () => {
    if (typeAccount === TYPE_ACCOUNT_ADMIN) {
      return true;
    }

    return false;
  };

  const checkShowTabGiaoVien = () => {
    if (typeAccount === TYPE_ACCOUNT_PARENTS || typeAccount === TYPE_ACCOUNT_TEACHER) {
      return false;
    }
    return true;

  }

  const checkShowTabHocSinh = () => {
    if (typeAccount === TYPE_ACCOUNT_PARENTS || typeAccount === TYPE_ACCOUNT_TEACHER) {
      return false;
    }
    return true;

  }

  const checkShowTabDanhSachHocLieu = () => {
    if (typeAccount === TYPE_ACCOUNT_PARENTS) {
      return false;
    }
    return true;
  }

  const checkShowTabHocLieuV1 = () => {
    if (typeAccount === TYPE_ACCOUNT_PARENTS) {
      return true;
    }
    return false;
  }

  const checkShowTabLopHoc = () => {
    if (typeAccount === TYPE_ACCOUNT_PARENTS) {
      return false;
    }
    return true;
  }

  const redirectTab = (url: string) => {
    // callLoadingScreen(true);
    Router.push(url)
  };

  const tabs = [
    {
      id: 1,
      title: "Trường",
      src: globalPath.pathImg ? `${globalPath.pathImg}/school.png` : "",
      href: "/truong-hoc",
      show: false,
    },
    {
      id: 2,
      title: "Lớp học",
      src: globalPath.pathImg ? `${globalPath.pathImg}/classes.png` : "",
      href: "/danh-sach-lop-hoc",
      show: checkShowTabLopHoc(),
    },
    {
      id: 3,
      title: "Giao vien",
      src: globalPath.pathImg ? `${globalPath.pathImg}/teacher.png` : "",
      href: "/danh-sach-giao-vien",
      show: checkShowTabGiaoVien(),
    },
    {
      id: 4,
      title: "Học sinh",
      src: global.pathImg ? `${global.pathImg}/student.png` : "",
      href: "/danh-sach-hoc-sinh",
      show: checkShowTabHocSinh(),
    },

    {
      id: 5,
      title: "Học liệu",
      src: globalPath.pathImg ? `${globalPath.pathImg}/material.png` : "",
      href: "/danh-sach-hoc-lieu?subject=109",
      show: checkShowTabDanhSachHocLieu(),
    },
    {
      id: 6,
      title: "Học liệu",
      src: globalPath.pathImg ? `${globalPath.pathImg}/material.png` : "",
      href: "/hoc-lieu",
      show: checkShowTabHocLieuV1(),
    },
    {
      id: 7,
      title: "Bảng đánh giá",
      src: globalPath.pathImg ? `${globalPath.pathImg}/student.png` : "",
      href: "/form-danh-gia",
      show: false,
    },
  ];

  return (
    <ul className="list-unstyled">
      {tabs.map((tab: any, index) => (
        <Nav.Item key={index}>
          {tab.show && (
            <li
              className="mb-3"
              onClick={() => setActiveTabHref(tab.href)}
              key={index}
            >
              <div onClick={() => redirectTab(tab.href)}>
                <Nav.Link
                  className={classNames(
                    "p-4 d-flex align-items-center text-responsive gap-2",
                    {
                      active: tab.href === activeTabHref,
                    }
                  )}
                >
                  <>
                    <img src={tab.src} width={24} height={24} alt="icon" />
                    <span className="fw-500" style={{ marginTop: "5px" }}>
                      {
                        trans.leftNav[
                          ("tab_" + tab.id) as keyof typeof trans.leftNav
                        ]
                      }
                    </span>
                  </>
                </Nav.Link>
              </div>
            </li>
          )}
        </Nav.Item>
      ))}
    </ul>
  );
}
