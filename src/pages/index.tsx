import Iframe from "@/components/Iframe";
import Widget from "@/components/Widget";
import { Toaster } from "react-hot-toast";

export default function Home() {
  
  return (
    <div className="relative w-full h-[100dvh] bg-white">
      <Toaster />
      <Widget />
      <Iframe />
    </div>
  );
}
