import { type UserCreateVisitorInput } from "@/server/api/routers/user";
import { api } from "@/trpc/server";
import CreateVisitorForm from "./components/CreateVisitorForm";

export default function CustomerCreatePage() {
  const createVisitor = async (data: UserCreateVisitorInput) => {
    "use server";
    const res = await api.user.createVisitor.mutate(data);
    return res;
  };

  return (
    <section className="flex flex-col gap-12 items-center justify-center pt-16">
      <h3>Create Visitor</h3>
      <CreateVisitorForm createVisitor={createVisitor} />
    </section>
  );
}
