"use client";

import { schema } from "@/schema";
import { type PackageTransactionListInput } from "@/server/api/routers/packageTransaction";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import { z } from "zod";
import Table from "./components/Table";
import TableSorter from "./components/TableSorter";

type Props = {
  searchParams: SearchParams;
  params: { lang: Lang };
};

export default function TransactionsProductPage({ searchParams, params }: Props) {
  const searchParamsSchema = z.object({
    ...schema.searchParams.pagination.shape,
    totalPrice: z.coerce.number().optional(),
    transactionDate: z.string().optional(),
    packageType: schema.packageType.optional(),
    package: z.string().optional(),
    buyer: z.string().optional(),
    paymentMethod: z.string().optional(),
    promoCodeCode: z.string().optional(),
    sorting: z.string().optional(),
  });

  const filter = searchParamsSchema.parse(searchParams);

  const query: PackageTransactionListInput = {
    pagination: {
      page: filter.page,
      limit: filter.limit,
    },
    params: {
      transactionDate: filter.transactionDate,
      packageType: filter.packageType,
      package: filter.package,
      buyer: filter.buyer,
      totalPrice: filter.totalPrice,
      paymentMethod: filter.paymentMethod,
      promoCodeCode: filter.promoCodeCode,
    },
    sorting: filter.sorting,
  };

  const { data, isLoading: loading } = api.packageTransaction.list.useQuery(query);

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table loading={loading} lang={params.lang} data={data} searchParams={searchParams} />
      </section>
      <TableSorter lang={params.lang} />
    </section>
  );
}
