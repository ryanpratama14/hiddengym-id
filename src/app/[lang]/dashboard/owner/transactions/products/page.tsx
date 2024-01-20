import { api } from "@/trpc/server";
import type { Lang, SearchParams } from "@/types";
import TransactionsProductContainer from "./components/Container";

type Props = { searchParams: SearchParams; params: { lang: Lang } };

export default async function TransactionsProductsPage({ searchParams, params }: Props) {
  const selectedData = searchParams.id ? await api.productTransaction.detail.query({ id: searchParams.id }) : null;

  return <TransactionsProductContainer searchParams={searchParams} lang={params.lang} selectedData={selectedData} />;
}
