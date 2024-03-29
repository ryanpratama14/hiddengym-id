"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import { toastError, toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { api } from "@/trpc/react";
import type { Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PlaceCreateInput } from "@router/place";
import { schema } from "@schema";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";

type Props = {
  t: Dictionary;
};

export default function CreatePlaceForm({ t }: Props) {
  const { lang } = useZustand();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaceCreateInput>({
    mode: "onBlur",
    resolver: zodResolver(schema.place.create),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<PlaceCreateInput> = async (data) => createData(data);

  const { mutate: createData, isPending: loading } = api.place.create.useMutation({
    onSuccess: (res) => {
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT({ lang, href: "/places", role: "OWNER" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <Input icon={ICONS.place} error={errors.name?.message} label="Name" {...register("name")} />
      <Input icon={ICONS.url} error={errors.url?.message} label="Google Maps Link" {...register("url")} />
      <InputTextArea label="Address" {...register("address")} error={errors.address?.message} />
      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Place
        </Button>
      </section>
    </form>
  );
}
