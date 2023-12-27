import { type Locale } from "@/i18n.config";
import { useDictionary } from "@/lib/dictionary";
import { type UserCreateVisitorInput } from "@/server/api/routers/user";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import CreateVisitorForm from "./components/CreateVisitorForm";

type Props = {
  params: { lang: Locale };
};

export default async function CustomerCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const createVisitor = async (data: UserCreateVisitorInput) => {
    "use server";
    const res = await api.user.createVisitor.mutate(data);
    revalidatePath("/");
    return res;
  };

  const option = {
    packages: await api.package.list.query(),
    paymentMethods: await api.paymentMethod.list.query(),
  };

  return (
    <section className="main-create-padding">
      <h3>Create Visitor</h3>
      <CreateVisitorForm option={option} t={t} createVisitor={createVisitor} lang={params.lang} />
    </section>
  );
}
