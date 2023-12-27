import { api } from "@/trpc/server";

export default async function PakcagesPage() {
  const data = await api.package.list.query();

  return <div></div>;
}
