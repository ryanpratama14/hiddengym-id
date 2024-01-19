import { USER_PATHNAMES } from "@/lib/constants";
import { useDictionary } from "@/lib/dictionary";
import { getServerAuthSession } from "@/server/auth";
import { type Lang, type SearchParams } from "@/types";
import SignInContainer from "~/signin/components/SignInContainer";
import { redirect } from "next/navigation";

type Props = {
  searchParams: SearchParams;
  params: { lang: Lang };
};

export default async function SignInPage({ searchParams, params }: Props) {
  const session = await getServerAuthSession();
  if (session && session.user) redirect(USER_PATHNAMES[session.user.role]);
  const t = await useDictionary(params.lang);
  return <SignInContainer callbackUrl={searchParams.callbackUrl} t={t} />;
}
