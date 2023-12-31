import { USER_PATHNAMES } from "@/lib/constants";
import { useDictionary } from "@/lib/dictionary";
import { getServerAuthSession } from "@/server/auth";
import { type Lang, type SearchParams } from "@/types";
// components
import SignInVisitor from "~/signin-visitor/components/SignInVisitor";
import SignInVisitorHeader from "~/signin-visitor/components/SignInVisitorHeader";
import { redirect } from "next/navigation";

type Props = {
  searchParams: SearchParams;
  params: { lang: Lang };
};

export default async function SignInVisitorPage({ searchParams, params }: Props) {
  const session = await getServerAuthSession();
  if (session && session.user) redirect(USER_PATHNAMES[session.user.role]);
  const t = await useDictionary(params.lang);

  return (
    <article className="flex items-center justify-center min-h-screen">
      <section className="flex md:flex-row flex-col md:flex-nowrap flex-wrap md:w-[80%] w-full md:bg-light">
        <section className="md:w-[50%] w-full flex items-center justify-center max-md:border-b-2 border-dark max-md:rounded-b-full bg-cream aspect-[4/3] md:aspect-square">
          <SignInVisitorHeader />
        </section>
        <section className="md:shadow-lg gap-8 p-normal md:w-[50%] w-full  md:bg-light flex flex-col justify-center items-center aspect-square">
          <h4>{t.login.welcomeBack}</h4>
          <SignInVisitor callbackUrl={searchParams.callbackUrl as string} t={t} lang={params.lang} />
        </section>
      </section>
    </article>
  );
}
