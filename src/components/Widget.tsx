import {
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import DepositForm from "./DepositForm";
import WithdrawForm from "./WithdrawForm";

const LOCALSTORAGE_ACC = "acc";

const Widget = () => {
  const [isOpenTooltip, setIsOpenTooltip] = useState(true);
  const [usertoken, settokenuser] = useState<string | null>(null);

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
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsOpenTooltip(false);
    }, 15 * 1000);
  }, []);

  return (
    <>
      {usertoken && (
        <Popover>
          <PopoverTrigger>
            <div className="fixed bottom-30 right-4 md:bottom-4 md:right-12 text-white z-100">
              <Tooltip
                content="Recargar créditos"
                isOpen={isOpenTooltip}
                placement="left"
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
              <Tabs>
                <Tab key="deposit" title="Depositar">
                  <Card>
                    <CardBody>
                      <DepositForm usertoken={usertoken} />
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="withdraw" title="Retirar">
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
