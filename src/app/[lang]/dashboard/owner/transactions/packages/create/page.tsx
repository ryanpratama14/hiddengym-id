import { useDictionary } from "@/lib/dictionary";
import { api } from "@/trpc/server";
import { type Lang } from "@/types";
import CreatePackageTransactionForm from "./components/CreatePackageTransactionForm";

type Props = {
  params: { lang: Lang };
};

export default async function PackageTransactionCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const option = {
    packages: await api.package.list.query({}),
    paymentMethods: await api.paymentMethod.list.query(),
    visitors: (await api.user.list.query({ role: "VISITOR", pagination: false })).data,
  };

  return (
    <section className="main-create-padding">
      <h3>Create Package Transaction</h3>
      <CreatePackageTransactionForm option={option} t={t} />
    </section>
  );
}
