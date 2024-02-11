"use client";

import { REFETCH_INTERVAL, USER_LIST_SORTERERS, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { api } from "@/trpc/react";
import type { Lang, SearchParams } from "@/types";
import TableSearch from "@dashboard/components/TableSearch";
import TableSorter from "@dashboard/components/TableSorter";
import Table from "@owner/visitors/components/Table";
import { schema } from "@schema";
import { useRouter } from "next/navigation";

type Props = {
  searchParams: SearchParams;
  params: { lang: Lang };
};

export default function VisitorsPage({ searchParams, params }: Props) {
  const query = schema.user.list.parse(searchParams);
  const newParams = new URLSearchParams(searchParams);
  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT({ lang: params.lang, href: "/visitors", role: "OWNER" }), newParams));
  };
  const { data, isLoading: loading } = api.user.list.useQuery({ ...query, role: "VISITOR" }, { refetchInterval: REFETCH_INTERVAL });

  if (data?.isPaginationInvalid) {
    newParams.delete("page");
    redirectTable(newParams);
  }

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <section className="flex flex-col gap-4 md:col-span-4">
        <TableSearch loading={loading} searchParams={searchParams} redirectTable={redirectTable} newParams={newParams} />
        <Table
          lang={params.lang}
          loading={loading}
          data={data}
          searchParams={searchParams}
          redirectTable={redirectTable}
          newParams={newParams}
        />
      </section>
      <TableSorter redirectTable={redirectTable} newParams={newParams} sortererData={USER_LIST_SORTERERS} />
    </section>
  );
}
