import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import CreateProductForm from "./components/CreateProductForm";

type Props = {
  params: { lang: Locale };
};

export default async function SportTypeCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Create Product</h3>
      <CreateProductForm t={t} lang={params.lang} />
    </section>
  );
}