import { api } from "@/trpc/server";
import { type UserListInput } from "@/server/api/routers/user";
import { type Gender } from "@prisma/client";
import { type Locale } from "@/i18n.config";
import VisitorsTableSearch from "./components/VisitorsTableSearch";
import VisitorsTable from "./components/VisitorsTable";
import VisitorsTableSorter from "./components/VisitorsTableSorter";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  params: { lang: Locale };
};

export default async function VisitorsPage({ searchParams, params }: Props) {
  const query: UserListInput = {
    pagination: {
      page: Number(searchParams.page) || 1,
      limit: Number(searchParams.limit) || 30,
    },
    params: {
      fullName: searchParams.q as string,
      phoneNumber: searchParams.phoneNumber as string,
      email: searchParams.email as string,
      gender: searchParams.gender as Gender,
      role: "VISITOR",
    },
    sorting: searchParams.sort as string,
  };

  const data = await api.user.list.query(query);

  return (
    <section className="grid grid-cols-1 md:grid-cols-5 gap-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <VisitorsTableSearch lang={params.lang} query={query} />
        <VisitorsTable lang={params.lang} data={data} searchParams={searchParams} />
      </section>
      <VisitorsTableSorter lang={params.lang} />
    </section>
  );
}
