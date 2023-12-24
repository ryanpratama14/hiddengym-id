import { type ReadonlyURLSearchParams } from "next/navigation";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Locale } from "@/i18n.config";
import { COUNTRY_CODE, USER_PATHNAMES } from "./constants";
import { type Role } from "@prisma/client";

export const loadToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const consoleError = (error: string) => {
  console.error(
    `❌ ${getNewDate().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })} 👉 ${error}`
  );
};

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;
  return `${pathname}${queryString}`;
};

export const createSearchParams = (
  params: Record<string, string | string[]>,
  newParams?: URLSearchParams
): URLSearchParams => {
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
  const words = trimmedName.split(/\s+/); // Split by one or more spaces
  const capitalizedWords = words.map((word) => {
    const lowercaseWord = word.toLowerCase();
    return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
  });
  const convertedName = capitalizedWords.join(" ");
  return convertedName;
};

export const getTodayDate = () => {
  const date = getNewDate();
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayDateLong = (locale: Locale): string => {
  return getNewDate().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getNewDate = (dateString?: string): Date => {
  if (dateString) return new Date(dateString);
  return new Date();
};

export const getStartDate = (dateString: string): Date => {
  const updatedDate = getNewDate(dateString);
  updatedDate.setHours(0, 0, 0, 0);
  return updatedDate;
};

export const getEndDate = (dateString: string): Date => {
  const updatedDate = getNewDate(dateString);
  updatedDate.setHours(23, 59, 59, 999);
  return updatedDate;
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

export const getTokenExpiryDate = (): Date => new Date(getNewDate().getTime() + 3600000); // 1 hour;

export const getExpiryDate = ({ days, isVisit = false }: { days: number; isVisit?: boolean }): Date => {
  const date = getNewDate();
  date.setDate(date.getDate() + days - (isVisit ? 1 : 0));
  date.setHours(23, 59, 59, 999);
  return date;
};

export const getExpiryDateFromDate = (dateString: string): Date => {
  const date = getNewDate(dateString);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const getTodayExpiryDate = (): Date => {
  const date = getNewDate();
  date.setHours(23, 59, 59, 999);
  return date;
};

export const getRemainingDays = ({ expiryDate, isVisit = false }: { expiryDate: Date; isVisit?: boolean }): number => {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const targetYear = expiryDate.getFullYear();
  const targetMonth = expiryDate.getMonth();
  const targetDay = expiryDate.getDate() + (isVisit ? 1 : 0);

  let remainingDays = 0;

  if (currentYear === targetYear && currentMonth === targetMonth) {
    remainingDays = targetDay - currentDay;
  } else {
    const lastMonthDays = new Date(targetYear, targetMonth, 0).getDate();
    remainingDays = lastMonthDays - currentDay + targetDay;
  }

  return remainingDays;
};

export const isDateExpired = (expiryDate: Date): boolean => expiryDate <= getNewDate();

export const isDateToday = (date: Date): boolean => {
  const currentDate = getNewDate();
  return (
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  );
};

export const formatDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateLong = (date: Date, locale: Locale): string => {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatPhoneNumber = (phoneNumber: string): string => `${COUNTRY_CODE}${phoneNumber}`;
export const removeFormatPhoneNumber = (phoneNumber: string): string => phoneNumber.replace(COUNTRY_CODE, "");

export const lozalizePhoneNumber = (phoneNumber: string): string => {
  const formattedNumber = `${COUNTRY_CODE} ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}-${phoneNumber.slice(10)}`;
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

export const getDashboardPathname = (pathname: string, role: Role): string[] => {
  const substring = USER_PATHNAMES[role];
  const startIndex = pathname.indexOf(substring);

  if (startIndex !== -1) {
    const extractedString = pathname.substring(startIndex + substring.length);
    const parts = extractedString.split("/").filter((part) => part !== "");
    const result = parts.map((_, index) => `/${parts.slice(0, index + 1).join("/")}`);
    if (result.length > 0) {
      return result;
    } else {
      return ["/"];
    }
  } else {
    return [];
  }
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
