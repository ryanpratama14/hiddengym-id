"use client";

import { useZustand } from "@/global/store";
import { type Lang } from "@/types";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

type Props = {
  lang: Lang;
  session: Session | null;
  children: React.ReactNode;
  isSessionExpired?: boolean | undefined;
};

export default function HigherOrderComponent({ lang, session, children, isSessionExpired }: Props) {
  if (session && isSessionExpired === false) signOut().catch((error) => console.error(error));

  const { setSession, setLang } = useZustand();

  useEffect(() => {
    if (session) setSession(session);
    if (lang) setLang(lang);
  }, [session, lang]);

  return children;
}
