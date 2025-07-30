import useClipboard from "@/hooks/useClipboard";
import useTimer from "@/hooks/useTimer";
import { api } from "@/utils";
import { Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import dayjs from "dayjs";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsClock, BsWallet } from "react-icons/bs";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";

interface Qr {
  qrcode_url: string;
  address: string;
  expires_at: any;
  amount: number;
}

type Props = {
  usertoken: string;
  onComplete: () => void;
};

const DepositForm: FC<Props> = ({ usertoken, onComplete }) => {
  const { t } = useTranslation();
  const [selectedNetwork, setSelectNetowrk] = useState(["TRX"]);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const [data, setData] = useState<null | Qr>(null);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

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
        resetForm();
      }
    }
  }, []);

  const getData = async () => {
    if (step != 2) return;
    setErrorMessage(null);
    try {
      const res = await api.post(`/disruptive/create-transaction-casino`, {
        network: selectedNetwork[0],
        amount,
        usertoken: usertoken,
      });

      if (res.status == 201 && res.data) {
        setData(res.data);
        localStorage.setItem("paymentData", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Fallo al obtener la data", error);
      setErrorMessage("error generate qr");
    }
  };

  const cancelQR = async () => {
    if (confirm("Are you sure?")) {
      if (data?.address) {
        try {
          const res = await api.post(`/disruptive/cancel-transaction-casino`, {
            address: data.address,
            usertoken: usertoken,
          });

          if (res.status == 201) {
            resetForm();
          }
        } catch (error) {
          console.error("Fallo al obtener la data", error);
        }
      }
    }
  };

  const resetForm = () => {
    setData(null);
    setStep(1);
    localStorage.removeItem("paymentData");
    setAmount("");
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

          await api.post(`/disruptive/completed-transaction-casino`, {
            network: selectedNetwork[0],
            address: data.address,
          });

          resetForm();
          onComplete();
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
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 10 * 1000);
    }
  }, [success]);

  return (
    <div className="w-full lg:min-w-[300px]">
      {step == 1 && (
        <div className="flex flex-col items-center justify-center gap-4 mb-4">
          <span className="text-white">{t("enter_deposit_amount")}</span>
          <Select
            selectedKeys={selectedNetwork}
            onSelectionChange={(keys: any) =>
              setSelectNetowrk(Array.from(keys))
            }
            label={t("network")}
          >
            <SelectItem key="TRX">TRX (TRC20)</SelectItem>
            <SelectItem key="BSC">BSC (BEP20)</SelectItem>
            <SelectItem key="ETH">ETH (ERC20)</SelectItem>
            <SelectItem key="POLYGON">POLYGON (ERC20)</SelectItem>
          </Select>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            label={t("amount")}
          />
          <Button onPress={() => setStep(2)}>{t("deposit")}</Button>
        </div>
      )}
      {step == 2 && (
        <div className="flex flex-col items-center justify-center gap-4 mb-4 max-w-[400px]">
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
                  startContent={<BsWallet className="text-white" />}
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
                      startContent={<BsClock className="text-white" />}
                      value={timer}
                      className="font-nexabold"
                    />
                  ) : null}
                  <Input
                    readOnly
                    className="font-nexabold w-full"
                    startContent={<span className="text-white">USDT</span>}
                    value={isExpired ? "" : data.amount.toFixed(2)}
                    endContent={
                      <div className="flex items-center space-x-2">
                        <div
                          className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-300"
                          onClick={() => copy(data.amount.toFixed(2) || "")}
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
          {data && (
            <Button
              onPress={() => cancelQR()}
              className="w-full"
              color="danger"
            >
              {t("cancel")}
            </Button>
          )}
        </div>
      )}

      {success && (
        <div className="flex flex-col items-center gap-2 border border-success p-2 rounded-lg">
          <FaCheck className="text-success text-2xl" />
          <span>{t("deposit_success")}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex flex-col items-center gap-2 border border-danger p-2 rounded-lg">
          <FaTimes className="text-danger text-2xl" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default DepositForm;
