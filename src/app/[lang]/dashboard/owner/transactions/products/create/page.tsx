import { useDictionary } from "@/lib/dictionary";
import { api } from "@/trpc/server";
import { type Lang } from "@/types";
import CreateProductTransactionForm from "./components/CreateProductTransactionForm";

type Props = { params: { lang: Lang } };

export default async function ProductTransactionCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);
  const option = { paymentMethods: await api.paymentMethod.list.query(), products: await api.product.list.query({}) };

  return (
    <section className="main-create-padding">
      <h3>Create Product Transaction</h3>
      <CreateProductTransactionForm t={t} option={option} />
    </section>
  );
}
