import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import nextBase64 from "next-base64";
import { parseCookies } from "nookies";
import { MODE_OFFFLINE_40, MODE_OFFFLINE_55, MODE_SMART_CLASS} from "./constant";

dayjs.extend(duration);

export default dayjs;

export const addLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, data);

  return true;
};

export const addLocalStorageUserInfo = (user_info: any) => {
  localStorage.setItem("user_info", user_info);
  return true;
};

export const removePropertiesLocalStorage = (keys: string[]) => {
  keys.forEach((key: string) => {
    localStorage.removeItem(key);
  });
};

export const cleanLocalStorage = () => {
  typeof window !== "undefined" && localStorage.clear();
};

export const cleanSessionStorage = () => {
  typeof window !== "undefined" && sessionStorage.clear();
};

export const getLocalStorageByKey = (key: string) => {
  return typeof localStorage !== "undefined" ? localStorage.getItem(key) : "";
};

export const getInfoFromLS = (key: string) => {
  const result = typeof window !== "undefined" && localStorage.getItem(key);
  return result ? JSON.parse(result) : null;
};

export const setEventGTM = (trackEvent: any) => {
  if (process.env.NODE_ENV != "production") {
    return;
  }

  let event = { ...trackEvent };
  if (typeof localStorage !== 'undefined') {
    const storedUserId = localStorage.getItem("userId");
    const userId = storedUserId !== null ? JSON.parse(storedUserId) : null;
    event.user_id = userId
  }
  // @ts-ignore
  window.dataLayer.push(event);
};

export const callLoadingScreen = (_isShow: boolean) => {
  if (!_isShow) {
    global.showLoading(false);
    return;
  }

  global.showLoading(true);
  setTimeout(() => {
    global.showLoading(false);
  }, 1000);
};

export const base64Encoded = (_input: string) => {
  return nextBase64.encode(_input);
};

export const base64Decoded = (_input: string) => {
  return nextBase64.decode(_input);
};

export const getPathImages = (images: any) => {
  const validJsonString = images?.replace(/'/g, '"');

  const parsedImages = validJsonString ? JSON.parse(validJsonString) : null;
  return parsedImages?.[0].path;
};

export const checkTypeAccount = () => {
  if (typeof window !== "undefined") {
    const userInfo = getLocalStorageByKey("user_info");
    const typeAccount = userInfo ? JSON.parse(userInfo)?.role_id : "";
    return typeAccount;
  }
};

export const getToken = () => {
  const cookies = parseCookies(global.ctx);
  const token = cookies["access_token"];
  return token;
};

export const getDataModelsStorage = () => {
  if (typeof localStorage !== "undefined") {
    const getDataModels = getLocalStorageByKey("dataModels");

    const dataModels = getDataModels ? JSON.parse(getDataModels) : [];
    return dataModels;
  }
  return [];
};

export const checkLinksExistence = (data: any) => {
  for (let item of data) {
    if (item.links && item.links.length > 0) {
      return true;
    }
  }
  return false;
};

export const getSchoolId = () => {
  if (typeof sessionStorage !== 'undefined') {
    const storedSchool = sessionStorage.getItem("school");
    const schoolId = storedSchool !== null ? JSON.parse(storedSchool ?? "[]")[0]?.id : null;
    // if (checkTypeAccount() === TYPE_ACCOUNT_TEACHER) {
    //   const schoolId = storedSchool !== null ? JSON.parse(storedSchool)[0]?.id : null;

    //   return schoolId;
    // }
    return schoolId;
  } else {
    return null;
  }
};

export const getUserIdFromSession = () => {
  if (typeof localStorage !== 'undefined') {
    const storedUserId = localStorage.getItem("userId");

    const userId = storedUserId !== null ? JSON.parse(storedUserId ?? "{}") : null;

    return userId;
  }
}

export const getModelClassroom = (model: number) => {
  switch (model) {
    case MODE_OFFFLINE_40:
      return "Offline 40 phút";
    case MODE_OFFFLINE_55:
      return "Offline 55 phút";
    case MODE_SMART_CLASS:
      return "Smart Class";
    default:
      break;
  }
}

export const getLevelClassroom = (level: number) => {
  switch (level) {
    case 20:
      return 1;
    case 21:
      return 2;
    case 22:
      return 3;
    default:
      break;
  }
}

export const formatTimestampToYYYYMMDD = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
};

export const formatedProvinceDistrict =(data: any) => {
  const dataFormat = Object.entries(data).map(([value, label]) => ({
    value: parseInt(value, 10),
    label,
  }));

  return dataFormat;
} 

export const getFirstCategoryId = (data: any) => {
  for (const item of data) {
    const firstCategory = item.game_categories.find((category: any) => category.game_lessons.length > 0 && category.status === 1);
    if (firstCategory) {
      return firstCategory.id;
    }
  }
  return null; 
};

export const countNonZeroQuestionSetIds = (list: any[], currentIndex: number): number => {
  let count = 0;
  for (let i = 0; i <= currentIndex; i++) {
    if (list[i].question_set_id !== 0) {
      count++;
    }
  }
  return count;
}

export const validatePassword = (password: any) => {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isValid = password.length >= 4 && hasLetter && hasNumber && hasSpecialChar;
  return isValid;
};

export const maskUserData = (data: { phone: string; email: string }, verificationType: string = "email") => {
  if (verificationType === 'phone') {
      // Mask phone number
      return `${data.phone.slice(0, 3)}****${data.phone.slice(-3)}`;
  } else if (verificationType === 'email') {
      // Mask email
      const [username, domain] = data.email.split('@');
      return `${username.slice(0, 2)}***${username.slice(-1)}@${domain}`;
  }
  return '';
};

export const getRoleAccount = () => {
  if (typeof localStorage !== 'undefined') {
    const userInfo = localStorage.getItem("user_info")

    const role = userInfo !== null ? JSON.parse(userInfo).role_id : null;
    return role;
  }
}