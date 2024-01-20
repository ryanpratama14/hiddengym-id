"use client";

import { REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { schema } from "@/schema";
import { type PackageTransactionDetail } from "@/server/api/routers/packageTransaction";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import { useRouter } from "next/navigation";
import Table from "../components/Table";
import TableSorter from "../components/TableSorter";

type Props = { searchParams: SearchParams; lang: Lang; selectedData: PackageTransactionDetail | null };

export default function TransactionsProductContainer({ searchParams, lang, selectedData }: Props) {
  const query = schema.packageTransaction.list.parse(searchParams);
  const newParams = new URLSearchParams(searchParams);
  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT({ lang, href: "/transactions/packages", role: "OWNER" }), newParams));
  };

  const { data, isLoading: loading } = api.packageTransaction.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });

  if (data?.isPaginationInvalid) {
    newParams.delete("page");
    redirectTable(newParams);
  }

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table
          selectedData={selectedData}
          loading={loading}
          data={data}
          searchParams={searchParams}
          redirectTable={redirectTable}
          newParams={newParams}
        />
      </section>
      <TableSorter redirectTable={redirectTable} newParams={newParams} />
    </section>
  );
}
