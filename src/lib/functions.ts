import { COUNTRY_CODE, DASHBOARD_MENUS, DASHBOARD_SUB_MENUS, USER_PATHNAMES, USER_REDIRECT } from "@/lib/constants";
import { type DashboardMenuKey, type DashboardMenuLabel, type DashboardSubMenuKey, type Lang } from "@/types";
import { type Role } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

dayjs.extend(utc);
dayjs.extend(timezone);

export const loadToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const consoleError = (error: string) => {
  console.error(
    `❌ ${getNewDate().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })} 👉 ${error}`,
  );
};

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;
  return `${pathname}${queryString}`;
};

export const createSearchParams = (params: Record<string, string | string[]>, newParams?: URLSearchParams): URLSearchParams => {
  const updatedParams = new URLSearchParams(newParams);
  for (const [key, values] of Object.entries(params)) {
    if (Array.isArray(values)) {
      for (const value of values) {
        updatedParams.append(key, value);
      }
    } else {
      updatedParams.append(key, values);
    }
  }
  return updatedParams;
};

export const formatName = (name: string): string => {
  const trimmedName = name.trim();
  const words = trimmedName.split(/\s+/);
  const capitalizedWords = words.map((word) => {
    const lowercaseWord = word.toLowerCase();
    return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
  });
  const convertedName = capitalizedWords.join(" ");
  return convertedName;
};

export const getInputDate = (date?: Date): string => {
  const dateString = date ? dayjs(date) : dayjs().tz("Asia/Jakarta");
  return dateString.format("YYYY-MM-DD");
};

export const getTodayDate = ({ locale, style }: { locale: Lang; style: "short" | "long" }): string => {
  return getNewDate().toLocaleDateString(locale, {
    year: "numeric",
    month: style === "long" ? "long" : "numeric",
    day: "numeric",
  });
};

export const getNewDate = (dateString?: string): Date => {
  if (dateString) return new Date(dateString);
  return new Date();
};

export const getEndDate = (dateString: string): Date => dayjs.tz(dateString, "Asia/Jakarta").endOf("day").toDate();

export const getStartDate = (dateString: string): Date => dayjs.tz(dateString, "Asia/Jakarta").startOf("day").toDate();

export const getExpiryDate = ({ days, dateString }: { days: number; dateString: string }): Date => {
  const date = dayjs
    .tz(dateString, "Asia/Jakarta")
    .add(days - 1, "day")
    .endOf("day")
    .toDate();
  return date;
};

export const getUserAge = (birthDate: Date): number => {
  const currentDate = getNewDate();
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  if (
    birthDate.getMonth() > currentDate.getMonth() ||
    (birthDate.getMonth() === currentDate.getMonth() && birthDate.getDate() > currentDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const getRemainingDays = (targetDate: Date): number => {
  const currentDate = dayjs().tz("Asia/Jakarta").toDate();
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return remainingDays;
};

export const getTokenExpiryDate = (): Date => new Date(getNewDate().getTime() + 3600000); // 1 hour;

export const isDateExpired = (expiryDate: Date): boolean => {
  const remainingDays = getRemainingDays(expiryDate);
  if (remainingDays <= 0) return true;
  return false;
};

export const isDateToday = (date: Date): boolean => {
  const remainingDays = getRemainingDays(date);
  if (remainingDays === 1) return true;
  return false;
};

export const formatDate = ({
  date,
  lang,
  style,
  withTime,
}: {
  date: Date;
  lang?: Lang;
  style: "short" | "long";
  withTime?: boolean;
}): string => {
  return date.toLocaleDateString(lang ?? ["id-ID"], {
    year: "numeric",
    month: style === "long" ? "long" : "numeric",
    day: "numeric",

    ...(withTime ? { minute: "2-digit", hour: "2-digit" } : undefined),
  });
};

export const formatDateShort = ({ date, lang, withTime }: { date: Date; lang?: Lang; withTime?: boolean }): string => {
  return date.toLocaleDateString(lang ?? ["id-ID"], {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(withTime ? { minute: "2-digit", hour: "2-digit" } : undefined),
  });
};

export const formatDateLong = ({ date, lang, withTime }: { date: Date; lang?: Lang; withTime?: boolean }): string => {
  return date.toLocaleDateString(lang ?? ["id-ID"], {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(withTime ? { minute: "2-digit", hour: "2-digit" } : undefined),
  });
};

export const formatPhoneNumber = (phoneNumber: string): string => `${COUNTRY_CODE}${phoneNumber}`;
export const removeFormatPhoneNumber = (phoneNumber: string): string => phoneNumber.replace(COUNTRY_CODE, "");

export const localizePhoneNumber = (phoneNumber: string): string => {
  const formattedNumber = `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}-${phoneNumber.slice(10)}`;
  return formattedNumber;
};

type PowOf2 = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024;
type SizeUnit = "B" | "KB" | "MB" | "GB";
type FileSize = `${PowOf2}${SizeUnit}`;

const bytesInUnit: Record<SizeUnit, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

const powOf2: Record<PowOf2, number> = {
  1: 1,
  2: 2,
  4: 4,
  8: 8,
  16: 16,
  32: 32,
  64: 64,
  128: 128,
  256: 256,
  512: 512,
  1024: 1024,
};

export const isFileSizeAllowed = (maxFileSize: FileSize, fileSize: number): boolean => {
  const fileSizeRegex = /^(\d+)(B|KB|MB|GB)$/;
  const match = maxFileSize.match(fileSizeRegex);
  const size = parseInt(match![1]!, 10);
  const unit = match![2] as SizeUnit;

  const maxSize = powOf2[size as PowOf2] * bytesInUnit[unit as SizeUnit];
  if (fileSize < maxSize) return true;
  return false;
};

export const formatCurrency = (number: number) => {
  const formatter = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(number);
};

export const getSorterSlug = (slug: string | null) => {
  if (slug) {
    const [name, sorterer] = slug.split("-");
    return { name, sorterer };
  }
  return null;
};

export const textEllipsis = (text: string, length: number) => {
  if (!text) return "";
  return text.length < length ? `${text}` : `${text?.substring(0, length - 3)}...`;
};

export const getDashboardPathname = (pathname: string, role: Role): DashboardMenuKey[] => {
  const substring = USER_PATHNAMES[role];
  const startIndex = pathname.indexOf(substring);

  if (startIndex !== -1) {
    const extractedString = pathname.substring(startIndex + substring.length);
    const parts = extractedString.split("/").filter((part) => part !== "");
    const result = parts.map((_, index) => `/${parts.slice(0, index + 1).join("/")}`);
    if (result.length > 0) {
      return result as DashboardMenuKey[];
    } else {
      return ["/"];
    }
  } else {
    return [];
  }
};

type SelectedMenu = {
  label: DashboardMenuLabel | "";
  href: string;
  subName?: DashboardSubMenuKey;
  keys: DashboardMenuKey[];
};

export const getSelectedMenu = ({ pathname, role, lang }: { pathname: string; role: Role; lang: Lang }): SelectedMenu => {
  const selectedMenu: SelectedMenu = {
    label: "",
    href: "",
    subName: DASHBOARD_SUB_MENUS.find((value) => pathname.includes(value.toLowerCase())),
    keys: getDashboardPathname(pathname, role),
  };

  for (const path of selectedMenu.keys) {
    const menu = DASHBOARD_MENUS.find((item) => item.key === path);
    if (menu) {
      selectedMenu.label = menu.label;
      selectedMenu.href = USER_REDIRECT[role]({ lang, href: path });
      break;
    }
  }

  return selectedMenu;
};

export const accumulateValue = <T extends Record<K, number>, K extends keyof T>(array: T[], fieldName: K): T[K] => {
  return array.reduce((accumulator, item) => accumulator + item[fieldName], 0) as unknown as T[K];
};
