import { USER_PATHNAMES } from "@/lib/constants";
import { getServerAuthSession } from "@/server/auth";
import { type Lang } from "@/types";
import { redirect } from "next/navigation";

type Props = { params: { lang: Lang } };

export default async function DashboardPageRedirector({ params }: Props) {
  const session = await getServerAuthSession();
  if (!session || !session.user) redirect(`/${params.lang}/signin`);
  return redirect(USER_PATHNAMES[session.user.role]);
}
