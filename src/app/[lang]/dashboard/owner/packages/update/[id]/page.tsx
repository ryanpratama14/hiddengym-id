import { useDictionary } from "@/lib/dictionary";
import { api } from "@/trpc/server";
import { type Lang } from "@/types";
import UpdatePackageForm from "./components/UpdatePackageForm";

type Props = {
  params: { lang: Lang; id: string };
};

export default async function PackageCreatePage({ params }: Props) {
  const option = {
    places: await api.place.list.query(),
    sports: await api.sport.list.query(),
    trainers: await api.user.listTrainer.query(),
  };

  const data = await api.package.detail.query({ id: params.id });

  const t = await useDictionary(params.lang);

  return (
    <section className="main-create-padding">
      <h3>Update Package</h3>
      <UpdatePackageForm option={option} lang={params.lang} t={t} data={data} />
    </section>
  );
}
