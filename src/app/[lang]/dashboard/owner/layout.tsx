import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import DashboardOwnerContainer from "./components/DashboardOwnerContainer";
import { USER_PATHNAMES } from "@/lib/constants";
import { type Role } from "@prisma/client";
import { api } from "@/trpc/server";

type Props = { children: React.ReactNode };

export default async function DashboardOwnerLayout({ children }: Props) {
  const session = await getServerAuthSession();
  const role: Role = "OWNER";

  if (!session || !session.user || session.user.role !== role) redirect(`/signin/?callbackUrl=${USER_PATHNAMES[role]}`);

  const user = await api.user.detailMe.query();

  return <DashboardOwnerContainer user={user}>{children}</DashboardOwnerContainer>;
}
