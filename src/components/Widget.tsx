import {
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
  Tooltip,
} from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import DepositForm from "./DepositForm";
import WithdrawForm from "./WithdrawForm";
import LanguageDropdown from "./LanguageDropdown";
import { useTranslation } from "react-i18next";

const LOCALSTORAGE_ACC = "acc";

const Widget = () => {
  const { t } = useTranslation();

  const [isOpenTooltip, setIsOpenTooltip] = useState(true);
  const [usertoken, settokenuser] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    title: string;
    color:
      | "default"
      | "foreground"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger";
  }>({
    title: "Recargar créditos",
    color: "default",
  });

  useEffect(() => {
    if (localStorage.getItem(LOCALSTORAGE_ACC)) {
      settokenuser(localStorage.getItem(LOCALSTORAGE_ACC));
    }
  }, []);

  useEffect(() => {
    const iframe: HTMLIFrameElement | null = document.querySelector("#dota");

    if (iframe) {
      const changeurl = () => {};

      iframe.addEventListener("load", changeurl);

      return () => {
        iframe.removeEventListener("load", changeurl);
      };
    }
  }, []);

  useEffect(() => {
    const handler = (
      event: MessageEvent<{
        tipo: "login" | "logout";
        usuario: string;
        token: string;
      }>
    ) => {
      if (event.data.tipo == "login") {
        const { token } = event.data;
        settokenuser(token);
        localStorage.setItem(LOCALSTORAGE_ACC, token);
      }
      if (event.data.tipo == "logout") {
        settokenuser(null);
        localStorage.removeItem(LOCALSTORAGE_ACC);
        localStorage.removeItem("paymentData");
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (isOpenTooltip) {
      setTimeout(() => {
        setIsOpenTooltip(false);
        resetTooltip();
      }, 15 * 1000);
    }
  }, [isOpenTooltip]);

  const resetTooltip = () => {
    setTooltip({
      title: t("deposit_credits"),
      color: "default",
    });
  };

  const showSuccessDeposit = () => {
    setTooltip({
      title: t("deposit_success"),
      color: "success",
    });
    setIsOpenTooltip(true);
  };

  return (
    <>
      {usertoken && (
        <Popover>
          <PopoverTrigger>
            <div className="fixed bottom-30 right-4 md:bottom-4 md:right-12 text-white z-100">
              <Tooltip
                content={tooltip.title}
                isOpen={isOpenTooltip}
                placement="left"
                color={tooltip.color}
              >
                <Image
                  src="/coin.png"
                  alt="Reload"
                  className="bg-gray-700/70 shadow-lg border-1 border-gray-300 cursor-pointer rounded-full object-cover hover:brightness-70"
                  width={60}
                  height={60}
                  onMouseEnter={() => setIsOpenTooltip(true)}
                  onMouseLeave={() => setIsOpenTooltip(false)}
                />
              </Tooltip>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <div className="flex justify-end">
                <LanguageDropdown />
              </div>
              <br />
              <Tabs>
                <Tab key="deposit" title={t("deposit")}>
                  <Card>
                    <CardBody>
                      <DepositForm
                        usertoken={usertoken}
                        onComplete={showSuccessDeposit}
                      />
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="withdraw" title={t("withdraw")}>
                  <Card>
                    <CardBody>
                      <WithdrawForm usertoken={usertoken} />
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default Widget;
