import { PackageCreateInput } from "@/server/api/routers/package";
import { api } from "@/trpc/server";
import CreatePackageForm from "../components/CreatePackageForm";

export default function PackageCreatePage() {
  const createPackage = async (data: PackageCreateInput) => {
    "use server";
    const res = await api.package.create.query(data);
    return res;
  };

  return (
    <section className="flex flex-col gap-12 items-center justify-center pt-16">
      <h3>Create Package</h3>
      <CreatePackageForm createPackage={createPackage} />
    </section>
  );
}
