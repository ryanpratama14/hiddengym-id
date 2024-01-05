"use client";

import { schema } from "@/schema";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import Table from "@owner/visitors/components/Table";
import TableSearch from "@owner/visitors/components/TableSearch";
import TableSorter from "@owner/visitors/components/TableSorter";
import { z } from "zod";

type Props = {
  searchParams: SearchParams;
  params: { lang: Lang };
};

export default function VisitorsPage({ searchParams, params }: Props) {
  const searchParamsSchema = z.object({
    ...schema.searchParams.pagination.shape,
    q: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
    gender: schema.gender.optional(),
    totalSpending: z.coerce.number().optional(),
    sort: z.string().optional(),
  });

  const query = searchParamsSchema.parse(searchParams);

  const { data, isLoading: loading } = api.user.list.useQuery({
    pagination: {
      page: query.page,
      limit: query.limit,
    },
    params: {
      fullName: query.q,
      phoneNumber: query.phoneNumber,
      email: query.email,
      gender: query.gender,
      role: "VISITOR",
      totalSpending: query.totalSpending,
    },
    sorting: query.sort,
  });

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
