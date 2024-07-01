import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { RawCurrentUser } from "../types/global";
import {parseCookies} from "nookies";
import {toast} from "react-toastify";
import { ResponseErrors } from "../types/global";
import Cookies from "js-cookie";

export const convertObjectToForm = (params: any) => {
  try {
    const form = new FormData();
    Object.keys(params).forEach((field) => {
      if (params[field]) {
        if (field === "attachments") {
          params[field].forEach((attachment: any) => {
            form.append("attachments[]", attachment);
          });
        } else {
          form.append(field, params[field]);
        }
      }
    });
    return form;
  } catch (error) {
    return new FormData();
  }
};

class FetchInstance {
  access_token: string = "";
  isConnected = true;
  me: RawCurrentUser | null = null;

  checkNetwork = () => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      this.isConnected = false;
      toast.error("Không có kết nối internet")
      return false;
    }

    return true;
  };

  getUrl = (url: string) => {
    //notification
    // if (url.startsWith("@notification")) {
    //   url = url.replace(
    //     /^@notification/,
    //     global.config.NEXT_PUBLIC_NOTIFICATION_URL
    //   );
    // }
    return url;
  };

  getConfigWithToken =  (config: AxiosRequestConfig = {}) => {
    let headers = config.headers || {};
    const cookies = parseCookies(global.ctx);
    const token   = cookies['access_token'];

    if (token) {
      headers = {
        token: token,
        ...headers,
      };
    }

    return {
      ...config,
      headers,
    };
  };

  get = <ResponseType>(url: string, config?: AxiosRequestConfig) => {
    if (!Fetch.checkNetwork()) {
      return AxiosError<ResponseErrors>;
    }
    const configHeaders = this.getConfigWithToken(config)
    return new Promise(
      async (res, reject: (axiosError: AxiosError) => void) => {
        axios
          .get<ResponseType>(
             this.getUrl(url),
             configHeaders
          )
          .then((v: any) => {
            res(v.data);
          })
          .catch(async (err) => {
            const status = err.response?.data?.status;

            if (status === 401) {
              toast.error("Tài khoản không có quyền truy cập");
              //Throw error
            }

            reject(err);
          });
      }
    );
  };

  delete = async <ResponseType>(url: string, config?: AxiosRequestConfig) => {
    if (!Fetch.checkNetwork()) {
      return AxiosError<ResponseErrors>;
    }
    return axios.delete<ResponseType>(
      this.getUrl(url),
      this.getConfigWithToken(config)
    );
  };

  post = async <ResponseType>(url: string, data: Record<string, any> = {}, config?: AxiosRequestConfig) => {
    if (!Fetch.checkNetwork()) {
      return AxiosError<ResponseErrors>;
    }
    return new Promise(
      async (
        res,
        reject: (axiosError: AxiosError) => void
      ) => {
        axios
          .post<ResponseType>(
            this.getUrl(url),
            data,
            this.getConfigWithToken(config)
          )
          .then((v: any) => res(v.data))
          .catch(async (err) => {
            const status = err.response?.data?.status;

            if (status === 401) {
              toast.error("Tài khoản không có quyền truy cập");
              //Throw error
            }
            reject(err);
          });
      }
    );
  };

  patch = async <ResponseType>(url: string, data: Record<string, any> = {}, config?: AxiosRequestConfig) => {
    if (!Fetch.checkNetwork()) {
      return AxiosError<ResponseErrors>;
    }
    return axios.patch<ResponseType>(
      this.getUrl(url),
      data,
      this.getConfigWithToken(config)
    );
  };
}

// Singleton
const Fetch = new FetchInstance();

export default Fetch;
