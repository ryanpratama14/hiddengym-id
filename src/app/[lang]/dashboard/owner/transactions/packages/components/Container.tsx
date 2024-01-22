"use client";

import { Modal } from "@/components/Modal";
import ModalConfirm from "@/components/ModalConfirm";
import PackageTransaction from "@/components/PackageTransaction";
import { REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { schema } from "@/schema";
import { type PackageList } from "@/server/api/routers/package";
import { type PaymentMethodList } from "@/server/api/routers/paymentMethod";
import { api } from "@/trpc/react";
import type { Dictionary, Lang, SearchParams } from "@/types";
import { useRouter } from "next/navigation";
import Table from "../components/Table";
import TableSorter from "../components/TableSorter";
import ModalUpdate from "./ModalUpdate";

type Props = {
  searchParams: SearchParams;
  lang: Lang;
  option: { packages: PackageList; paymentMethods: PaymentMethodList };
  t: Dictionary;
};

export default function TransactionsProductContainer({ searchParams, lang, option, t }: Props) {
  const query = schema.packageTransaction.list.parse(searchParams);
  const newParams = new URLSearchParams(searchParams);
  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT({ lang, href: "/transactions/packages", role: "OWNER" }), newParams));
  };

  const { data, isLoading: loading } = api.packageTransaction.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });
  const selectedId = searchParams.id ?? searchParams.packageId ?? "";
  const { data: selectedData } = api.packageTransaction.detail.useQuery({ id: selectedId }, { enabled: !!selectedId });

  if (data?.isPaginationInvalid) {
    newParams.delete("page");
    redirectTable(newParams);
  }

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <ModalUpdate
        t={t}
        show={!!searchParams.id && !!searchParams.update}
        option={option}
        closeModal={() => {
          newParams.delete("id");
          newParams.delete("update");
          redirectTable(newParams);
        }}
        data={selectedData}
      />
      <ModalConfirm
        loading={true}
        action="delete"
        show={!!searchParams.id && !!searchParams.delete}
        onConfirm={async () => {
          console.log("hitted");
        }}
        closeModal={() => {
          newParams.delete("id");
          newParams.delete("delete");
          redirectTable(newParams);
        }}
      />
      <Modal
        show={!!searchParams.id && !!searchParams.detail}
        closeModal={() => {
          newParams.delete("id");
          newParams.delete("detail");
          redirectTable(newParams);
        }}
      >
        <Modal.Body>
          <PackageTransaction data={selectedData} />
        </Modal.Body>
      </Modal>
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table loading={loading} data={data} searchParams={searchParams} redirectTable={redirectTable} newParams={newParams} />
      </section>
      <TableSorter redirectTable={redirectTable} newParams={newParams} />
    </section>
  );
}
