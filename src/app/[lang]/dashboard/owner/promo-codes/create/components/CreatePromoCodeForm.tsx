"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { toastError, toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { ICONS, PROMO_CODE_TYPES, USER_REDIRECT } from "@/lib/constants";
import { schema } from "@/schema";
import { api } from "@/trpc/react";
import { type Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type PromoCodeCreateInput } from "@router/promoCode";
import { useRouter } from "next/navigation";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  t: Dictionary;
};

export default function CreatePromoCodeForm({ t }: Props) {
  const { lang } = useZustand();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PromoCodeCreateInput>({
    resolver: zodResolver(schema.promoCode.create),
    defaultValues: { isActive: true, discountPrice: 0, type: "REGULAR" },
  });

  const onSubmit: SubmitHandler<PromoCodeCreateInput> = async (data) => createData(data);

  const { mutate: createData, isPending: loading } = api.promoCode.create.useMutation({
    onSuccess: (res) => {
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT({ lang, href: "/promo-codes", role: "OWNER" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <section className="grid md:grid-cols-2 gap-4">
        <Input icon={ICONS.promo_codes} error={errors.code?.message} label="Code" {...register("code")} />
        <Input
          type="number"
          icon={ICONS.payment_method}
          error={errors.discountPrice?.message}
          label="Discount Price"
          {...register("discountPrice", { setValueAs: (v: string) => (!v ? 0 : parseInt(v)) })}
        />
      </section>

      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <InputSelect {...field} icon={ICONS.package} error={errors.type?.message} options={PROMO_CODE_TYPES} label="Type" />
        )}
      />
      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Promo Code
        </Button>
      </section>
    </form>
  );
}
