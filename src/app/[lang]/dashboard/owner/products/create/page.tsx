import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import { api } from "@/trpc/server";
import { type ProductCreateInput } from "@router/product";
import { revalidatePath } from "next/cache";
import CreateProductForm from "./components/CreateProductForm";

type Props = {
  params: { lang: Locale };
};

export default async function SportTypeCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const createData = async (data: ProductCreateInput) => {
    "use server";
    const res = await api.product.create.mutate(data);
    revalidatePath("/");
    return res;
  };

  return (
    <section className="main-create-padding">
      <h3>Create Product</h3>
      <CreateProductForm t={t} createData={createData} lang={params.lang} />
    </section>
  );
}
