import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import { type PackageCreateInput } from "@/server/api/routers/package";
import { api } from "@/trpc/server";
import CreatePackageForm from "@owner/packages/create/components/CreatePackageForm";
import { revalidatePath } from "next/cache";

type Props = {
  params: { lang: Locale };
};

export default async function PackageCreatePage({ params }: Props) {
  const createData = async (data: PackageCreateInput) => {
    "use server";
    const res = await api.package.create.query(data);
    revalidatePath("/");
    return res;
  };

  const option = {
    places: await api.place.list.query(),
    sports: await api.sport.list.query(),
    trainers: await api.user.listTrainer.query(),
  };

  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Create Package</h3>
      <CreatePackageForm createData={createData} option={option} lang={params.lang} t={t} />
    </section>
  );
}
