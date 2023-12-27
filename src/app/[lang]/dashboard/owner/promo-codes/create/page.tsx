import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import { api } from "@/trpc/server";
import { type PromoCodeCreateInput } from "@router/promoCode";
import { revalidatePath } from "next/cache";
import CreatePromoCodeForm from "./components/CreatePromoCodeForm";

type Props = {
  params: { lang: Locale };
};

export default async function SportTypeCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const createData = async (data: PromoCodeCreateInput) => {
    "use server";
    const res = await api.promoCode.create.mutate(data);
    revalidatePath("/");
    return res;
  };

  return (
    <section className="main-create-padding">
      <h3>Create Sport Type</h3>
      <CreatePromoCodeForm t={t} createData={createData} lang={params.lang} />
    </section>
  );
}
