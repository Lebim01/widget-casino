import Widget from "@/components/Widget";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import LoadingPage from "@/components/LoadingPage";
import { USERS } from "@/utils/users";
import { notFound } from "next/navigation";

const Iframe = dynamic(() => import("@/components/Iframe"), {
  ssr: false,
  loading: LoadingPage,
});

type Args = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Home({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise;

  if (!USERS.includes(slug)) return notFound();

  return (
    <div className="relative w-full h-[100dvh] bg-black">
      <Toaster />
      <Widget cashier={slug} />
      <Iframe />
    </div>
  );
}
