"use client";

import { REFETCH_INTERVAL } from "@/lib/constants";
import { schema } from "@/schema";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import Table from "@owner/visitors/components/Table";
import TableSearch from "@owner/visitors/components/TableSearch";
import TableSorter from "@owner/visitors/components/TableSorter";

type Props = {
  searchParams: SearchParams;
  params: { lang: Lang };
};

export default function VisitorsPage({ searchParams, params }: Props) {
  const query = schema.user.list.parse(searchParams);

  const { data, isLoading: loading } = api.user.list.useQuery({ ...query, role: "VISITOR" }, { refetchInterval: REFETCH_INTERVAL });

  return (
    <section className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-x-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <TableSearch loading={loading} lang={params.lang} searchParams={searchParams} />
        <Table loading={loading} lang={params.lang} data={data} searchParams={searchParams} />
      </section>
      <TableSorter lang={params.lang} />
    </section>
  );
}
