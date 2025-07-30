"use client";
import { useState } from "react";

const Iframe = () => {
  const [domain] = useState(
    typeof window != "undefined"
      ? window.location.hostname == "localhost"
        ? "dotakorea.com"
        : window.location.hostname
      : ""
  );

  if (!domain) return null;

  return (
    <iframe
      id="dota"
      src={`https://games.${domain}`}
      className="h-full w-full"
    />
  );
};
export default Iframe;
