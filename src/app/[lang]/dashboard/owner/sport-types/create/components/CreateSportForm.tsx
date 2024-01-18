"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { toastError, toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { schema } from "@/schema";
import { type SportCreateInput } from "@/server/api/routers/sport";
import { api } from "@/trpc/react";
import { type Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  t: Dictionary;
};

export default function CreateSportForm({ t }: Props) {
  const { lang } = useZustand();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SportCreateInput>({
    resolver: zodResolver(schema.sport.create),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<SportCreateInput> = async (data) => createData(data);

  const { mutate: createData, isPending: loading } = api.sport.create.useMutation({
    onSuccess: (res) => {
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT.OWNER({ lang, href: "/sport-types" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <Input icon={ICONS.sport} error={errors.name?.message} label="Name" {...register("name")} />
      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Sport Type
        </Button>
      </section>
    </form>
  );
}
