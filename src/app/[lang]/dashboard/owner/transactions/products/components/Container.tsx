"use client";

import { Modal } from "@/components/Modal";
import ModalConfirm from "@/components/ModalConfirm";
import ProductTransaction from "@/components/ProductTransaction";
import { toastError, toastSuccess } from "@/components/Toast";
import { PRODUCT_TRANSACTION_SORTERERS, REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { closeModal, createUrl } from "@/lib/functions";
import { api } from "@/trpc/react";
import type { Dictionary, Lang, SearchParams } from "@/types";
import TableSorter from "@dashboard/components/TableSorter";
import { schema } from "@schema";
import { useRouter } from "next/navigation";
import Table from "../components/Table";
import ModalUpdate from "./ModalUpdate";

type Props = { searchParams: SearchParams; lang: Lang; t: Dictionary };

export default function TransactionsProductsContainer({ searchParams, lang, t }: Props) {
  const utils = api.useUtils();
  const query = schema.productTransaction.list.parse(searchParams);
  const newParams = new URLSearchParams(searchParams);
  const router = useRouter();

  const redirect = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT({ lang, href: "/transactions/products", role: "OWNER" }), newParams));
  };

  const { data, isLoading: loading } = api.productTransaction.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });
  const { data: selectedData } = api.productTransaction.detail.useQuery({ id: searchParams.id ?? "" }, { enabled: !!searchParams.id });

  const { mutate: deleteData, isPending: loadingDelete } = api.productTransaction.delete.useMutation({
    onSuccess: async (res) => {
      toastSuccess({ t, description: res.message });
      closeModal({ action: "delete", newParams, redirect })();
      await utils.productTransaction.list.invalidate();
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  if (data?.isPaginationInvalid) {
    newParams.delete("page");
    redirect(newParams);
  }

  return (
    <section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
      <ModalConfirm
        loading={loadingDelete}
        action="delete"
        show={!!searchParams.id && !!searchParams.delete}
        onConfirm={() => searchParams.id && deleteData({ id: searchParams.id })}
        closeModal={closeModal({ action: "delete", newParams, redirect })}
      />
      <ModalUpdate
        t={t}
        data={selectedData}
        show={!!searchParams.id && !!searchParams.update}
        closeModal={closeModal({ action: "update", newParams, redirect })}
      />
      <Modal show={!!searchParams.id && !!searchParams.detail} closeModal={closeModal({ action: "detail", newParams, redirect })}>
        <Modal.Body>
          <ProductTransaction data={selectedData} />
        </Modal.Body>
      </Modal>
      <section className="flex flex-col gap-6 md:col-span-4">
        <Table loading={loading} data={data} searchParams={searchParams} redirect={redirect} newParams={newParams} />
      </section>
      <TableSorter redirectTable={redirect} newParams={newParams} sortererData={PRODUCT_TRANSACTION_SORTERERS} />
    </section>
  );
}
