"use client";

import { useStore } from "@/global/store";
import { type Lang } from "@/types";
import { type Session } from "next-auth";
import { Fragment, useEffect } from "react";

type Props = {
  lang: Lang;
  session: Session | null;
};

export default function GlobalHelper({ lang, session }: Props) {
  const { setSession, setLang } = useStore();

  useEffect(() => {
    if (session) setSession(session);
    if (lang) setLang(lang);
  }, [session, lang]);
  return <Fragment />;
}
