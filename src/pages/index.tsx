import Widget from "@/components/Widget";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="relative w-full h-[100dvh] bg-white">
      <Toaster />
      <Widget />
      <iframe id="dota" src="https://dota.click" className="h-full w-full" />
    </div>
  );
}
