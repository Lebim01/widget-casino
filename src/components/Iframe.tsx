"use client";
import { useState } from "react";

const Iframe = () => {
  const [domain] = useState(
    typeof window != "undefined" ? window.location.hostname : ""
  );

  return (
    <iframe
      id="dota"
      src={`https://games.${domain}.com`}
      className="h-full w-full"
    />
  );
};
export default Iframe;
