import { type Locale } from "@/i18n.config";
import { type UserListInput } from "@/server/api/routers/user";
import { api } from "@/trpc/server";
import { type SearchParams } from "@/types";
import Table from "@owner/visitors/components/Table";
import TableSearch from "@owner/visitors/components/TableSearch";
import TableSorter from "@owner/visitors/components/TableSorter";
import { type Gender } from "@prisma/client";

type Props = {
  searchParams: SearchParams;
  params: { lang: Locale };
};

export default async function VisitorsPage({ searchParams, params }: Props) {
  const query: UserListInput = {
    pagination: {
      page: Number(searchParams.page) || 1,
      limit: searchParams.limit ? Number(searchParams.limit) : undefined,
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
        <TableSearch lang={params.lang} query={query} />
        <Table lang={params.lang} data={data} searchParams={searchParams} />
      </section>
      <TableSorter lang={params.lang} />
    </section>
  );
}
