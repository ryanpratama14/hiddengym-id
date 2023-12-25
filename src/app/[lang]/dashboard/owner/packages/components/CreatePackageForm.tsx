"use client";

import Input from "@/components/Input";
import { ICONS } from "@/lib/constants";
import { schema } from "@/schema";
import { type PackageCreateInput } from "@/server/api/routers/package";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  createPackage: (data: PackageCreateInput) => Promise<TRPC_RESPONSE>;
};

export default function CreatePackageForm({ createPackage }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PackageCreateInput>({
    resolver: zodResolver(schema.package.create),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<PackageCreateInput> = async (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <section className="grid md:grid-cols-2 gap-6">
        <Input error={errors.name?.message} label="Name" {...register("name")} />
        <Input icon={ICONS.payment_method} type="number" error={errors.price?.message} label="Price" {...register("price")} />
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        <Input type="number" error={errors.validityInDays?.message} label="Validity In Days" {...register("validityInDays")} />
        <Input
          type="number"
          error={errors.totalPermittedSessions?.message}
          label="Total Permitted Sessions"
          {...register("totalPermittedSessions")}
        />
      </section>
    </form>
  );
}
