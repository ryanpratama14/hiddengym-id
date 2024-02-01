import {
  COUNTRY_CODE,
  DASHBOARD_MENUS,
  DASHBOARD_SUB_MENUS,
  DETERMINE_TIME_ZONE,
  TIME_ZONES,
  USER_PATHNAMES,
  USER_REDIRECT,
} from "@/lib/constants";
import type { ActionButtonAction, DashboardMenuKey, DashboardSubMenuKey, Lang } from "@/types";
import type { Role } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

dayjs.extend(utc);
dayjs.extend(timezone);

export const loadToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const consoleError = (error: string) => {
  console.error(
    `❌ ${dayjs().toDate().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })} 👉 ${error}`,
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

export const getTodayDate = ({ locale, style }: { locale: Lang; style: "short" | "long" }): string => {
  return getNewDate().toLocaleDateString(locale, {
    year: "numeric",
    month: style === "long" ? "long" : "numeric",
    day: "numeric",
  });
};

export const getNewDate = (dateString?: string): Date => {
  if (dateString) return dayjs.utc(dateString).toDate();
  return dayjs().toDate();
};

export const getInputDate = ({ date, tz }: { date?: Date; tz?: string }): string => {
  const dateString = date ? dayjs(date) : dayjs().tz(tz ?? TIME_ZONES.WIB.value);
  return dateString.format("YYYY-MM-DD");
};

export const getEndDate = (dateString: string): Date => dayjs.utc(dateString).endOf("day").toDate();

export const getStartDate = (dateString: string): Date => dayjs.utc(dateString).startOf("day").toDate();

export const getExpiryDate = ({ days, dateString }: { days: number; dateString: string }): Date => {
  const date = dayjs
    .utc(dateString)
    .add(days - 1, "day")
    .endOf("day")
    .toDate();
  return date;
};

export const getUserAge = (birthDate: Date): number => {
  const currentDate = dayjs();
  const adjustedBirthDate = dayjs(birthDate);
  const age = currentDate.diff(adjustedBirthDate, "year");
  return age;
};

export const getRemainingDays = (targetDate: Date, tz: string): number => {
  const currentDate = dayjs().toDate();
  const timeZoneOffset = dayjs.tz(targetDate, tz).utcOffset();
  const adjustedTargetDate = dayjs(targetDate).subtract(timeZoneOffset, "minute");
  const timeDifference = adjustedTargetDate.diff(currentDate, "millisecond");
  const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return remainingDays;
};

export const getRemainingDate = (targetDate: Date, tz: string): string => {
  const currentDate = dayjs().toDate();
  const timeZoneOffset = dayjs.tz(targetDate, tz).utcOffset();
  const adjustedTargetDate = dayjs(targetDate).subtract(timeZoneOffset, "minute");
  const timeDifference = adjustedTargetDate.diff(currentDate, "millisecond");
  const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  if (remainingDays <= 0) return "Expired";
  if (remainingDays === 1) return "Today";
  return formatDateShort({ date: adjustedTargetDate.toDate(), utc: true });
};

export const getTokenExpiryDate = (): Date => dayjs().add(1, "hour").toDate();

export const isDateFuture = (startDate: Date, tz: string) => {
  const currentDate = dayjs().toDate();
  const timeZoneOffset = dayjs.tz(startDate, tz).utcOffset();
  const adjustedStartDate = dayjs(startDate).subtract(timeZoneOffset, "minute").toDate();
  const daysUntilStart = Math.ceil((adjustedStartDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilStart > 0) return daysUntilStart;
  return 0;
};

export const isDateExpired = (expiryDate: Date, tz: string): boolean => {
  const remainingDays = getRemainingDays(expiryDate, tz);
  if (remainingDays <= 0) return true;
  return false;
};

export const isDateToday = (date: Date, tz: string): boolean => {
  const remainingDays = getRemainingDays(date, tz);
  if (remainingDays === 1) return true;
  return false;
};

export const isTxnDateToday = (txnDate: Date): boolean => {
  const currentDate = dayjs().toDate();
  const adjustedTxnDate = dayjs(txnDate).endOf("day");
  const timeDifference = adjustedTxnDate.diff(currentDate, "millisecond");
  const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  if (remainingDays === 1) return true;
  return false;
};

export const formatDate = ({
  date,
  lang,
  style,
  withTime,
  utc,
  tz,
}: {
  date: Date;
  lang?: Lang;
  style: "short" | "long";
  withTime?: boolean;
  utc?: boolean;
  tz?: string;
}): string => {
  return `${date.toLocaleDateString(lang ?? ["en-MY"], {
    year: "numeric",
    month: style === "long" ? "long" : "numeric",
    day: "numeric",
    timeZone: utc ? "UTC" : undefined,
    ...(withTime ? { minute: "2-digit", hour: "2-digit" } : undefined),
  })}${tz ? `, ${DETERMINE_TIME_ZONE(tz)}` : ""}`;
};

export const formatDateShort = ({
  date,
  lang,
  withTime,
  utc,
  tz,
}: {
  date: Date;
  lang?: Lang;
  withTime?: boolean;
  utc?: boolean;
  tz?: string;
}): string => {
  return `${date.toLocaleDateString(lang ?? ["en-MY"], {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: utc ? "UTC" : undefined,
    ...(withTime ? { minute: "2-digit", hour: "2-digit" } : undefined),
  })}${tz ? `, ${DETERMINE_TIME_ZONE(tz)}` : ""}`;
};

export const formatDateLong = ({
  date,
  lang,
  withTime,
  utc,
  tz,
}: {
  date: Date;
  lang?: Lang;
  withTime?: boolean;
  utc?: boolean;
  tz?: string;
}): string => {
  return `${date.toLocaleDateString(lang ?? ["en-MY"], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: utc ? "UTC" : undefined,
    ...(withTime ? { minute: "2-digit", hour: "2-digit" } : undefined),
  })}${tz ? `, ${DETERMINE_TIME_ZONE(tz)}` : ""}`;
};

export const localizePhoneNumber = (phoneNumber: string): string => {
  const localizedPhoneNumber = `${COUNTRY_CODE}${phoneNumber}`;
  const formattedNumber = `${localizedPhoneNumber.slice(0, 3)} ${localizedPhoneNumber.slice(3, 6)}-${localizedPhoneNumber.slice(
    6,
    10,
  )}-${localizedPhoneNumber.slice(10)}`;
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

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const size = parseInt(match?.[1]!, 10);
  const unit = match?.[2] as SizeUnit;

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
    }
    return ["/"];
  }
  return [];
};

type SelectedMenu = {
  subName?: DashboardSubMenuKey;
  keys: DashboardMenuKey[];
  menus: { label: string; href: string }[];
};

export const getSelectedMenu = ({ pathname, role, lang }: { pathname: string; role: Role; lang: Lang }): SelectedMenu => {
  const selectedMenu: SelectedMenu = {
    subName: DASHBOARD_SUB_MENUS.find((value) => pathname.includes(value.toLowerCase())),
    keys: getDashboardPathname(pathname, role),
    menus: [],
  };

  for (const path of selectedMenu.keys) {
    const menu = DASHBOARD_MENUS.find((item) => item.key === path);
    if (menu) {
      if (menu.children?.length) {
        for (const path of selectedMenu.keys) {
          const childrenMenu = menu.children?.find((e) => e.key === path);
          if (childrenMenu) {
            selectedMenu.menus.push({
              label: childrenMenu.extendedLabel,
              href: USER_REDIRECT({ role, lang, href: childrenMenu.key }),
            });
          }
        }
      } else selectedMenu.menus.push({ label: menu.label, href: USER_REDIRECT({ role, lang, href: menu.key }) });
    }
  }

  return selectedMenu;
};

export const accumulateValue = <T extends Record<K, number>, K extends keyof T>(array: T[], fieldName: K): T[K] => {
  return array.reduce((accumulator, item) => accumulator + item[fieldName], 0) as unknown as T[K];
};

export const closeModal =
  ({
    action,
    newParams,
    redirect,
  }: {
    action: ActionButtonAction;
    newParams: URLSearchParams;
    redirect: (newParams: URLSearchParams) => void;
  }) =>
  () => {
    newParams.delete("id");
    newParams.delete(action);
    redirect(newParams);
  };

export const openModal =
  ({
    id,
    action,
    newParams,
    redirect,
  }: {
    id: string;
    action: ActionButtonAction;
    newParams: URLSearchParams;
    redirect: (newParams: URLSearchParams) => void;
  }) =>
  () => {
    newParams.set("id", id);
    newParams.set(action, "true");
    redirect(newParams);
  };
