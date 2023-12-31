import { type useDictionary } from "@/lib/dictionary";
import { type internationalization } from "@/lib/internationalization";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type SearchParams = Record<string, string | string[] | undefined>;
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEventHandler<HTMLButtonElement>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type Lang = (typeof internationalization)["locales"][number];
export type Dictionary = UnwrapPromise<ReturnType<typeof useDictionary>>;
