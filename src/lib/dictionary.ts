import { type Lang } from "@/types";
import "server-only";

const dictionaries = {
  en: () => import("#/locales/en.json").then((module) => module.default),
  // id: () => import("#/locales/id.json").then((module) => module.default),
};

export const useDictionary = async (lang: Lang) => await dictionaries[lang]();
