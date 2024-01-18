"use client";

import Iconify from "@/components/Iconify";
import { ICONS, REFETCH_INTERVAL } from "@/lib/constants";
import { formatCurrency } from "@/lib/functions";
import { schema } from "@/schema";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import { Skeleton } from "antd";

type Props = { params: { lang: Lang }; searchParams: SearchParams };

export default function ProductsPage({ params, searchParams }: Props) {
  const query = schema.product.list.parse(searchParams);
  const { data, isLoading: loading } = api.product.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });

  return (
    <section className="flex flex-col gap-6">
      <section className="grid grid-cols-4 gap-4">
        {loading
          ? Array(10)
              .fill(10)
              .map((_, index) => <Skeleton key={index} />)
          : data?.map((product) => {
              return (
                <section key={product.id} className="flex flex-col gap-4 p-3 bg-light shadow-lg border-1 border-dark rounded-md">
                  <header className="flex justify-between">
                    <section className="flex gap-2 items-center">
                      <p className="text-lg">{product.name}</p>
                      <p className="px-2 bg-orange text-cream w-fit">{formatCurrency(product.price)}</p>
                    </section>
                    <Iconify className="text-dark" icon={ICONS.edit} width={22.5} />
                  </header>
                  <section className="flex flex-col">
                    <p className="text-blue2 font-medium">Recent transactions</p>
                    {product.transactions.map((txn) => (
                      <section key={txn.id} className="flex justify-between">
                        <small>{txn.productTransaction.buyer.fullName}</small>
                        <small>
                          {txn.quantity}x {formatCurrency(txn.quantity * txn.unitPrice)}
                        </small>
                      </section>
                    ))}
                  </section>
                </section>
              );
            })}
      </section>
    </section>
  );
}
