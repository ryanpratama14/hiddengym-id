"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import { toast } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { schema } from "@/schema";
import { type PlaceCreateInput } from "@/server/api/routers/place";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  createPlace: (data: PlaceCreateInput) => Promise<TRPC_RESPONSE>;
  lang: Locale;
  t: Dictionary;
};

export default function CreatePlaceForm({ createPlace, lang, t }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlaceCreateInput>({
    resolver: zodResolver(schema.place.create),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<PlaceCreateInput> = async (data) => {
    setLoading(true);
    const res = await createPlace(data);
    setLoading(false);
    reset();
    if (!res.status) return toast({ t, type: "error", description: "Place is already exists" });
    toast({ t, type: "success", description: "Place has been created" });
    router.push(USER_REDIRECT.OWNER({ lang, href: "/places" }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
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
