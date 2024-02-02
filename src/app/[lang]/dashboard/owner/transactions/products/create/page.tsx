import { useDictionary } from "@/lib/dictionary";
import type { Lang } from "@/types";
import CreateProductTransactionForm from "./components/CreateProductTransactionForm";

type Props = { params: { lang: Lang } };

export default async function ProductTransactionCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Create Product Transaction</h3>
      <CreateProductTransactionForm t={t} />
    </section>
  );
}
