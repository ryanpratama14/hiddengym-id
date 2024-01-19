"use client";

import { REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { schema } from "@/schema";
import { api } from "@/trpc/react";
import { type Dictionary, type Lang, type SearchParams } from "@/types";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import Table from "../components/Table";
import TableSorter from "../components/TableSorter";
import ModalUpdate from "./ModalUpdate";

type Props = {
  lang: Lang;
  searchParams: SearchParams;
  t: Dictionary;
};

export default function PackagesContainer({ lang, searchParams, t }: Props) {
  const query = schema.package.list.parse(searchParams);
  const { data, isLoading: loading } = api.package.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });

  const newParams = new URLSearchParams(searchParams);
  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT({ lang, href: "/packages", role: "OWNER" }), newParams));
  };

  return (
    <Fragment>
      <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
        <section className="flex flex-col gap-6 md:col-span-4">
          <ModalUpdate
            t={t}
            show={!!searchParams.id && !!data?.find((e) => e.id === searchParams.id)}
            closeModal={() => {
              newParams.delete("id");
              redirectTable(newParams);
            }}
            data={searchParams.id && data ? data.find((e) => e.id === searchParams.id)! : null}
          />
          <Table
            data={data}
            lang={lang}
            loading={loading}
            searchParams={searchParams}
            redirectTable={redirectTable}
            newParams={newParams}
          />
        </section>
        <TableSorter redirectTable={redirectTable} newParams={newParams} />
      </section>
    </Fragment>
  );
}
