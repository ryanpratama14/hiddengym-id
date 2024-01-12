"use client";

import Iconify from "@/components/Iconify";
import { ICONS, REFETCH_INTERVAL } from "@/lib/constants";
import { formatCurrency } from "@/lib/functions";
import { schema } from "@/schema";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";

type Props = { params: { lang: Lang }; searchParams: SearchParams };

export default function ProductsPage({ params, searchParams }: Props) {
  const query = schema.product.list.parse(searchParams);
  const { data, isLoading: loading } = api.product.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });

  return (
    <section className="flex flex-col gap-6">
      <section className="grid grid-cols-4 gap-4">
        {data?.map((product) => {
          return (
            <section key={product.id} className="flex flex-col gap-4 p-3 bg-light shadow-lg border-1 border-dark rounded-md">
              <header className="flex justify-between">
                <p className="text-lg">{product.name}</p>
                <section className="flex gap-2 items-center">
                  <p className="px-2 bg-orange text-cream w-fit">{formatCurrency(product.price)}</p>
                  <Iconify className="text-dark" icon={ICONS.edit} width={22.5} />
                </section>
              </header>
              <section className="flex flex-col">
                <p>Recent transactions</p>
                {product.productOnTransaction.map((txn) => (
                  <section className="flex justify-between">{txn.productTransaction.totalPrice}</section>
                ))}
              </section>
            </section>
          );
        })}
      </section>
    </section>
  );
}
