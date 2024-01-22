"use client";

import { Modal } from "@/components/Modal";
import ProductTransaction from "@/components/ProductTransaction";
import { REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { schema } from "@/schema";
import { api } from "@/trpc/react";
import type { ActionButtonAction, Lang, SearchParams } from "@/types";
import { useRouter } from "next/navigation";
import Table from "../components/Table";
import TableSorter from "../components/TableSorter";

type Props = { searchParams: SearchParams; lang: Lang };

export default function TransactionsProductsContainer({ searchParams, lang }: Props) {
  const query = schema.productTransaction.list.parse(searchParams);
  const newParams = new URLSearchParams(searchParams);
  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT({ lang, href: "/transactions/products", role: "OWNER" }), newParams));
  };

  const { data, isLoading: loading } = api.productTransaction.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });
  const { data: selectedData } = api.productTransaction.detail.useQuery({ id: searchParams.id ?? "" }, { enabled: !!searchParams.id });

  const closeModal = (action: ActionButtonAction) => () => {
    newParams.delete("id");
    newParams.delete(action);
    redirectTable(newParams);
  };

  if (data?.isPaginationInvalid) {
    newParams.delete("page");
    redirectTable(newParams);
  }

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <Modal show={!!searchParams.id && !!searchParams.detail} closeModal={closeModal("detail")}>
        <Modal.Body>
          <ProductTransaction data={selectedData} />
        </Modal.Body>
      </Modal>
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table loading={loading} data={data} searchParams={searchParams} redirectTable={redirectTable} newParams={newParams} />
      </section>
      <TableSorter redirectTable={redirectTable} newParams={newParams} />
    </section>
  );
}
