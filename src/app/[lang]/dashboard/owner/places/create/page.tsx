import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import CreatePlaceForm from "./components/CreatePlaceForm";

type Props = {
  params: { lang: Locale };
};

export default async function PlaceCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Create Place</h3>
      <CreatePlaceForm t={t} lang={params.lang} />
    </section>
  );
}
