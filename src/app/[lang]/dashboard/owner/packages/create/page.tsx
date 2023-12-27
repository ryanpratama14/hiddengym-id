import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import { type PackageCreateInput } from "@/server/api/routers/package";
import { api } from "@/trpc/server";
import CreatePackageForm from "@owner/packages/create/components/CreatePackageForm";

type Props = {
  params: { lang: Locale };
};

export default async function PackageCreatePage({ params }: Props) {
  const createPackage = async (data: PackageCreateInput) => {
    "use server";
    const res = await api.package.create.query(data);
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
      <CreatePackageForm createPackage={createPackage} option={option} lang={params.lang} t={t} />
    </section>
  );
}
