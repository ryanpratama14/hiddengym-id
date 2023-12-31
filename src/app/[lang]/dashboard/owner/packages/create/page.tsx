import { useDictionary } from "@/lib/dictionary";
import { api } from "@/trpc/server";
import { type Lang } from "@/types";
import CreatePackageForm from "@owner/packages/create/components/CreatePackageForm";

type Props = {
  params: { lang: Lang };
};

export default async function PackageCreatePage({ params }: Props) {
  const option = {
    places: await api.place.list.query(),
    sports: await api.sport.list.query(),
    trainers: await api.user.listTrainer.query(),
  };

  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Create Package</h3>
      <CreatePackageForm option={option} lang={params.lang} t={t} />
    </section>
  );
}
