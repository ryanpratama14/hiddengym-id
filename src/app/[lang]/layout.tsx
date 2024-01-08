import "@/styles/tailwind.css";
import "@/styles/stylesheet.css";
import GlobalHelper from "@/global/GlobalHelper";
import { getServerAuthSession } from "@/server/auth";
import { theme } from "@/styles/theme";
import { TRPCReactProvider } from "@/trpc/react";
import { type Lang } from "@/types";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { type Metadata } from "next";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Hidden Gym",
  description: "Hidden Gym",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
};

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

type Props = { children: React.ReactNode; params: { lang: Lang } };

export default async function RootLayout({ children, params }: Props) {
  const session = await getServerAuthSession();

  return (
    <html lang={params.lang} className={poppins.variable}>
      <body>
        <GlobalHelper lang={params.lang} session={session} />
        <TRPCReactProvider cookies={cookies().toString()}>
          <AntdRegistry>
            <ConfigProvider theme={theme}>
              <main>{children}</main>
            </ConfigProvider>
          </AntdRegistry>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
