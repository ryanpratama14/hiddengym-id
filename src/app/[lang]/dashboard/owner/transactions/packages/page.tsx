"use client";

import { REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { schema } from "@/schema";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import { useRouter } from "next/navigation";
import Table from "./components/Table";
import TableSorter from "./components/TableSorter";

type Props = {
  searchParams: SearchParams;
  params: { lang: Lang };
};

export default function TransactionsProductPage({ searchParams, params }: Props) {
  const query = schema.packageTransaction.list.parse(searchParams);
  const newParams = new URLSearchParams();
  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT.OWNER({ lang: params.lang, href: "/transactions/packages" }), newParams));
  };

  const { data, isLoading: loading } = api.packageTransaction.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table loading={loading} data={data} searchParams={searchParams} redirectTable={redirectTable} newParams={newParams} />
      </section>
      <TableSorter redirectTable={redirectTable} newParams={newParams} />
    </section>
  );
}
