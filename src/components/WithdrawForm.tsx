import { api } from "@/utils";
import { Button, Input } from "@heroui/react";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  cashier: string;
  usertoken: string;
};

const WithdrawForm: FC<Props> = ({ usertoken, cashier }) => {
  const { t } = useTranslation();

  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setReponse] = useState<null | {
    message: string;
    status: boolean;
  }>(null);

  const exec = async () => {
    setLoading(true);
    setReponse(null);
    try {
      const res = await api.post(`/disruptive/withdraw-casino`, {
        amount,
        usertoken,
        cashier,
      });
      setReponse(res.data);
    } catch (err) {
      console.error(err);
      setReponse({
        message: t("something_was_wrong"),
        status: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:min-w-[300px]">
      <div className="flex flex-col items-center justify-center gap-4 mb-4">
        <span className="text-white">{t("enter_withdraw_amount")}</span>
        <Input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          type="text"
          placeholder={t("wallet") + " (BEP20)"}
          isReadOnly={loading}
        />
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder={t("amount")}
          isReadOnly={loading}
        />
        <Button
          isLoading={loading}
          onPress={() => exec()}
          isDisabled={!wallet || !amount}
        >
          {t("withdraw")}
        </Button>

        {response && (
          <span className={response.status ? "text-success" : "text-danger"}>
            {response.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default WithdrawForm;
