import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import CreateSportForm from "./components/CreateSportForm";

type Props = {
  params: { lang: Locale };
};

export default async function SportTypeCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Create Sport Type</h3>
      <CreateSportForm t={t} lang={params.lang} />
    </section>
  );
}
