"use client";

import { PACKAGE_SORTERERS, REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { closeModal, createUrl } from "@/lib/functions";
import { api } from "@/trpc/react";
import type { Dictionary, Lang, SearchParams } from "@/types";
import TableSorter from "@dashboard/components/TableSorter";
import { schema } from "@schema";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import Table from "../components/Table";
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

  const redirect = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT({ lang, href: "/packages", role: "OWNER" }), newParams));
  };

  return (
    <Fragment>
      <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
        <section className="flex flex-col gap-6 md:col-span-4">
          <ModalUpdate
            t={t}
            show={!!searchParams.id && !!searchParams.update && !!data?.find((e) => e.id === searchParams.id)}
            closeModal={closeModal({ action: "update", newParams, redirect })}
            data={searchParams.id && data ? data.find((e) => e.id === searchParams.id) : null}
          />
          <Table data={data} lang={lang} loading={loading} searchParams={searchParams} redirect={redirect} newParams={newParams} />
        </section>
        <TableSorter redirectTable={redirect} newParams={newParams} sortererData={PACKAGE_SORTERERS} />
      </section>
    </Fragment>
  );
}
