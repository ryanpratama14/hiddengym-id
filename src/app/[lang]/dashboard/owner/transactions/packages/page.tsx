import { useDictionary } from "@/lib/dictionary";
import type { Lang, SearchParams } from "@/types";
import TransactionsPackageContainer from "./components/Container";

type Props = { searchParams: SearchParams; params: { lang: Lang } };

export default async function TransactionsPackagePage({ searchParams, params }: Props) {
  const t = await useDictionary(params.lang);
  return <TransactionsPackageContainer searchParams={searchParams} lang={params.lang} t={t} />;
}
