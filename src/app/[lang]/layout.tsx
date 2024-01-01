import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { type Lang } from "@/types";
import { AntdRegistry } from "@ant-design/nextjs-registry";
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
          <AntdRegistry>
            <main>{children}</main>
          </AntdRegistry>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
