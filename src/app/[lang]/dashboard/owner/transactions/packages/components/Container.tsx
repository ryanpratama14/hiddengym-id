"use client";

import { Modal } from "@/components/Modal";
import ModalConfirm from "@/components/ModalConfirm";
import PackageTransaction from "@/components/PackageTransaction";
import { toastError, toastSuccess } from "@/components/Toast";
import { REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { closeModal, createUrl } from "@/lib/functions";
import { api } from "@/trpc/react";
import type { Dictionary, Lang, SearchParams } from "@/types";
import { schema } from "@schema";
import { useRouter } from "next/navigation";
import Table from "../components/Table";
import TableSorter from "../components/TableSorter";
import ModalUpdate from "./ModalUpdate";

type Props = {
	searchParams: SearchParams;
	lang: Lang;

	t: Dictionary;
};

export default function TransactionsProductContainer({ searchParams, lang, t }: Props) {
	const query = schema.packageTransaction.list.parse(searchParams);
	const newParams = new URLSearchParams(searchParams);
	const router = useRouter();

	const redirect = (newParams: URLSearchParams) => {
		router.push(createUrl(USER_REDIRECT({ lang, href: "/transactions/packages", role: "OWNER" }), newParams));
	};

	const utils = api.useUtils();
	const { data, isLoading: loading } = api.packageTransaction.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });
	const selectedId = searchParams.id ?? searchParams.packageId ?? "";
	const { data: selectedData } = api.packageTransaction.detail.useQuery({ id: selectedId }, { enabled: !!selectedId });

	const { mutate: deleteData, isPending: loadingDelete } = api.packageTransaction.delete.useMutation({
		onSuccess: async (res) => {
			toastSuccess({ t, description: res.message });
			closeModal({ action: "delete", newParams, redirect })();
			await utils.packageTransaction.list.invalidate();
		},
		onError: (res) => toastError({ t, description: res.message }),
	});

	if (data?.isPaginationInvalid) {
		newParams.delete("page");
		redirect(newParams);
	}

	return (
		<section className="grid md:grid-cols-5 gap-6 lg:gap-x-12">
			<ModalUpdate
				t={t}
				show={!!searchParams.id && !!searchParams.update}
				closeModal={closeModal({ action: "update", newParams, redirect })}
				data={selectedData}
			/>
			<ModalConfirm
				loading={loadingDelete}
				action="delete"
				show={!!searchParams.id && !!searchParams.delete}
				onConfirm={() => searchParams.id && deleteData({ id: searchParams.id })}
				closeModal={closeModal({ action: "delete", newParams, redirect })}
			/>
			<Modal show={!!searchParams.id && !!searchParams.detail} closeModal={closeModal({ action: "detail", newParams, redirect })}>
				<Modal.Body>
					<PackageTransaction data={selectedData} />
				</Modal.Body>
			</Modal>
			<section className="flex flex-col gap-6 md:col-span-4">
				<Table loading={loading} data={data} searchParams={searchParams} redirect={redirect} newParams={newParams} />
			</section>
			<TableSorter redirect={redirect} newParams={newParams} />
		</section>
	);
}
