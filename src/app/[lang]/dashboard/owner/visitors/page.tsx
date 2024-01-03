"use client";

import { type UserListInput } from "@/server/api/routers/user";
import { api } from "@/trpc/react";
import { PAGINATION_LIMIT } from "@/trpc/shared";
import { type Lang, type SearchParams } from "@/types";
import Table from "@owner/visitors/components/Table";
import TableSearch from "@owner/visitors/components/TableSearch";
import TableSorter from "@owner/visitors/components/TableSorter";
import { type Gender } from "@prisma/client";

type Props = {
  searchParams: SearchParams;
  params: { lang: Lang };
};

export default function VisitorsPage({ searchParams, params }: Props) {
  const query: UserListInput = {
    pagination: {
      page: Number(searchParams.page) || 1,
      limit: Number(searchParams.limit) || PAGINATION_LIMIT,
    },
    params: {
      fullName: searchParams.q as string,
      phoneNumber: searchParams.phoneNumber as string,
      email: searchParams.email as string,
      gender: searchParams.gender as Gender,
      role: "VISITOR",
      totalSpending: searchParams.totalSpending ? Number(searchParams.totalSpending) : undefined,
    },
    sorting: searchParams.sort as string,
  };

  const { data, isLoading: loading } = api.user.list.useQuery(query);

  return (
    <section className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-x-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <TableSearch loading={loading} lang={params.lang} query={query} />
        <Table loading={loading} lang={params.lang} data={data} searchParams={searchParams} />
      </section>
      <TableSorter lang={params.lang} />
    </section>
  );
}
