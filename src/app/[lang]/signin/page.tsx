import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { USER_PATHNAMES } from "@/lib/constants";
import SignInContainer from "~/signin/components/SignInContainer";
import { type SearchParams } from "@/types";

type Props = {
  searchParams: SearchParams;
  params: { lang: Locale };
};

export default async function SignInPage({ searchParams, params }: Props) {
  const session = await getServerAuthSession();
  if (session && session.user) redirect(USER_PATHNAMES[session.user.role]);
  const t = await useDictionary(params.lang);
  return <SignInContainer callbackUrl={searchParams.callbackUrl as string} t={t} lang={params.lang} />;
}
