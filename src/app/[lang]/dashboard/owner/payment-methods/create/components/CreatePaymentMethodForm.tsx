"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { toast } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { schema } from "@/schema";
import { type PaymentMethodCreateInput } from "@/server/api/routers/paymentMethod";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  createData: (data: PaymentMethodCreateInput) => Promise<TRPC_RESPONSE>;
  lang: Locale;
  t: Dictionary;
};

export default function CreatePaymentMethodForm({ createData, lang, t }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentMethodCreateInput>({
    resolver: zodResolver(schema.paymentMethod.create),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<PaymentMethodCreateInput> = async (data) => {
    setLoading(true);
    const res = await createData(data);
    setLoading(false);
    reset();
    if (!res.status) return toast({ t, type: "error", description: "Payment method with this name is already exists" });
    toast({ t, type: "success", description: "Payment method has been created" });
    router.push(USER_REDIRECT.OWNER({ lang, href: "/payment-methods" }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      <Input icon={ICONS.name} error={errors.name?.message} label="Name" {...register("name")} />
      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Payment Method
        </Button>
      </section>
    </form>
  );
}
