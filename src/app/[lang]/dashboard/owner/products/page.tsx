import { useDictionary } from "@/lib/dictionary";
import type { Lang, SearchParams } from "@/types";
import ProductsContainer from "./components/Container";

type Props = { searchParams: SearchParams; params: { lang: Lang } };

export default async function ProductsPage({ searchParams, params }: Props) {
  const t = await useDictionary(params.lang);
  return <ProductsContainer t={t} searchParams={searchParams} lang={params.lang} />;
}
