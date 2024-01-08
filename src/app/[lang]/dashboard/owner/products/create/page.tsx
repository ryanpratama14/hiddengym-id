import { useDictionary } from "@/lib/dictionary";
import { type Lang } from "@/types";
import CreateProductForm from "./components/CreateProductForm";

type Props = {
  params: { lang: Lang };
};

export default async function SportTypeCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Create Product</h3>
      <CreateProductForm t={t} />
    </section>
  );
}
