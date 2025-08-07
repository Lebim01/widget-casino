"use client";
import { FC, useState } from "react";
import LoadingPage from "./LoadingPage";

type Props = {
  cashier: string;
};

const Iframe: FC<Props> = ({ cashier }) => {
  const [loading, setLoading] = useState(true);

  const [domain] = useState(
    typeof window != "undefined"
      ? window.location.hostname == "localhost"
        ? "dotakorea.com"
        : window.location.hostname
      : ""
  );

  if (!domain) return null;

  return (
    <>
      <iframe
        id="dota"
        src={`https://games.${domain}?promo=${cashier}&registration=true `}
        className="h-full w-full"
        onLoad={(e) => {
          console.log(e);
          setLoading(false);
        }}
      />
      {loading && <LoadingPage />}
    </>
  );
};
export default Iframe;
