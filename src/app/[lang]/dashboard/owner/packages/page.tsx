"use client";

import { schema } from "@/schema";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import { z } from "zod";
import Table from "./components/Table";

type Props = {
  params: { lang: Lang };
  searchParams: SearchParams;
};

export default function PakcagesPage({ params, searchParams }: Props) {
  const searchParamsSchema = z.object({
    name: z.string().optional(),
    type: schema.packageType.optional(),
    price: z.coerce.number().optional(),
    totalTransaction: z.coerce.number().optional(),
  });

  const { data, isLoading: loading } = api.package.list.useQuery(searchParamsSchema.parse(searchParams));

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table data={data} lang={params.lang} loading={loading} searchParams={searchParams} />
      </section>
    </section>
  );
}
