import { api } from "@/utils";
import { Button, Input } from "@heroui/react";
import { FC, useState } from "react";

type Props = {
  usertoken: string;
};

const WithdrawForm: FC<Props> = ({ usertoken }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const exec = async () => {
    setLoading(true);
    try {
      await api.post(`/disruptive/withdraw-casino`, {
        amount,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[300px]">
      <div className="flex flex-col items-center justify-center gap-4 mb-4">
        <span className="">Introduce la cantidad a retirar</span>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          isReadOnly={loading}
        />
        <Button isLoading={loading} onPress={() => exec()}>
          Retirar
        </Button>
      </div>
    </div>
  );
};

export default WithdrawForm;
