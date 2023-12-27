"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { toast } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { schema } from "@/schema";
import { type SportCreateInput } from "@/server/api/routers/sport";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  createSportType: (data: SportCreateInput) => Promise<TRPC_RESPONSE>;
  lang: Locale;
  t: Dictionary;
};

export default function CreateSportForm({ createSportType, lang, t }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SportCreateInput>({
    resolver: zodResolver(schema.sport.create),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<SportCreateInput> = async (data) => {
    setLoading(true);
    const res = await createSportType(data);
    setLoading(false);
    reset();
    if (!res.status) return toast({ t, type: "error", description: "Sport Type with this name is already exists" });
    toast({ t, type: "success", description: "Sport type has been created" });
    router.push(USER_REDIRECT.OWNER({ lang, href: "/sport-types" }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      <Input icon={ICONS.sport} error={errors.name?.message} label="Name" {...register("name")} />
      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Sport Type
        </Button>
      </section>
    </form>
  );
}
