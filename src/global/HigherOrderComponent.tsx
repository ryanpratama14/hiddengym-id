"use client";

import Logo from "@/components/Logo";
import { useZustand } from "@/global/store";
import { COLORS } from "@/styles/theme";
import { type Lang } from "@/types";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Suspense, useEffect } from "react";
import { ClipLoader } from "react-spinners";

type Props = {
  lang: Lang;
  session: Session | null;
  children: React.ReactNode;
  isSessionExpired: boolean | undefined;
};

export default function HigherOrderComponent({ lang, session, children, isSessionExpired }: Props) {
  if (session && isSessionExpired === false) signOut().catch((error) => console.error(error));

  const { setSession, setLang } = useZustand();

  useEffect(() => {
    if (session) setSession(session);
    if (lang) setLang(lang);
  }, [session, lang]);

  return (
    <Suspense
      fallback={
        <main className="h-[100dvh] items-center justify-center flex flex-col gap-6 p-shorter">
          <Logo className="w-72 aspect-video" />
          <section className="flex flex-col text-center">
            <h6>HIDDEN GYM</h6>
            <small className="italic">eat sleep gym repeat</small>
          </section>
          <ClipLoader color={COLORS.orange} size={30} />
        </main>
      }
    >
      {children}
    </Suspense>
  );
}
