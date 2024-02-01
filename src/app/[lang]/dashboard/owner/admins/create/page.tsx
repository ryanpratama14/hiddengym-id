"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { GENDER_OPTIONS, ICONS, USER_REDIRECT } from "@/lib/constants";
import { getInputDate } from "@/lib/functions";
import { schema } from "@/server/schema";
import { api } from "@/trpc/react";
import type { Lang } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserCreateInput } from "@router/user";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";

type Props = { params: { lang: Lang } };

export default function AdminCreatePage({ params }: Props) {
  const router = useRouter();
  const { t } = useZustand();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateInput>({
    resolver: zodResolver(schema.user.create),
    defaultValues: { role: "ADMIN", gender: "MALE" },
  });

  const onSubmit: SubmitHandler<UserCreateInput> = (data) => createData(data);

  const { mutate: createData, isPending: loading } = api.user.create.useMutation({
    onSuccess: async (res) => {
      t && toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT({ lang: params.lang, href: "/admins", role: "OWNER" }));
    },
    onError: (res) => t && toastSuccess({ t, description: res.message }),
  });

  return (
    <section className="main-create-padding">
      <h3>Create Admin</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <section className="grid md:grid-cols-2 gap-4">
          <Input error={errors.fullName?.message} icon={ICONS.person} label="Full Name" {...register("fullName")} />
          <Input error={errors.phoneNumber?.message} label="Phone Number" {...register("phoneNumber")} isPhoneNumber />
        </section>
        <section className="grid md:grid-cols-2 gap-4">
          <Input error={errors.email?.message} icon={ICONS.email} label="Email" {...register("email")} />
          <section className="grid md:grid-cols-2 gap-4">
            <Input
              {...register("birthDate")}
              error={errors.birthDate?.message}
              label="Date of Birth (Optional)"
              type="date"
              max={getInputDate({})}
            />
            <section className="flex flex-col">
              <p className="font-medium">Gender</p>
              <section className="grid grid-cols-2 h-10">
                {GENDER_OPTIONS.map((option, index) => {
                  return (
                    <section key={option.label} className="items-center flex gap-2">
                      <button
                        type="button"
                        className="relative rounded-full size-6 bg-white border-1 border-dark has-[:checked]:bg-dark"
                      >
                        <input
                          value={option.value}
                          className="cursor-pointer absolute w-full h-full opacity-0 z-10 top-0 left-0"
                          id={`gender_option_${index}`}
                          type="radio"
                          {...register("gender")}
                        />
                        <div className="animate absolute centered w-[40%] aspect-square rounded-full bg-white has-[:checked]:scale-0" />
                      </button>
                      <label className="flex items-center" htmlFor={`gender_option_${index}`}>
                        <Iconify color={option.color} width={25} icon={option.icon} />
                        {option.label}
                      </label>
                    </section>
                  );
                })}
              </section>
            </section>
          </section>
        </section>
        <section className="grid md:grid-cols-2 gap-4">
          <Input
            error={errors.credential?.message}
            icon={ICONS.password}
            label="Password"
            {...register("credential")}
            type="password"
            withPasswordIcon
          />
          <Input
            error={errors.confirmCredential?.message}
            icon={ICONS.password}
            label="Confirm Password"
            {...register("confirmCredential")}
            type="password"
            withPasswordIcon
          />
        </section>
        <section className="flex justify-center items-center">
          <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
            Create Admin
          </Button>
        </section>
      </form>
    </section>
  );
}
