import "@/styles/globals.css";
import AntdProvider from "@/components/AntdProvider";
import { TRPCReactProvider } from "@/trpc/react";
import { type Metadata } from "next";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Hidden Gym",
  description: "Hidden Gym",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-cream ${poppins.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <AntdProvider>
            <main>{children}</main>
          </AntdProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
