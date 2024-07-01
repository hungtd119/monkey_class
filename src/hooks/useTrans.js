import { useRouter } from "next/router";
import en from "public/lang/en.js";
import vi from "public/lang/vi.js";

const useTrans = () => {
  const { locale } = useRouter();

  const localeFiles = {
    vi: vi,
    en: en,
  };

  return localeFiles[locale];
};

export default useTrans;
