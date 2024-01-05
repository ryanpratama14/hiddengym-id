"use client";

import { REFETCH_INTERVAL } from "@/lib/constants";
import { schema } from "@/schema";
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
    sort: z.string().optional(),
  });

  const query = searchParamsSchema.parse(searchParams);

  const { data, isLoading: loading } = api.packageTransaction.list.useQuery(
    {
      pagination: {
        page: query.page,
        limit: query.limit,
      },
      params: {
        transactionDate: query.transactionDate,
        packageType: query.packageType,
        package: query.package,
        buyer: query.buyer,
        totalPrice: query.totalPrice,
        paymentMethod: query.paymentMethod,
        promoCodeCode: query.promoCodeCode,
      },
      sorting: query.sort,
    },
    { refetchInterval: REFETCH_INTERVAL },
  );

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table loading={loading} lang={params.lang} data={data} searchParams={searchParams} />
      </section>
      <TableSorter lang={params.lang} />
    </section>
  );
}
