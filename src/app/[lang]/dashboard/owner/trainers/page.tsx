"use client";

import { REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { schema } from "@/server/schema";
import { api } from "@/trpc/react";
import type { Lang, SearchParams } from "@/types";
import TableSearch from "@dashboard/components/TableSearch";
import { useRouter } from "next/navigation";
import Table from "./components/Table";

type Props = {
  searchParams: SearchParams;
  params: { lang: Lang };
};

export default function TrainersPage({ searchParams, params }: Props) {
  const query = schema.user.list.parse(searchParams);
  const newParams = new URLSearchParams(searchParams);
  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT({ lang: params.lang, href: "/trainers", role: "OWNER" }), newParams));
  };

  const { data, isLoading: loading } = api.user.list.useQuery(
    { ...query, role: "TRAINER", pagination: false },
    { refetchInterval: REFETCH_INTERVAL },
  );

  const { data: packages } = api.package.list.useQuery({}, { staleTime: Infinity });

  if (data?.isPaginationInvalid) {
    newParams.delete("page");
    redirectTable(newParams);
  }

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <section className="flex flex-col gap-4 md:col-span-4">
        <TableSearch loading={loading} searchParams={searchParams} redirectTable={redirectTable} newParams={newParams} />
        <Table
          packages={packages}
          data={data}
          loading={loading}
          redirectTable={redirectTable}
          searchParams={searchParams}
          newParams={newParams}
          lang={params.lang}
        />
      </section>
    </section>
  );
}
