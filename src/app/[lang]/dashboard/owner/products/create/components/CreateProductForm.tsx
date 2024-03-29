"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { toastError, toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { api } from "@/trpc/react";
import type { Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductCreateInput } from "@router/product";
import { schema } from "@schema";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";

type Props = {
  t: Dictionary;
};

export default function CreateProductForm({ t }: Props) {
  const { lang } = useZustand();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductCreateInput>({
    mode: "onBlur",
    resolver: zodResolver(schema.product.create),
    defaultValues: { price: 0 },
  });

  const onSubmit: SubmitHandler<ProductCreateInput> = async (data) => createData(data);

  const { mutate: createData, isPending: loading } = api.product.create.useMutation({
    onSuccess: (res) => {
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT({ lang, href: "/products", role: "OWNER" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <section className="grid md:grid-cols-2 gap-4">
        <Input icon={ICONS.name} error={errors.name?.message} label="Product Name" {...register("name")} />
        <Input
          type="number"
          icon={ICONS.payment_method}
          error={errors.price?.message}
          label="Unit Price"
          {...register("price", { setValueAs: (v: string) => (!v ? 0 : parseInt(v)) })}
        />
      </section>
      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Product
        </Button>
      </section>
    </form>
  );
}
