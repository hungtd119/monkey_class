
import { LoginData, ResponseErrors } from "src/types/global";
import Fetch from "../utils/Fetch";
import { LoginModel } from "@models/login";
import { bluebird } from "src/global";
import { AxiosError } from "axios";
import { ProfileModel } from "@models/profile";
import { cleanLocalStorage, cleanSessionStorage } from "src/selection";

export const saveLoginInfo = async (data?: LoginData) => {
  global.setCookie("access_token", data?.access_token || "");
  Fetch.access_token = data?.access_token || "";
};

export const loginByPhone = async (params: LoginModel) => {
  params = {...params};
  await saveLoginInfo();
  await bluebird.delay(60);

  try {
    const res:any = await Fetch.post<{
    }>(`https://app.monkeyenglish.net/app/api/v2/account/authen/login`, params);

    if(res && res.status === 'success') {
      await saveLoginInfo(res.data);
      return res;
    }

    return AxiosError<ResponseErrors>;
  } catch (errors: any) {
    return errors?.response
  }
};

export const listProfile = async (params: ProfileModel) => {
  params = {...params};
  try {
    const res: any = await Fetch.get<{
    }>(`https://app.monkeyenglish.net/app/api/v2/account/profile-list`, {params});


    return res;
  } catch (errors: any) {
    return errors?.response
  }
};

export const logout = async () => {
  const rs = confirm("Bạn muốn đăng xuất tài khoản?");
  if (rs) {
    // Fetch.post("@api/auth/logout");
    cleanLocalStorage();
    cleanSessionStorage();
    await saveLoginInfo();
    await bluebird.delay(60);
    window.location.href = "/sign-in";
    return true;
  } else {
    return false;
  }
};

export const clearDataUser = () => {
  cleanLocalStorage();
  global.setCookie("access_token", "");
}
