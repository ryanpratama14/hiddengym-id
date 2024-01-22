import { useDictionary } from "@/lib/dictionary";
import type { Lang, SearchParams } from "@/types";
import TransactionsProductContainer from "./components/Container";

type Props = { searchParams: SearchParams; params: { lang: Lang } };

export default async function TransactionsProductsPage({ searchParams, params }: Props) {
  const t = await useDictionary(params.lang);
  return <TransactionsProductContainer searchParams={searchParams} lang={params.lang} t={t} />;
}
