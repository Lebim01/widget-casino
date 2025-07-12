import useClipboard from "@/hooks/useClipboard";
import useTimer from "@/hooks/useTimer";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import axios from "axios";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsClock, BsWallet } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { jsxDEV } from "react/jsx-dev-runtime";

interface Qr {
  qrcode_url: string;
  address: string;
  expires_at: any;
  amount: number;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const LOCALSTORAGE_ACC = "acc";

const Widget = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const [data, setData] = useState<null | Qr>(null);
  const [isOpenTooltip, setIsOpenTooltip] = useState(true);
  const [iduser, setiduser] = useState<string | null>(null);

  const convertToTimestamp = (date: any): Date | null => {
    if (!date) return null;
    if (typeof date === "string") return new Date(date);
    if (date.seconds) return new Date(date.seconds * 1000);
    return null;
  };
  const expires_at = convertToTimestamp(data?.expires_at);
  const isExpired = expires_at ? dayjs(expires_at).isBefore(dayjs()) : false;
  const timer = useTimer(
    expires_at ? new Date(expires_at).getTime() : undefined
  );
  const { copy } = useClipboard();

  useEffect(() => {
    const saved = localStorage.getItem("paymentData");
    if (saved && saved !== "") {
      const parsed: Qr = JSON.parse(saved);
      const expiresAt = convertToTimestamp(parsed.expires_at);
      if (expiresAt && dayjs(expiresAt).isAfter(dayjs())) {
        setData(parsed);
        setStep(2);
      } else {
        localStorage.removeItem("paymentData");
      }
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem(LOCALSTORAGE_ACC)) {
      setiduser(localStorage.getItem(LOCALSTORAGE_ACC));
    }
  }, []);

  useEffect(() => {
    const iframe: HTMLIFrameElement | null = document.querySelector("#dota");

    if (iframe) {
      const changeurl = () => {
        
      };

      iframe.addEventListener("load", changeurl);

      return () => {
        iframe.removeEventListener("load", changeurl);
      };
    }
  }, []);

  useEffect(() => {
    const handler = (
      event: MessageEvent<{ tipo: "login" | "logout"; usuario: string }>
    ) => {
      if (event.data.tipo == "login") {
        const { usuario } = event.data;
        setiduser(usuario);
        localStorage.setItem(LOCALSTORAGE_ACC, usuario);
      }
      if (event.data.tipo == "logout") {
        setiduser(null);
        localStorage.removeItem(LOCALSTORAGE_ACC);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const getData = async () => {
    if (step != 2) return;
    try {
      const res = await api.post(`/disruptive/create-transaction-casino`, {
        amount,
        userid: iduser,
      });

      if (res.status == 201 && res.data) {
        setData(res.data);
        localStorage.setItem("paymentData", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Fallo al obtener la data", error);
    }
  };

  useEffect(() => {
    getData();
  }, [step]);

  useEffect(() => {
    if (isExpired) {
      localStorage.removeItem("paymentData");
    }
  }, [isExpired]);

  useEffect(() => {
    if (data?.address) {
      let intervalId: NodeJS.Timeout | null = null;

      const polling = async () => {
        if (isExpired) return;

        try {
          const res = await api.post(`/disruptive/polling`, {
            address: data.address,
          });

          if (res.data != "OK") return;

          await api.post(`/disruptive/completed-transaction-deposit`, {
            address: data.address,
          });
        } catch (err) {
          console.error("Polling error:", err);
        }
      };

      intervalId = setInterval(polling, 5000);
      polling();

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [data?.expires_at]);

  useEffect(() => {
    setTimeout(() => {
      setIsOpenTooltip(false);
    }, 5000);
  }, []);

  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader>Recargar créditos</ModalHeader>
              <ModalBody>
                {step == 1 && (
                  <div className="flex flex-col items-center justify-center gap-4 mb-4">
                    <span className="">Introduce la cantidad deseada</span>
                    <Input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                    />
                    <Button onPress={() => setStep(2)}>Recargar</Button>
                  </div>
                )}
                {step == 2 && (
                  <div className="flex flex-col items-center justify-center gap-4 mb-4">
                    <span className="">
                      Introduce la cantidad deseada a recargar
                    </span>
                    <span className="text-yellow-500">Red BEP20</span>
                    <div>
                      {!data && <Spinner />}
                      {data && (
                        <div className="flex flex-col gap-4 items-center">
                          {data.qrcode_url ? (
                            <img
                              src={data.qrcode_url}
                              className={`h-[150px] w-[150px]`}
                              alt="qr"
                            />
                          ) : (
                            <Spinner />
                          )}
                          <Input
                            readOnly
                            startContent={<BsWallet />}
                            value={isExpired ? "" : data?.address || ""}
                            className=""
                            endContent={
                              <div
                                className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-300"
                                onClick={() => copy(data.address!)}
                              >
                                <FiCopy color="black" />
                              </div>
                            }
                          />
                          <div
                            className={
                              !isExpired
                                ? "grid grid-cols-[30%_1fr] gap-x-4 w-full"
                                : "grid gap-x-4 w-full"
                            }
                          >
                            {!isExpired ? (
                              <Input
                                readOnly
                                startContent={<BsClock />}
                                value={timer}
                                className="font-nexabold"
                              />
                            ) : null}
                            <Input
                              readOnly
                              className="font-nexabold flex items-center"
                              startContent={["USDT"]}
                              value={isExpired ? "" : data.amount.toFixed(2)}
                              endContent={
                                <div className="flex items-center space-x-2">
                                  <div
                                    className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-300"
                                    onClick={() =>
                                      copy(data.amount.toFixed(2) || "")
                                    }
                                  >
                                    <FiCopy color="black" />
                                  </div>
                                </div>
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
      {iduser && (
        <div className="fixed bottom-30 right-4 md:bottom-4 md:right-12 text-white z-100">
          <Tooltip content="Recargar créditos" isOpen placement="left">
            <Image
              onClick={onOpen}
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
      )}
    </>
  );
};

export default Widget;
