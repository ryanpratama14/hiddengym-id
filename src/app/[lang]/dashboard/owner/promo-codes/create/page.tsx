import { useDictionary } from "@/lib/dictionary";
import { type Locale } from "@/lib/internationalization";
import CreatePromoCodeForm from "./components/CreatePromoCodeForm";

type Props = {
  params: { lang: Locale };
};

export default async function SportTypeCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Create Promo Code</h3>
      <CreatePromoCodeForm t={t} lang={params.lang} />
    </section>
  );
}
