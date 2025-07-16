import { Html, Head, Main, NextScript } from "next/document";
import { HeroUIProvider } from "@heroui/react";
import { useTranslation } from "react-i18next";

export default function Document() {
  const { i18n } = useTranslation();

  return (
    <Html lang="en" className="dark">
      <Head />
      <body className="antialiased">
        <HeroUIProvider locale={i18n.language}>
          <Main />
        </HeroUIProvider>
        <NextScript />
      </body>
    </Html>
  );
}
