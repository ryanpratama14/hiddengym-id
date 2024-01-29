import { USER_PATHNAMES } from "@/lib/constants";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  if (session) redirect(USER_PATHNAMES[session.user.role]);
  return redirect("/signin");
}
