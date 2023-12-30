import { i18n } from "@/lib/internationalization";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const getLocaleFromPathname = (pathname: string) => {
  const lang = pathname.split("/")[1];
  const validation = z.enum(i18n.locales).safeParse(lang);
  if (validation.success) return validation.data;
  return undefined;
};

const getLocale = (request: NextRequest): string => {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get("accept-language");
  if (acceptLanguage) headers.set("accept-language", acceptLanguage.replaceAll("_", "-"));
  const headersObject = Object.fromEntries(headers.entries());
  const languages = new Negotiator({ headers: headersObject }).languages();
  if (languages.includes("*")) return i18n.defaultLocale;
  return match(languages, i18n.locales, i18n.defaultLocale);
};

export const middleware = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const storedLocale = request.cookies.get("locale")?.value;
  const locale = getLocaleFromPathname(pathname) ?? storedLocale ?? getLocale(request);
  const response = NextResponse.next();
  if (locale !== storedLocale) response.cookies.set("locale", locale, { httpOnly: true, sameSite: "lax" });
  const pathnameMissing = i18n.locales.every((locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`);
  if (pathnameMissing) {
    const newPath = `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  return response;
};

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
