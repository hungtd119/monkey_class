import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { countryFlag, languageCountry, languages } from "src/constant";

const ChangeLanguage = () => {
const router = useRouter();
  const { locale } = router;

  const [currentLanguage, setCurrentLanguage] = useState(
    locale ? languageCountry[locale] : languageCountry["vi"]
  );
  const [curentFlag, setCurentFlag] = useState(
    locale ? countryFlag[locale] : countryFlag["vi"]
  );

  const handleLanguageChange = (language: string) => {
    const selectedLanguage = languages.find((item) => item.code === language);
    if (selectedLanguage) {
      setCurrentLanguage(selectedLanguage.key);
      setCurentFlag(selectedLanguage.flagUrl);
      router.push(router.pathname, router.asPath, { locale: language });
    }
  };
  return (
    <div className="d-flex nav align-items-center change-language">
      <Image src={curentFlag} alt="VietNam" width={24} height={24} />
      <Dropdown>
        <Dropdown.Toggle
          variant=""
          id="dropdown-basic"
          style={{ backgroundColor: "#fff", border: "none", padding: "4px"}}
        >
          {currentLanguage}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {languages.map((language) => (
            <Dropdown.Item key={language.code}>
              <div
                className="d-flex align-items-center gap-2"
                onClick={() => handleLanguageChange(language.code)}
              >
                <Image
                  src={language.flagUrl}
                  alt={language.name}
                  width={24}
                  height={24}
                />
                {language.name}
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ChangeLanguage;
