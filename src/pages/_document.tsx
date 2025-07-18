import { Html, Head, Main, NextScript } from "next/document";
import { HeroUIProvider } from "@heroui/react";
import { useTranslation } from "react-i18next";

export default function Document() {
  const { i18n } = useTranslation();

  return (
    <Html lang="en" className="dark">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <body className="antialiased">
        <HeroUIProvider locale={i18n.language}>
          <Main />
        </HeroUIProvider>
        <NextScript />
      </body>
    </Html>
  );
}
