import { type Locale } from "@/i18n.config";
import { COLORS } from "@/styles/theme";
import { type Gender, type Role } from "@prisma/client";

export const USER_LIST_SORTERERS = [
  {
    name: "fullName",
    title: "Name",
  },
  {
    name: "phoneNumber",
    title: "Phone Number",
  },
  {
    name: "email",
    title: "Email",
  },
  {
    name: "gender",
    title: "Gender",
  },
];

export const GENDERS: {
  value: Gender;
  icon: string;
  label: string;
  color: string;
}[] = [
  {
    icon: "material-symbols:male",
    value: "MALE",
    label: "Male",
    color: COLORS.blue,
  },
  {
    icon: "material-symbols:female",
    value: "FEMALE",
    label: "Female",
    color: "#ec4899",
  },
];

export const USER_PATHNAMES: Record<Role, string> = {
  VISITOR: `/dashboard/visitor`,
  ADMIN: `/dashboard/admin`,
  OWNER: `/dashboard/owner`,
  TRAINER: `/dashboard/trainer`,
};

export const USER_REDIRECT = {
  VISITOR: ({ lang, href }: { lang: Locale; href: string }) => `/${lang}${USER_PATHNAMES.VISITOR}${href}`,
  ADMIN: ({ lang, href }: { lang: Locale; href: string }) => `/${lang}${USER_PATHNAMES.ADMIN}${href}`,
  OWNER: ({ lang, href }: { lang: Locale; href: string }) => `/${lang}${USER_PATHNAMES.OWNER}${href}`,
  TRAINER: ({ lang, href }: { lang: Locale; href: string }) => `/${lang}${USER_PATHNAMES.TRAINER}${href}`,
};

export const EMAIL_VISITOR_READONLY = "readonly@hiddengym-id.com";

export const COUNTRY_CODE = "+62";

export const ICONS = {
  search: "material-symbols:search",
  searchName: "icon-park-outline:edit-name",
  email: "ic:outline-email",
  noProfileImage: "fluent:person-32-regular",
  female: "mdi:face-female",
  male: "mdi:face-male",
  signout: "material-symbols:logout",
  phone: "ph:phone",
  password: "mdi:password-outline",
  arrow: "typcn:arrow-up-outline",
  loading: "line-md:loading-loop",
  close: "mdi:close",
  add: "mdi:plus",
  home: "tabler:home",
  visitor: "ic:baseline-people",
  trainer: "icon-park-outline:gymnastics",
  package: "iconoir:gym",
  product: "material-symbols:grocery",
  transaction: "icon-park-outline:transaction",
  visit: "fluent-mdl2:user-event",
  schedule: "akar-icons:schedule",
  promo_codes: "ic:outline-local-offer",
  sport: "icon-park-outline:sport",
  place: "ic:outline-place",
  payment_method: "material-symbols:payments-outline",
  person: "material-symbols:person-outline",
  success: "icon-park-solid:folder-success",
  error: "icon-park-solid:folder-failed",
  info: "icon-park-solid:info",
  warning: "material-symbols:warning",
  check: "mdi:check",
  session: "carbon:prompt-session",
  validity: "game-icons:duration",
  url: "tabler:link",
};

export const ADD_BUTTON_ITEMS_TO_REMOVE: Record<Role, string[]> = {
  VISITOR: ["Package", "Product", "Schedule", "Transaction", "Consumer"],
  TRAINER: ["Package", "Product", "Transaction"],
  OWNER: [],
  ADMIN: [],
};

export const ADD_BUTTON_ITEMS = (role: Role, lang: Locale) => [
  {
    label: "Promo Code",
    icon: ICONS.promo_codes,
    href: USER_REDIRECT[role]({ lang, href: "/promo-codes/create" }),
  },
  {
    label: "Place",
    icon: ICONS.place,
    href: USER_REDIRECT[role]({ lang, href: "/places/create" }),
  },
  {
    label: "Sport Type",
    icon: ICONS.sport,
    href: USER_REDIRECT[role]({ lang, href: "/sport-types/create" }),
  },
  {
    label: "Package",
    icon: ICONS.package,
    href: USER_REDIRECT[role]({ lang, href: "/packages/create" }),
  },
  {
    label: "Product",
    icon: ICONS.product,
    href: USER_REDIRECT[role]({ lang, href: "/products/create" }),
  },
  {
    label: "Visit",
    icon: ICONS.visit,
    href: USER_REDIRECT[role]({ lang, href: "/visits/create" }),
  },
  {
    label: "Schedule",
    icon: ICONS.schedule,
    href: USER_REDIRECT[role]({ lang, href: "/schedules/create" }),
  },
  {
    label: "Transaction",
    icon: ICONS.transaction,
    href: USER_REDIRECT[role]({ lang, href: "/transactions/create" }),
  },
  {
    label: "Visitor",
    icon: ICONS.visitor,
    href: USER_REDIRECT[role]({ lang, href: "/visitors/create" }),
  },
];

export const DASHBOARD_MENUS: Record<string, string> = {
  "/": "Home",
  "/visitors": "Visitors",
  "/trainers": "Trainers",
  "/packages": "Packages",
  "/products": "Products",
  "/transactions/packages": "Package Transactions",
  "/transactions/products": "Product Transactions",
  "/visits": "Visits",
  "/schedules": "Schedules",
  "/promo-codes": "Promo Codes",
  "/sport-types": "Sport Types",
  "/places": "Places",
  "/payment-methods": "Payment Methods",
};

export const DASHBOARD_SUB_MENUS = ["Detail", "Update", "Create"];
