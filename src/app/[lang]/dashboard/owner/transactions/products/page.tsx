"use client";

import { REFETCH_INTERVAL } from "@/lib/constants";
import { schema } from "@/schema";
import { api } from "@/trpc/react";
import { type SearchParams } from "@/types";
import Table from "./components/Table";
import TableSorter from "./components/TableSorter";

type Props = { searchParams: SearchParams };

export default function TransactionsProductsPage({ searchParams }: Props) {
  const query = schema.productTransaction.list.parse(searchParams);
  const { data, isLoading: loading } = api.productTransaction.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table loading={loading} data={data} searchParams={searchParams} />
      </section>
      <TableSorter />
    </section>
  );
}
