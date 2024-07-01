import nookies from "nookies";
import Cookies from "js-cookie";
import { convertQueryStringToObject } from "./utils/query";
import getConfig from "next/config";
import { ModalType } from "./types/global";
import { NextPageContext } from "next";

export { default as bluebird } from "bluebird";
import _ from "lodash"
export default _;

const { publicRuntimeConfig } = getConfig();

declare global {
  namespace NodeJS {
    interface Global {
      ctx?: NextPageContext;
      setCookie: (cname: string, cvalue?: string, expire?: number) => void;
      refreshHome: () => void;
      getCookie: (cname: string) => any;
      showModal: (content: ModalType, callback?: () => void) => void;
      hideModal: () => void;
      showNotification: (mess: any) => void;
      showMessage: (content: string) => void;
      showLoading: (_show?: boolean) => void;
      hideLoading: () => void;

      getQuery: (
        key_get?: string,
        search?: string
      ) => string | { [x: string]: any } | undefined;
      setQuery: (obj?: any, search?: string) => void;
      showShareTooltip: (callback?: () => void) => void;
      pathFavicon: string;
      pathImg: string;
      pathSvg: string;
    }
  }
}

// @ts-ignore
// if (process?.browser) {
//   global.config = {
//     ...publicRuntimeConfig,
//   };
// } else {
//   global.config = {
//     ...process.env,
//   };
// }

global.getCookie = (cname: string) => {
  if (!cname) return "";
  try {
    if (global.ctx) {
      const allItem = nookies.get(global.ctx);
      return allItem[cname];
    }
    const cookies = Cookies.get();
    return cookies[cname];
  } catch (error) {
    return "";
  }
};

global.setCookie = (cname: string, cvalue?: string, expire = 9999) => {
  try {
    if (global.ctx) {
      if (!cvalue) {
        nookies.destroy(global.ctx, cname);
        return;
      }

      nookies.set(global.ctx, cname, cvalue, {
        path: "/",
        maxAge: expire * 24 * 60 * 60,
      });
    } else {
      if (!cvalue) {
        Cookies.remove(cname);
        return;
      }

      Cookies.set(cname, cvalue, { expires: expire });
    }
  } catch (error) {}
};

global.getQuery = (key_get?: string, search?: string) => {
  const urlString = search || window.location.search;

  let params: { [x: string]: string } = convertQueryStringToObject(urlString);

  if (key_get) return params[key_get];

  return params;
};

global.setQuery = (obj: any, search?: string) => {
  const params = new URLSearchParams(search || location.search);
  Object.keys(obj).forEach((key) => params.set(key, obj[key]));

  window.location.search = params.toString();
};
export const globalPath = {
  pathFavicon: "/assets/favicon",
  pathImg : "/assets/img",
  pathSvg : "/assets/svg"
}
global.pathFavicon = "/assets/favicon";
global.pathImg = "/assets/img";
global.pathSvg = "/assets/svg";

let detailSchoolFetched = false;

export const getDetailSchoolFetched = () => detailSchoolFetched;
export const setDetailSchoolFetched = (fetched: any) => {
  detailSchoolFetched = fetched;
};
