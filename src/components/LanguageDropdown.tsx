/* eslint-disable @next/next/no-img-element */
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useTranslation } from "react-i18next";

const languagues: any = {
  en: {
    label: "EN",
    flag: "https://www.worldometers.info/img/flags/small/tn_us-flag.gif",
  },
  es: {
    label: "ES",
    flag: "https://www.worldometers.info/img/flags/small/tn_mx-flag.gif",
  },
  ko: {
    label: "KO",
    flag: "https://www.worldometers.info/img/flags/small/tn_ks-flag.gif",
  },
};

const Language = (props: { label: string; flag: string }) => {
  return (
    <div className="flex items-center gap-2 border py-1 px-2 border-gray-800 rounded-md hover:cursor-pointer">
      <img src={props.flag} alt="flag" className="w-4" /> {props.label}
    </div>
  );
};

const LanguageDropdown = () => {
  const { i18n } = useTranslation();

  const onAction = (key: any) => {
    localStorage.setItem("i18nextLng", key);
    if (key == "en") {
      i18n.changeLanguage("en");
    }
    if (key == "es") {
      i18n.changeLanguage("es");
    }
    if (key == "ko") {
      i18n.changeLanguage("ko");
    }
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <div>
          <Language {...languagues[i18n.language]} />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        variant="flat"
        disabledKeys={["profile"]}
        onAction={onAction}
      >
        {Object.keys(languagues).map((key: any) => (
          <DropdownItem key={key}>
            <Language {...languagues[key]} />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageDropdown;
