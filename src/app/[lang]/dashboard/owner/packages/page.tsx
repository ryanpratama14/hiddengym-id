import { useDictionary } from "@/lib/dictionary";
import type { Lang, SearchParams } from "@/types";
import PackagesContainer from "./components/Container";

type Props = { searchParams: SearchParams; params: { lang: Lang } };

export default async function PakcagesPage({ searchParams, params }: Props) {
  const t = await useDictionary(params.lang);

  return <PackagesContainer t={t} lang={params.lang} searchParams={searchParams} />;
}
