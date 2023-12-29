"use client";

import { type Locale } from "@/i18n.config";
import { type PackageTransactionListInput } from "@/server/api/routers/packageTransaction";
import { api } from "@/trpc/react";
import { PAGINATION_LIMIT } from "@/trpc/shared";
import { type SearchParams } from "@/types";
import { type PackageType } from "@prisma/client";
import Table from "./components/Table";
import TableSorter from "./components/TableSorter";

type Props = {
  searchParams: SearchParams;
  params: { lang: Locale };
};

export default function TransactionsProductPage({ searchParams, params }: Props) {
  const query: PackageTransactionListInput = {
    pagination: {
      page: Number(searchParams.page) || 1,
      limit: Number(searchParams.limit) || PAGINATION_LIMIT,
    },
    params: {
      transactionDate: searchParams.transactionDate as string,
      packageType: searchParams.packageType as PackageType,
      package: searchParams.package as string,
      buyer: searchParams.buyer as string,
      totalPrice: searchParams.totalPrice ? Number(searchParams.totalPrice) : undefined,
      paymentMethod: searchParams.paymentMethod as string,
    },
    sorting: searchParams.sort as string,
  };

  const { data, isLoading: loading } = api.packageTransaction.list.useQuery(query);

  return (
    <section className="grid grid-cols-1 md:grid-cols-5 gap-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table loading={loading} lang={params.lang} data={data} searchParams={searchParams} />
      </section>
      <TableSorter lang={params.lang} />
    </section>
  );
}
