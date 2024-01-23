"use client";

import { useZustand } from "@/global/store";
import type { Dictionary, Lang } from "@/types";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

type Props = {
  lang: Lang;
  session: Session | null;
  children: React.ReactNode;
  isSessionExpired: boolean | undefined;
  t: Dictionary;
};

export default function HigherOrderComponent({ lang, session, children, isSessionExpired, t }: Props) {
  if (session && isSessionExpired === false) signOut().catch((error) => console.error(error));

  const { setSession, setLang, setT } = useZustand();

  useEffect(() => {
    if (session) setSession(session);
    if (lang) setLang(lang);
    if (t) setT(t);
  }, [session, lang, t]);

  return children;
}
