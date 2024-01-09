import { COLORS } from "@/styles/theme";
import { type AddButtonKey, type DashboardMenuKey, type Lang } from "@/types";
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
    key: "/payment-methods/create",
    children: undefined,
  },
  {
    label: "Promo Code",
    icon: ICONS.promo_codes,
    key: "/promo-codes/create",
    children: undefined,
  },
  {
    label: "Place",
    icon: ICONS.place,
    key: "/places/create",
    children: undefined,
  },
  {
    label: "Sport Type",
    icon: ICONS.sport,
    key: "/sport-types/create",
    children: undefined,
  },
  {
    label: "Package",
    icon: ICONS.package,
    key: "/packages/create",
    children: undefined,
  },
  {
    label: "Product",
    icon: ICONS.product,
    key: "/products/create",
    children: undefined,
  },
  {
    label: "Visit",
    icon: ICONS.visit,
    key: "/visits/create",
    children: undefined,
  },
  {
    label: "Schedule",
    icon: ICONS.schedule,
    key: "/schedules/create",
    children: undefined,
  },
  {
    label: "Transaction",
    icon: ICONS.transaction,
    key: "/transactions",
    children: [
      { label: "Package", key: "/transactions/packages/create" },
      { label: "Product", key: "/transactions/products/create" },
    ],
  },
  {
    label: "Visitor",
    icon: ICONS.visitor,
    key: "/visitors/create",
    children: undefined,
  },
] as const;

export const DASHBOARD_MENUS = [
  {
    title: "",
    key: "/",
    label: "Home",
    icon: ICONS.home,
    children: undefined,
  },
  {
    title: "",
    key: "/transactions",
    label: "Transactions",
    icon: ICONS.transaction,
    children: [
      {
        title: "",
        key: "/transactions/packages",
        label: "Packages",
      },
      {
        title: "",
        key: "/transactions/products",
        label: "Products",
      },
    ],
  },
  {
    title: "",
    key: "/visitors",
    label: "Visitors",
    icon: ICONS.visitor,
    children: undefined,
  },
  {
    title: "",
    key: "/trainers",
    label: "Trainers",
    icon: ICONS.trainer,
    children: undefined,
  },
  {
    title: "",
    key: "/packages",
    label: "Packages",
    icon: ICONS.package,
    children: undefined,
  },
  {
    title: "",
    key: "/products",
    label: "Products",
    icon: ICONS.product,
    children: undefined,
  },
  {
    title: "",
    key: "/visits",
    label: "Visits",
    icon: ICONS.visit,
    children: undefined,
  },
  {
    title: "",
    key: "/schedules",
    label: "Schedules",
    icon: ICONS.schedule,
    children: undefined,
  },
  {
    title: "",
    key: "/promo-codes",
    label: "Promo Codes",
    icon: ICONS.promo_codes,
    children: undefined,
  },
  {
    title: "",
    key: "/sport-types",
    label: "Sport Types",
    icon: ICONS.sport,
    children: undefined,
  },
  {
    title: "",
    key: "/places",
    label: "Places",
    icon: ICONS.place,
    children: undefined,
  },
  {
    title: "",
    key: "/payment-methods",
    label: "Payment Methods",
    icon: ICONS.payment_method,
    children: undefined,
  },
] as const;

export const DASHBOARD_MENUS_TO_REMOVE: Record<Role, DashboardMenuKey[]> = {
  ADMIN: [],
  OWNER: [],
  VISITOR: [],
  TRAINER: [],
};

export const ADD_BUTTON_ITEMS_TO_REMOVE: Record<Role, AddButtonKey[]> = {
  VISITOR: [],
  TRAINER: [],
  OWNER: [],
  ADMIN: [],
};

export const FILTERED_ADD_BUTTONS_ITEMS = (role: Role) =>
  ADD_BUTTON_ITEMS.filter((button) => !ADD_BUTTON_ITEMS_TO_REMOVE[role].includes(button.key));

export const FILTERED_DASHBOARD_MENU_ITEMS = (role: Role) =>
  DASHBOARD_MENUS.filter((menu) => !DASHBOARD_MENUS_TO_REMOVE[role].includes(menu.key));

export const DASHBOARD_SUB_MENUS = ["Detail", "Update", "Create"] as const;
