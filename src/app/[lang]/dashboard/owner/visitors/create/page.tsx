import { type UserCreateVisitorInput } from "@/server/api/routers/user";
import { api } from "@/trpc/server";
import CreateVisitorForm from "./components/CreateVisitorForm";
import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";

type Props = {
  params: { lang: Locale };
};

export default async function CustomerCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const createVisitor = async (data: UserCreateVisitorInput) => {
    "use server";
    const res = await api.user.createVisitor.mutate(data);
    return res;
  };

  return (
    <section className="flex flex-col gap-12 items-center justify-center pt-16">
      <h3>Create Visitor</h3>
      <CreateVisitorForm t={t} createVisitor={createVisitor} lang={params.lang} />
    </section>
  );
}
