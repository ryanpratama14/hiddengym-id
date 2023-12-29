import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import { type PaymentMethodCreateInput } from "@/server/api/routers/paymentMethod";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import CreatePaymentMethodForm from "./components/CreatePaymentMethodForm";

type Props = {
  params: { lang: Locale };
};

export default async function SportTypeCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const createData = async (data: PaymentMethodCreateInput) => {
    "use server";
    const res = await api.paymentMethod.create.mutate(data);
    revalidatePath("/");
    return res;
  };

  return (
    <section className="main-create-padding">
      <h3>Create Payment Method</h3>
      <CreatePaymentMethodForm t={t} createData={createData} lang={params.lang} />
    </section>
  );
}
