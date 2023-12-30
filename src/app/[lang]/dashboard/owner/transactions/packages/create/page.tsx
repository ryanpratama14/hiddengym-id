import { useDictionary } from "@/lib/dictionary";
import { type Locale } from "@/lib/internationalization";
import { api } from "@/trpc/server";
import CreatePackageTransactionForm from "./components/CreatePackageTransactionForm";

type Props = {
  params: { lang: Locale };
};

export default async function PackageTransactionCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const option = {
    packages: await api.package.list.query(),
    paymentMethods: await api.paymentMethod.list.query(),
    visitors: await api.user.listVisitor.query(),
  };

  return (
    <section className="main-create-padding">
      <h3>Create Package Transaction</h3>
      <CreatePackageTransactionForm option={option} t={t} lang={params.lang} />
    </section>
  );
}
