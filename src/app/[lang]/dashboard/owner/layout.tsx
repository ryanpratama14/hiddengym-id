import { USER_PATHNAMES } from "@/lib/constants";
import { type Locale } from "@/lib/internationalization";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import DashboardContainer from "@owner/components/DashboardContainer";
import { redirect } from "next/navigation";

type Props = { children: React.ReactNode; params: { lang: Locale } };

export default async function DashboardOwnerLayout({ children, params }: Props) {
  const session = await getServerAuthSession();
  const role = "OWNER";

  if (!session || !session.user || session.user.role !== role) redirect(`/${params.lang}/signin/?callbackUrl=${USER_PATHNAMES[role]}`);

  const user = await api.user.detailMe.query();

  return (
    <DashboardContainer lang={params.lang} user={user}>
      {children}
    </DashboardContainer>
  );
}
