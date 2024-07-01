declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_APP_API_URL: string;
      readonly NEXT_PUBLIC_CRM_API_URL: string;
      readonly NEXT_PUBLIC_APP_API_URL_LOGIN: string;
      readonly NEXT_PUBLIC_WEB_URL: string;
      readonly NEXT_PUBLIC_API_URL_KINDY: string;
      readonly NEXT_PUBLIC_CDN: string;
      readonly NEXT_PUBLIC_API_USER_KINDY: string;
      readonly NEXT_PUBLIC_API_SEND_EMAIL: string;
    }
  }
}

export {};
