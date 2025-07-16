import { api } from "@/utils";
import { Spacer, Spinner } from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowAltCircleDown } from "react-icons/fa";

type Props = {
  usertoken: string;
};

const TransactionList: FC<Props> = ({ usertoken }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<
    {
      type: "deposit" | "withdraw";
      amount: number;
      created_at: string;
      status: string;
      address: string;
    }[]
  >([]);

  const getData = async () => {
    try {
      setLoading(true);

      const res = await api.post("/disruptive/get-transactions", {
        usertoken,
      });
      setList(res.data);
    } catch (err) {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-w-[300px] flex flex-col items-center">
      {loading && <Spinner size="sm" />}
      <div className="max-h-[300px] overflow-auto w-full flex flex-col gap-4">
        {list.map((r, index) => (
          <>
            <div key={index} className="flex flex-col gap-1 w-full">
              <div className="flex justify-between">
                <div>
                  {r.type == "deposit" ? (
                    <span
                      className={
                        (r.status == "approved"
                          ? "text-success"
                          : r.status == "pending"
                          ? "text-warning"
                          : "text-neutral-200") + " flex items-center gap-1"
                      }
                    >
                      <FaArrowAltCircleDown />
                      <span
                        className={
                          r.status == "cancelled" ? "line-through" : ""
                        }
                      >
                        +{r.amount} USDT
                      </span>
                    </span>
                  ) : (
                    <span className="text-danger flex items-center gap-1">
                      <FaArrowAltCircleDown />
                      <span
                        className={
                          r.status == "cancelled" ? "line-through" : ""
                        }
                      >
                        -{r.amount} USDT
                      </span>
                    </span>
                  )}
                </div>
                <div
                  className={
                    r.status == "approved"
                      ? "text-success"
                      : r.status == "pending"
                      ? "text-warning"
                      : "text-neutral-200"
                  }
                >
                  {t(r.status)}
                </div>
              </div>
              <div>
                <span className="text-neutral-200 opacity-60">{r.address}</span>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
