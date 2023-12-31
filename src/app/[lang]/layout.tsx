import "@/styles/globals.css";
import AntdProvider from "@/components/AntdProvider";
import { TRPCReactProvider } from "@/trpc/react";
import { type Lang } from "@/types";
import { type Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Hidden Gym",
  description: "Hidden Gym",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type Props = { children: React.ReactNode; params: { lang: Lang } };

export default function RootLayout({ children, params }: Props) {
  return (
    <html lang={params.lang}>
      <body>
        <TRPCReactProvider cookies={cookies().toString()}>
          <AntdProvider>
            <main>{children}</main>
          </AntdProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
