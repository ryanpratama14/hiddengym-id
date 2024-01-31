import { useDictionary } from "@/lib/dictionary";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import type { Lang } from "@/types";
import type { PackageTransactionCreateInput } from "@router/packageTransaction";
import { revalidatePath } from "next/cache";
import CreateVisitorForm from "./components/CreateVisitorForm";

type Props = {
  params: { lang: Lang };
};

export default async function CustomerCreatePage({ params }: Props) {
  const t = await useDictionary(params.lang);

  const createPackageTransaction = async (data: PackageTransactionCreateInput) => {
    "use server";
    const res = await api.packageTransaction.create.mutate(data);
    revalidatePath("/");
    return res;
  };

  const option = {
    packages: await api.package.list.query({}),
    paymentMethods: await api.paymentMethod.list.query(),
  };

  const session = await getServerAuthSession();

  if (session)
    return (
      <section className="main-create-padding">
        <h3>Create Visitor</h3>
        <CreateVisitorForm
          session={session}
          option={option}
          t={t}
          createPackageTransaction={createPackageTransaction}
          lang={params.lang}
        />
      </section>
    );
}
