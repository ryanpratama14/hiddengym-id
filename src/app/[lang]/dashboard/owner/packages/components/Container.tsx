"use client";

import { REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { type PackageDetail, type PackageListInput } from "@/server/api/routers/package";
import { type PlaceList } from "@/server/api/routers/place";
import { type SportList } from "@/server/api/routers/sport";
import { type UserListData } from "@/server/api/routers/user";
import { api } from "@/trpc/react";
import { type Dictionary, type Lang, type SearchParams } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";
import ModalUpdate from "../components/ModalUpdate";
import Table from "../components/Table";
import TableSorter from "../components/TableSorter";

type Props = {
  option: { places: PlaceList; sports: SportList; trainers: UserListData };
  lang: Lang;
  searchParams: SearchParams;
  query: PackageListInput;
  t: Dictionary;
};

export default function PackagesContainer({ option, lang, searchParams, query, t }: Props) {
  const { data, isLoading: loading } = api.package.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });

  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());
  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT.OWNER({ lang, href: "/packages" }), newParams));
  };

  const [selectedPackage, setSelectedPackage] = useState<PackageDetail | null>(null);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  return (
    <Fragment>
      <ModalUpdate t={t} show={showModalUpdate} closeModal={() => setShowModalUpdate(false)} data={selectedPackage} option={option} />
      <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
        <section className="flex flex-col gap-6 md:col-span-4">
          <Table
            data={data}
            lang={lang}
            loading={loading}
            searchParams={searchParams}
            redirectTable={redirectTable}
            newParams={newParams}
            setSelectedPackage={setSelectedPackage}
            setShowModalUpdate={setShowModalUpdate}
          />
        </section>
        <TableSorter redirectTable={redirectTable} newParams={newParams} />
      </section>
    </Fragment>
  );
}
