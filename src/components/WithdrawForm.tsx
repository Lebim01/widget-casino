import { api } from "@/utils";
import { Button, Input } from "@heroui/react";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  usertoken: string;
};

const WithdrawForm: FC<Props> = ({ usertoken }) => {
  const { t } = useTranslation();

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
    <div className="min-w-[300px]">
      <div className="flex flex-col items-center justify-center gap-4 mb-4">
        <span className="">{t("enter_withdraw_amount")}</span>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          isReadOnly={loading}
        />
        <Button isLoading={loading} onPress={() => exec()}>
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
