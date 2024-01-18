import { useDictionary } from "@/lib/dictionary";
import { schema } from "@/schema";
import { api } from "@/trpc/server";
import { type Lang, type SearchParams } from "@/types";
import PackagesContainer from "./components/Container";

type Props = { searchParams: SearchParams; params: { lang: Lang } };

export default async function PakcagesPage({ searchParams, params }: Props) {
  const query = schema.package.list.parse(searchParams);
  const option = {
    places: await api.place.list.query(),
    sports: await api.sport.list.query(),
    trainers: (await api.user.list.query({ role: "TRAINER", pagination: false, sort: "fullName-asc" })).data,
  };
  const t = await useDictionary(params.lang);

  return <PackagesContainer t={t} option={option} query={query} lang={params.lang} searchParams={searchParams} />;
}
