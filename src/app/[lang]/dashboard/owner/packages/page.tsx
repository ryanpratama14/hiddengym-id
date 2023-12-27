import { api } from "@/trpc/server";

export default async function PakcagesPage() {
  const data = await api.package.list.query();
  console.log(data);

  return <div></div>;
}
