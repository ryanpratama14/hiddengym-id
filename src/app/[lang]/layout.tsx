import "@/styles/globals.css";
import AntdProvider from "@/components/AntdProvider";
import { type Locale } from "@/lib/internationalization";
import { TRPCReactProvider } from "@/trpc/react";
import { type Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Hidden Gym",
  description: "Hidden Gym",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type Props = { children: React.ReactNode; params: { lang: Locale } };

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
