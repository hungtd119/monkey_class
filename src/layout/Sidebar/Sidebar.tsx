import React, { useEffect, useState } from "react";
import classNames from "classnames";
import SidebarNav from "./SidebarNav";
import { nunito } from "@styles/font";
import HookMenuDownloadApp from "src/components/HookMenuDownloadApp";

export default function Sidebar(props: { isShow: boolean; isShowMd: boolean, isShowSidebarToggle: boolean }) {
  const { isShow, isShowMd, isShowSidebarToggle } = props;
  const [isNarrow, setIsNarrow] = useState(false);

  // On first time load only
  useEffect(() => {
    if (localStorage.getItem("isNarrow")) {
      setIsNarrow(localStorage.getItem("isNarrow") === "true");
    }
  }, [setIsNarrow]);

  return (
    <>
      {isShowSidebarToggle && <div
        className={`${classNames(
          "sidebar d-flex flex-column position-fixed p-4",
          {
            "sidebar-narrow": isNarrow,
            show: isShow,
            "md-hide": !isShowMd,
          }
        )} ${nunito.className}`}
        id="sidebar"
      >
        <div className="sidebar-brand d-flex align-items-center justify-content-center pd-tb-15px pb-5">
          <img
            src={`${global.pathSvg}/logo-monkey-class.svg`}
            className="position-relative"
            alt="logo"
          />
        </div>

        <div className="sidebar-nav">
          <SidebarNav />
        </div>
        <HookMenuDownloadApp />
      </div>
      }
    </>
  );
}

export const SidebarOverlay = (props: {
  isShowSidebar: boolean;
  toggleSidebar: () => void;
}) => {
  const { isShowSidebar, toggleSidebar } = props;

  return (
    <div
      tabIndex={-1}
      aria-hidden
      className={classNames(
        "sidebar-overlay position-fixed top-0 bg-dark w-100 h-100 opacity-50",
        {
          "d-none": !isShowSidebar,
        }
      )}
      onClick={toggleSidebar}
    />
  );
};
