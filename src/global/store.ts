import { type Lang } from "@/types";
import { type Session } from "next-auth";
import { create } from "zustand";

type StateItems = {
  session: Session | null;
  lang: Lang;
  setSession: (session: Session) => void;
  setLang: (t: Lang) => void;
};

export const useStore = create<StateItems>((set) => ({
  session: null,
  lang: "en",
  setSession: (session) => set(() => ({ session })),
  setLang: (lang) => set(() => ({ lang })),
}));
