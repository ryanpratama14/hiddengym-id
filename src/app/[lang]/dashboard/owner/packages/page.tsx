"use client";

import { REFETCH_INTERVAL } from "@/lib/constants";
import { schema } from "@/schema";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import Table from "./components/Table";

type Props = {
  params: { lang: Lang };
  searchParams: SearchParams;
};

export default function PakcagesPage({ params, searchParams }: Props) {
  const query = schema.package.list.parse(searchParams);

  const { data, isLoading: loading } = api.package.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table data={data} lang={params.lang} loading={loading} searchParams={searchParams} />
      </section>
    </section>
  );
}
