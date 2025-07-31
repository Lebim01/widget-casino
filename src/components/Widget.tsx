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
import TransactionList from "./TransactionList";
import { FaTimes } from "react-icons/fa";

const LOCALSTORAGE_ACC = "acc";

const Widget = () => {
  const { t } = useTranslation();

  const [isOpenPopover, setIsOpenPopover] = useState(false);
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
    title: t("add_credits"),
    color: "default",
  });

  useEffect(() => {
    if (localStorage.getItem(LOCALSTORAGE_ACC)) {
      settokenuser(localStorage.getItem(LOCALSTORAGE_ACC));
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
      title: t("add_credits"),
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
      {usertoken ? (
        <Popover
          placement="top-end"
          backdrop="opaque"
          isOpen={isOpenPopover}
          onOpenChange={(isOpen) => setIsOpenPopover(isOpen)}
        >
          <PopoverTrigger>
            <div className="absolute bottom-30 right-4 md:bottom-4 md:right-12 text-white z-100">
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
            <div className="flex flex-col gap-2 pt-2 w-full max-w-[90vw] lg:min-w-[300px]">
              <div className="flex justify-between">
                <LanguageDropdown />
                <FaTimes
                  className="text-xl"
                  onClick={() => setIsOpenPopover(false)}
                />
              </div>
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
                <Tab key="transactions" title={t("transactions")}>
                  <Card>
                    <CardBody>
                      <TransactionList usertoken={usertoken} />
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Popover
          placement="top-end"
          backdrop="opaque"
          isOpen={isOpenPopover}
          onOpenChange={(isOpen) => setIsOpenPopover(isOpen)}
        >
          <PopoverTrigger>
            <div className="absolute bottom-30 right-4 md:bottom-4 md:right-12 text-white z-100">
              <Tooltip
                content={tooltip.title}
                isOpen={isOpenTooltip}
                placement="left"
                color={tooltip.color}
              >
                <Image
                  src="/coin.png"
                  alt="Reload"
                  className="bg-gray-700/80 shadow-lg border-1 border-gray-300 cursor-pointer rounded-full object-cover hover:brightness-70"
                  width={60}
                  height={60}
                  onMouseEnter={() => setIsOpenTooltip(true)}
                  onMouseLeave={() => setIsOpenTooltip(false)}
                />
              </Tooltip>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2 pt-2 w-full max-w-[90vw] lg:min-w-[300px]">
              <div className="flex justify-between">
                <LanguageDropdown />
                <FaTimes
                  className="text-xl"
                  onClick={() => setIsOpenPopover(false)}
                />
              </div>
              <div className="max-w-[300px] p-2">{t("login_instructions")}</div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default Widget;
