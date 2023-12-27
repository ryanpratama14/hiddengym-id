import { type Locale } from "@/i18n.config";
import { USER_PATHNAMES } from "@/lib/constants";
import { useDictionary } from "@/lib/dictionary";
import { type UserUpdateInput } from "@/server/api/routers/user";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import HomeContainer from "@owner/components/HomeContainer";
import { type Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Props = { params: { lang: Locale } };

export default async function DashboardOwnerPage({ params }: Props) {
  const session = await getServerAuthSession();
  const t = await useDictionary(params.lang);
  const role: Role = "OWNER";
  if (!session || !session.user) redirect(`/${params.lang}/signin/?callbackUrl=${USER_PATHNAMES[role]}`);

  const refreshUser = async () => {
    "use server";
    return revalidatePath("/");
  };

  const updateUser = async (data: UserUpdateInput) => {
    "use server";
    const res = await api.user.update.mutate(data);
    await refreshUser();
    return res;
  };

  const user = await api.user.detailMe.query();

  return <HomeContainer lang={params.lang} updateUser={updateUser} refreshUser={refreshUser} user={user} t={t} />;
}
