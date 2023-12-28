"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { toast } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { schema } from "@/schema";
import { type ProductCreateInput } from "@/server/api/routers/product";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  createData: (data: ProductCreateInput) => Promise<TRPC_RESPONSE>;
  lang: Locale;
  t: Dictionary;
};

export default function CreateProductForm({ createData, lang, t }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductCreateInput>({
    resolver: zodResolver(schema.product.create),
    defaultValues: { price: 0 },
  });

  const onSubmit: SubmitHandler<ProductCreateInput> = async (data) => {
    setLoading(true);
    const res = await createData(data);
    setLoading(false);
    reset();
    if (!res.status) return toast({ t, type: "error", description: "Product with this name is already exists" });
    toast({ t, type: "success", description: "Product has been created" });
    router.push(USER_REDIRECT.OWNER({ lang, href: "/products" }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      <section className="grid md:grid-cols-2 gap-6">
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
