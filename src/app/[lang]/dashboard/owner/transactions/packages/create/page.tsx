import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import { type PackageTransactionCreateInput } from "@/server/api/routers/packageTransaction";
import { type PromoCodeCheck, type PromoCodeCheckInput } from "@/server/api/routers/promoCode";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import CreatePackageTransactionForm from "./components/CreatePackageTransactionForm";

type Props = {
  params: { lang: Locale };
};

export default async function PackageTransactionCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const createData = async (data: PackageTransactionCreateInput) => {
    "use server";
    const res = await api.packageTransaction.create.mutate(data);
    revalidatePath("/");
    return res;
  };

  const checkPromoCode = async (data: PromoCodeCheckInput): Promise<PromoCodeCheck> => {
    "use server";
    const res = await api.promoCode.checkPromoCode.mutate(data);
    return res;
  };

  const option = {
    packages: await api.package.list.query(),
    paymentMethods: await api.paymentMethod.list.query(),
    visitors: await api.user.listVisitor.query(),
  };

  return (
    <section className="main-create-padding">
      <h3>Create Package Transaction</h3>
      <CreatePackageTransactionForm option={option} t={t} checkPromoCode={checkPromoCode} createData={createData} lang={params.lang} />
    </section>
  );
}
