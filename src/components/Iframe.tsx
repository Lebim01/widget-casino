"use client";
import { useState } from "react";
import LoadingPage from "./LoadingPage";

const Iframe = () => {
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
        src={`https://games.${domain}`}
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
