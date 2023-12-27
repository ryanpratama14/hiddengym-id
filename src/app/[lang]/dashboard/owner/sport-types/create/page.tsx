import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import { type SportCreateInput } from "@/server/api/routers/sport";
import { api } from "@/trpc/server";
import CreateSportForm from "@owner/sport-types/components/CreateSportForm";
import { revalidatePath } from "next/cache";

type Props = {
  params: { lang: Locale };
};

export default async function SportTypeCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const createSportType = async (data: SportCreateInput) => {
    "use server";
    const res = await api.sport.create.mutate(data);
    revalidatePath("/");
    return res;
  };

  return (
    <section className="flex flex-col gap-12 items-center justify-center pt-16">
      <h3>Create Sport Type</h3>
      <CreateSportForm t={t} createSportType={createSportType} lang={params.lang} />
    </section>
  );
}
