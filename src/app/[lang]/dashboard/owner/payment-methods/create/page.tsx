import { useDictionary } from "@/lib/dictionary";
import { type Locale } from "@/lib/internationalization";
import CreatePaymentMethodForm from "./components/CreatePaymentMethodForm";

type Props = {
  params: { lang: Locale };
};

export default async function SportTypeCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Create Payment Method</h3>
      <CreatePaymentMethodForm t={t} lang={params.lang} />
    </section>
  );
}
