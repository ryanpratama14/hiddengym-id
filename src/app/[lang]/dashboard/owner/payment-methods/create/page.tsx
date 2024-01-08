import { useDictionary } from "@/lib/dictionary";
import { type Lang } from "@/types";
import CreatePaymentMethodForm from "./components/CreatePaymentMethodForm";

type Props = {
  params: { lang: Lang };
};

export default async function SportTypeCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Create Payment Method</h3>
      <CreatePaymentMethodForm t={t} />
    </section>
  );
}
