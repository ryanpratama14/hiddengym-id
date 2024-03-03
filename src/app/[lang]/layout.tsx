import HigherOrderComponent from "@/global/HigherOrderComponent";
import { useDictionary } from "@/lib/dictionary";
import { getServerAuthSession } from "@/server/auth";
import "@/styles/stylesheet.css";
import "@/styles/tailwind.css";
import { theme } from "@/styles/theme";
import { TRPCReactProvider } from "@/trpc/react";
import type { Lang } from "@/types";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Hidden Gym",
  description: "Hidden Gym",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
};

type Props = { children: React.ReactNode; params: { lang: Lang } };

export default async function RootLayout({ children, params }: Props) {
  const t = await useDictionary(params.lang);
  const session = await getServerAuthSession();
  let isSessionExpired = undefined;

  if (session) if (Date.now() >= session.user.exp) isSessionExpired = false;

  return (
    <html lang={params.lang}>
      <body>
        <HigherOrderComponent t={t} lang={params.lang} session={session} isSessionExpired={isSessionExpired}>
          <TRPCReactProvider>
            <AntdRegistry>
              <ConfigProvider theme={theme}>
                <Toaster
                  duration={3000}
                  style={{ fontFamily: "Poppins" }}
                  position="top-right"
                  toastOptions={{ unstyled: true, className: "w-full items-end" }}
                />
                <main>{children}</main>
              </ConfigProvider>
            </AntdRegistry>
          </TRPCReactProvider>
        </HigherOrderComponent>
      </body>
    </html>
  );
}
