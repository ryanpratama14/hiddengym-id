import { type Locale } from "@/i18n.config";
import { USER_PATHNAMES } from "@/lib/constants";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type Role } from "@prisma/client";
import { redirect } from "next/navigation";
import DashboardOwnerContainer from "./components/DashboardOwnerContainer";

type Props = { children: React.ReactNode; params: { lang: Locale } };

export default async function DashboardOwnerLayout({ children, params }: Props) {
  const session = await getServerAuthSession();
  const role: Role = "OWNER";

  if (!session || !session.user || session.user.role !== role) redirect(`/${params.lang}/signin/?callbackUrl=${USER_PATHNAMES[role]}`);

  const user = await api.user.detailMe.query();

  return (
    <DashboardOwnerContainer lang={params.lang} user={user}>
      {children}
    </DashboardOwnerContainer>
  );
}
