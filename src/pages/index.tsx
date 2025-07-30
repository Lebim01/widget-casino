import Widget from "@/components/Widget";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const Iframe = dynamic(() => import("@/components/Iframe"), {
  ssr: false
})

export default function Home() {
  
  return (
    <div className="relative w-full h-[100dvh] bg-black">
      <Toaster />
      <Widget />
      <Iframe />
    </div>
  );
}
