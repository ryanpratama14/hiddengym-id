import { useDictionary } from "@/lib/dictionary";
import { type Lang } from "@/types";
import CreatePromoCodeForm from "./components/CreatePromoCodeForm";

type Props = {
  params: { lang: Lang };
};

export default async function SportTypeCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Create Promo Code</h3>
      <CreatePromoCodeForm t={t} />
    </section>
  );
}
