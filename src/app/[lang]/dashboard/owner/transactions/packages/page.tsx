import { api } from "@/trpc/server";
import type { Lang, SearchParams } from "@/types";
import TransactionsPackageContainer from "./components/Container";

type Props = { searchParams: SearchParams; params: { lang: Lang } };

export default async function TransactionsPackagePage({ searchParams, params }: Props) {
  const selectedData = searchParams.id ? await api.packageTransaction.detail.query({ id: searchParams.id }) : null;

  return <TransactionsPackageContainer searchParams={searchParams} lang={params.lang} selectedData={selectedData} />;
}
