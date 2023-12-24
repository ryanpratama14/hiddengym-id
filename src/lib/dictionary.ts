import "server-only";
import type { Locale } from "@/i18n.config";

const dictionaries = {
  en: () => import("#/locales/en.json").then((module) => module.default),
  // id: () => import("#/locales/id.json").then((module) => module.default),
};

export const useDictionary = async (locale: Locale) => await dictionaries[locale]();

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type Dictionary = UnwrapPromise<ReturnType<typeof useDictionary>>;
