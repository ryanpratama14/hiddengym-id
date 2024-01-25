import { actionUserUpdate, revalidateCache } from "@/lib/actions";
import { USER_PATHNAMES } from "@/lib/constants";
import { useDictionary } from "@/lib/dictionary";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type Lang } from "@/types";
import HomeContainer from "@owner/components/HomeContainer";
import { type Role } from "@prisma/client";
import { redirect } from "next/navigation";

type Props = { params: { lang: Lang } };

export default async function DashboardOwnerPage({ params }: Props) {
  const session = await getServerAuthSession();
  const t = await useDictionary(params.lang);
  const role: Role = "OWNER";
  if (!session || !session.user) redirect(`/${params.lang}/signin/?callbackUrl=${USER_PATHNAMES[role]}`);

  const user = await api.user.detailMe.query();

  return <HomeContainer lang={params.lang} actionUserUpdate={actionUserUpdate} revalidateCache={revalidateCache} user={user} t={t} />;
}
