import type { Dictionary, Lang } from "@/types";
import type { Session } from "next-auth";
import { create } from "zustand";

type StateItems = {
  session: Session | null;
  lang: Lang;
  t: Dictionary | null;
  setSession: (session: Session) => void;
  setLang: (lang: Lang) => void;
  setT: (t: Dictionary) => void;
};

export const useZustand = create<StateItems>((set) => ({
  session: null,
  lang: "en",
  t: null,
  setSession: (session) => set(() => ({ session })),
  setLang: (lang) => set(() => ({ lang })),
  setT: (t) => set(() => ({ t })),
}));
