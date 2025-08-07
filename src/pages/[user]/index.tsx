import Widget from "@/components/Widget";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import LoadingPage from "@/components/LoadingPage";
import { USERS } from "@/utils/users";

import { useRouter } from "next/router";

const Iframe = dynamic(() => import("@/components/Iframe"), {
  ssr: false,
  loading: LoadingPage,
});

export default function Home() {
  const router = useRouter();
  const user = router.query.user as string;

  if (!USERS.includes(user)) return null;

  return (
    <div className="relative w-full h-[100dvh] bg-black">
      <Toaster />
      <Widget cashier={user} />
      <Iframe cashier={user} />
    </div>
  );
}
