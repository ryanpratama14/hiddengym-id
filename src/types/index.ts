import { type ADD_BUTTON_ITEMS, type DASHBOARD_MENUS, type DASHBOARD_SUB_MENUS } from "@/lib/constants";
import { type useDictionary } from "@/lib/dictionary";
import { type internationalization } from "@/lib/internationalization";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type SearchParams = Record<string, string | string[] | undefined>;
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEventHandler<HTMLButtonElement>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type Lang = (typeof internationalization)["locales"][number];
export type Dictionary = UnwrapPromise<ReturnType<typeof useDictionary>>;
export type DashboardMenuLabel = (typeof DASHBOARD_MENUS)[keyof typeof DASHBOARD_MENUS];
export type DashboardMenuKey = keyof typeof DASHBOARD_MENUS;
export type DashboardSubMenuKey = (typeof DASHBOARD_SUB_MENUS)[number];
export type AddButtonLabel = (typeof ADD_BUTTON_ITEMS)[number]["label"];
export type AddButtonKey = (typeof ADD_BUTTON_ITEMS)[number]["href"];
