"use client";

import { cn } from "@/lib/functions";
import { api } from "@/trpc/react";
import { Skeleton } from "antd";

export default function PaymentMethodsPage() {
  const { data, isLoading: loading } = api.paymentMethod.list.useQuery();

  return (
    <section className="flex flex-col gap-6">
      <h4>Payment Method</h4>
      <section className="grid md:grid-cols-3 gap-6">
        {loading
          ? Array(10)
              .fill(10)
              .map((_, index) => <Skeleton active key={index} />)
          : data?.map((e) => {
              return (
                <section key={e?.id} className="p-6 bg-light rounded-md border-1 border-dark/50">
                  <section className="flex justify-between flex-wrap items-start gap-6">
                    <h4>{e?.name}</h4>
                    <section className="flex flex-col gap-4 w-full">
                      <section className="flex flex-col gap-1">
                        <p className={cn("text-lg w-full")}>Today's Transactions</p>
                        <section className="flex gap-2 items-center">
                          <div className="bg-orange rounded-md font-medium relative size-6 text-cream">
                            <p className="absolute centered">{e.todayPackageTransactions.length}</p>
                          </div>
                          <p>packages</p>
                        </section>
                        <section className="flex gap-2 items-center">
                          <div className="bg-green rounded-md font-medium relative size-6 text-cream">
                            <p className="absolute centered">{e.todayProductTransactions.length}</p>
                          </div>
                          <p>products</p>
                        </section>
                      </section>
                    </section>
                  </section>
                </section>
              );
            })}
      </section>
    </section>
  );
}
