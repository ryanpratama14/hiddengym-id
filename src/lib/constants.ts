import { COLORS } from "@/styles/theme";
import { type AddButtonLabel, type DashboardMenuKey, type Lang } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { type Gender, type PackageTransaction, type PackageType, type PromoCodeType, type Role, type User } from "@prisma/client";

export const USER_LIST_SORTERERS: { name: keyof User; title: string }[] = [
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
  {
    name: "totalSpending",
    title: "Total Spending",
  },
];

export const PACKAGE_TRANSACTION_SORTERERS: { name: keyof PackageTransaction; title: string }[] = [
  {
    name: "transactionDate",
    title: "Transaction Date",
  },
  {
    name: "packageId",
    title: "Package",
  },
  {
    name: "paymentMethodId",
    title: "Payment Method",
  },
  {
    name: "expiryDate",
    title: "Expiry Date",
  },
  {
    name: "remainingSessions",
    title: "Remaining Sessions",
  },
  {
    name: "promoCodeId",
    title: "Promo Code",
  },
  {
    name: "buyerId",
    title: "Buyer",
  },
];

export const PACKAGE_TYPES: { label: string; value: PackageType }[] = [
  {
    label: "MEMBER",
    value: "MEMBER",
  },
  {
    label: "VISIT",
    value: "VISIT",
  },
  {
    label: "SESSIONS",
    value: "SESSIONS",
  },
];

export const PROMO_CODE_TYPES: { label: string; value: PromoCodeType }[] = [
  {
    label: "REGULAR",
    value: "REGULAR",
  },
  {
    label: "STUDENT",
    value: "STUDENT",
  },
];

export const USER_PATHNAMES: Record<Role, string> = {
  VISITOR: `/dashboard/visitor`,
  ADMIN: `/dashboard/admin`,
  OWNER: `/dashboard/owner`,
  TRAINER: `/dashboard/trainer`,
};

export const USER_REDIRECT = {
  VISITOR: ({ lang, href }: { lang: Lang; href: string }) => `/${lang}${USER_PATHNAMES.VISITOR}${href}`,
  ADMIN: ({ lang, href }: { lang: Lang; href: string }) => `/${lang}${USER_PATHNAMES.ADMIN}${href}`,
  OWNER: ({ lang, href }: { lang: Lang; href: string }) => `/${lang}${USER_PATHNAMES.OWNER}${href}`,
  TRAINER: ({ lang, href }: { lang: Lang; href: string }) => `/${lang}${USER_PATHNAMES.TRAINER}${href}`,
};

export const EMAIL_VISITOR_READONLY = "readonly@hiddengym-id.com";

export const COUNTRY_CODE = "+62";

export const MENU_ICON_SIZE = 25;

export const REFETCH_INTERVAL = 10_000;

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
  name: "mdi:rename-outline",
  invoice: "iconamoon:invoice",
  detail: "carbon:folder-details-reference",
  edit: "basil:edit-outline",
};

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

export const DETERMINE_GENDER: Record<
  Gender,
  { icon: IconifyIcon | string; value: Gender; label: string; color: string; picture: IconifyIcon | string }
> = {
  MALE: {
    icon: "material-symbols:male",
    picture: ICONS.male,
    value: "MALE",
    label: "Male",
    color: COLORS.blue,
  },
  FEMALE: {
    icon: "material-symbols:female",
    picture: ICONS.female,
    value: "FEMALE",
    label: "Female",
    color: "#ec4899",
  },
};

export const ADD_BUTTON_ITEMS = [
  {
    label: "Payment Method",
    icon: ICONS.payment_method,
    href: "/payment-methods/create",
  },
  {
    label: "Promo Code",
    icon: ICONS.promo_codes,
    href: "/promo-codes/create",
  },
  {
    label: "Place",
    icon: ICONS.place,
    href: "/places/create",
  },
  {
    label: "Sport Type",
    icon: ICONS.sport,
    href: "/sport-types/create",
  },
  {
    label: "Package",
    icon: ICONS.package,
    href: "/packages/create",
  },
  {
    label: "Product",
    icon: ICONS.product,
    href: "/packages/create",
  },
  {
    label: "Visit",
    icon: ICONS.visit,
    href: "/visits/create",
  },
  {
    label: "Schedule",
    icon: ICONS.schedule,
    href: "/schedules/create",
  },
  {
    label: "Transaction",
    icon: ICONS.transaction,
    href: "/transactions/create",
  },
  {
    label: "Visitor",
    icon: ICONS.visitor,
    href: "/visitors/create",
  },
] as const;

export const DASHBOARD_MENUS = {
  "/": "Home",
  "/visitors": "Visitors",
  "/trainers": "Trainers",
  "/packages": "Packages",
  "/products": "Products",
  "/transactions": "Transactions",
  "/transactions/packages": "Package Transactions",
  "/transactions/products": "Product Transactions",
  "/visits": "Visits",
  "/schedules": "Schedules",
  "/promo-codes": "Promo Codes",
  "/sport-types": "Sport Types",
  "/places": "Places",
  "/payment-methods": "Payment Methods",
} as const;

export const DASHBOARD_MENUS_TO_REMOVE: Record<Role, DashboardMenuKey[]> = {
  ADMIN: [],
  OWNER: [],
  VISITOR: [],
  TRAINER: [],
};

export const ADD_BUTTON_ITEMS_TO_REMOVE: Record<Role, AddButtonLabel[]> = {
  VISITOR: ["Package", "Product", "Schedule", "Transaction"],
  TRAINER: ["Package", "Product", "Transaction"],
  OWNER: [],
  ADMIN: [],
};

export const FILTERED_ADD_BUTTONS_ITEMS = (role: Role) =>
  ADD_BUTTON_ITEMS.filter((button) => !ADD_BUTTON_ITEMS_TO_REMOVE[role].includes(button.label));

export const DASHBOARD_SUB_MENUS = ["Detail", "Update", "Create"] as const;
