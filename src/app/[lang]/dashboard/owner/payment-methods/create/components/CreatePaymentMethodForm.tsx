"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { toastError, toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { api } from "@/trpc/react";
import type { Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PaymentMethodCreateInput } from "@router/paymentMethod";
import { schema } from "@schema";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";

type Props = {
  t: Dictionary;
};

export default function CreatePaymentMethodForm({ t }: Props) {
  const { lang } = useZustand();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentMethodCreateInput>({
    mode: "onBlur",
    resolver: zodResolver(schema.paymentMethod.create),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<PaymentMethodCreateInput> = async (data) => createData(data);

  const { mutate: createData, isPending: loading } = api.paymentMethod.create.useMutation({
    onSuccess: (res) => {
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT({ lang, href: "/payment-methods", role: "OWNER" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <Input icon={ICONS.name} error={errors.name?.message} label="Name" {...register("name")} />
      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Payment Method
        </Button>
      </section>
    </form>
  );
}
