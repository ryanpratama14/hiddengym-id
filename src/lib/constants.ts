import { Locale } from "@/i18n.config";
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
};
