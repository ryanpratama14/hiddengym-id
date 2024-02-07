"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { toastError, toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import type { Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Login, schema } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";

type Props = {
  callbackUrl?: string;
  setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
  t: Dictionary;
};

export default function SignIn({ callbackUrl, t }: Props) {
  const { lang } = useZustand();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    reset,
  } = useForm<Login>({ mode: "onBlur", resolver: zodResolver(schema.login) });

  const onSubmit: SubmitHandler<Login> = (data) => logIn(data);

  const { mutate: logIn, isPending: loading } = useMutation({
    mutationFn: async (data: Login) => {
      const res = await signIn("credentials", {
        credential: data.credential,
        email: data.email,
        redirect: false,
      });
      const session = await getSession();
      if (!res?.error && session?.user) {
        reset();
        toastSuccess({ t, description: t.login.correct });
        router.push(callbackUrl ? `/${lang}${callbackUrl}` : USER_REDIRECT({ lang, href: "", role: session.user.role }));
      } else {
        toastError({ t, description: t.login.incorrectEmail });
        resetField("credential");
      }
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      <Input
        icon={ICONS.email}
        placeholder="hiddengym@gmail.com"
        type="text"
        {...register("email")}
        error={errors.email?.message}
        label="Email"
      />
      <Input withPasswordIcon {...register("credential")} error={errors.credential?.message} type="password" />
      <Button className="mt-2" type="submit" size="xl" color="expired" loading={loading}>
        Sign In
      </Button>
    </form>
  );
}
