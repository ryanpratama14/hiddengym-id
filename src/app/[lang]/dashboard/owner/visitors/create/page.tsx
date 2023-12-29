import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import { type PackageTransactionCreateInput } from "@/server/api/routers/packageTransaction";
import { type PromoCodeCheck, type PromoCodeCheckInput } from "@/server/api/routers/promoCode";
import { type UserCreateVisitor, type UserCreateVisitorInput } from "@/server/api/routers/user";
import { api } from "@/trpc/server";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { revalidatePath } from "next/cache";
import CreateVisitorForm from "./components/CreateVisitorForm";

type Props = {
  params: { lang: Locale };
};

export default async function CustomerCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const createVisitor = async (data: UserCreateVisitorInput): Promise<UserCreateVisitor> => {
    "use server";
    const res = await api.user.createVisitor.mutate(data);
    revalidatePath("/");
    return res;
  };

  const createPackageTransaction = async (data: PackageTransactionCreateInput): Promise<TRPC_RESPONSE> => {
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
  };

  return (
    <section className="main-create-padding">
      <h3>Create Visitor</h3>
      <CreateVisitorForm
        option={option}
        t={t}
        createPackageTransaction={createPackageTransaction}
        createVisitor={createVisitor}
        lang={params.lang}
        checkPromoCode={checkPromoCode}
      />
    </section>
  );
}
