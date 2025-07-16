import "@/styles/globals.css";
import "@/utils/i18n";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
