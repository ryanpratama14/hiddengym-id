"use client";

import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import { type PackageType } from "@prisma/client";
import Table from "./components/Table";

type Props = {
  params: { lang: Lang };
  searchParams: SearchParams;
};

export default function PakcagesPage({ params, searchParams }: Props) {
  const { data, isLoading: loading } = api.package.list.useQuery({
    name: searchParams?.name as string,
    type: searchParams?.type as PackageType,
    price: searchParams?.price ? Number(searchParams.price) : undefined,
    totalTransactions: searchParams?.totalTransactions ? Number(searchParams.totalTransactions) : undefined,
  });

  return (
    <section className="grid md:grid-cols-5 gap-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table data={data} lang={params.lang} loading={loading} searchParams={searchParams} />
      </section>
    </section>
  );
}
