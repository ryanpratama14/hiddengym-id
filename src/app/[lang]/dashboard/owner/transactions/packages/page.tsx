import { useDictionary } from "@/lib/dictionary";
import { api } from "@/trpc/server";
import type { Lang, SearchParams } from "@/types";
import TransactionsPackageContainer from "./components/Container";

type Props = { searchParams: SearchParams; params: { lang: Lang } };

export default async function TransactionsPackagePage({ searchParams, params }: Props) {
  const option = { packages: await api.package.list.query({}), paymentMethods: await api.paymentMethod.list.query() };
  const t = await useDictionary(params.lang);
  return <TransactionsPackageContainer searchParams={searchParams} lang={params.lang} option={option} t={t} />;
}
