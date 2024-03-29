import type { ADD_BUTTON_ITEMS, DASHBOARD_MENUS, DASHBOARD_SUB_MENUS } from "@/lib/constants";
import type { useDictionary } from "@/lib/dictionary";
import type { internationalization } from "@/lib/internationalization";

export type SearchParams = Record<string, string>;
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEventHandler<HTMLButtonElement>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type Lang = (typeof internationalization)["locales"][number];
export type Dictionary = Awaited<ReturnType<typeof useDictionary>>;
export type DashboardSubMenuKey = (typeof DASHBOARD_SUB_MENUS)[number];
export type AddButtonLabel = (typeof ADD_BUTTON_ITEMS)[number]["label"];
export type AddButtonKey =
  | (typeof ADD_BUTTON_ITEMS)[number]["key"]
  | "/transactions/packages/create"
  | "/transactions/products/create"
  | "/transactions"
  | "/transactions/packages"
  | "/transactions/products";

export type DashboardMenuLabel = (typeof DASHBOARD_MENUS)[number]["label"];
export type DashboardMenuKey = (typeof DASHBOARD_MENUS)[number]["key"] | "/transactions/packages" | "/transactions/products";
export type DashboardHrefKey = DashboardMenuKey | AddButtonKey | "" | "/visitors/detail";
export type ProfileButtonKey = "changePassword" | "signOut";
export type NewParamsAction = "delete" | "set";
export type ActionButtonAction = "detail" | "update" | "create" | "delete";
