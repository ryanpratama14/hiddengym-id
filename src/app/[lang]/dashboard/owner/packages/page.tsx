"use client";

import { REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { schema } from "@/schema";
import { type PackageDetail } from "@/server/api/routers/package";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";
import Table from "./components/Table";
import TableSorter from "./components/TableSorter";

type Props = {
  params: { lang: Lang };
  searchParams: SearchParams;
};

export default function PakcagesPage({ params, searchParams }: Props) {
  const query = schema.package.list.parse(searchParams);
  const { data, isLoading: loading } = api.package.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });

  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());
  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT.OWNER({ lang: params.lang, href: "/packages" }), newParams));
  };

  const [selectedPackage, setSelectedPackage] = useState<PackageDetail | null>(null);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  return (
    <Fragment>
      <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
        <section className="flex flex-col gap-6 md:col-span-4">
          <Table
            data={data}
            lang={params.lang}
            loading={loading}
            searchParams={searchParams}
            redirectTable={redirectTable}
            newParams={newParams}
            // setSelectedPackage={setSelectedPackage}
            // setShowModalUpdate={setShowModalUpdate}
          />
        </section>
        <TableSorter redirectTable={redirectTable} newParams={newParams} />
      </section>
    </Fragment>
  );
}
