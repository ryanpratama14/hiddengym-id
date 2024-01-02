import { internationalization } from "@/lib/internationalization";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const getLangFromPathname = (pathname: string) => {
  const lang = pathname.split("/")[1];
  const validation = z.enum(internationalization.locales).safeParse(lang);
  if (validation.success) return validation.data;
  return undefined;
};

const getLang = (request: NextRequest): string => {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get("accept-language");
  if (acceptLanguage) headers.set("accept-language", acceptLanguage.replaceAll("_", "-"));
  const headersObject = Object.fromEntries(headers.entries());
  const languages = new Negotiator({ headers: headersObject }).languages();
  if (languages.includes("*")) return internationalization.defaultLocale;
  return match(languages, internationalization.locales, internationalization.defaultLocale);
};

export const middleware = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const storedLocale = request.cookies.get("locale")?.value;
  const locale = getLangFromPathname(pathname) ?? storedLocale ?? getLang(request);
  const response = NextResponse.next();
  if (locale !== storedLocale) response.cookies.set("locale", locale, { httpOnly: true, sameSite: "lax" });
  const pathnameMissing = internationalization.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );
  if (pathnameMissing) {
    const newPath = `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  return response;
};

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|images/*).*)"] };
