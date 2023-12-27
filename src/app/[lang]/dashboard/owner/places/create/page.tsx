import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import { type PlaceCreateInput } from "@/server/api/routers/place";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import CreatePlaceForm from "./components/CreatePlaceForm";

type Props = {
  params: { lang: Locale };
};

export default async function PlaceCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const createPlace = async (data: PlaceCreateInput) => {
    "use server";
    const res = await api.place.create.mutate(data);
    revalidatePath("/");
    return res;
  };

  return (
    <section className="main-create-padding">
      <h3>Create Place</h3>
      <CreatePlaceForm t={t} createPlace={createPlace} lang={params.lang} />
    </section>
  );
}
