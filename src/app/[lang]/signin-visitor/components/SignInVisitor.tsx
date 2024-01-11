"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { toastError, toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { EMAIL_VISITOR_READONLY, USER_REDIRECT } from "@/lib/constants";
import { schema, type LoginVisitor } from "@/schema";
import { type Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  callbackUrl?: string;
  t: Dictionary;
};

export default function SignInVisitor({ callbackUrl, t }: Props) {
  const { lang } = useZustand();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    reset,
  } = useForm<LoginVisitor>({ resolver: zodResolver(schema.loginVisitor) });

  const onSubmit: SubmitHandler<LoginVisitor> = (data) => logIn(data);

  const { mutate: logIn, isPending: loading } = useMutation({
    mutationFn: async (data: LoginVisitor) => {
      const email = EMAIL_VISITOR_READONLY;
      const res = await signIn("credentials", {
        email,
        credential: data.credential,
        redirect: false,
      });
      if (!res?.error) {
        reset();
        toastSuccess({ t, description: t.login.correct });
        router.push(callbackUrl ? `/${lang}${callbackUrl}` : USER_REDIRECT.VISITOR({ lang, href: "" }));
      } else {
        toastError({ t, description: t.login.incorrectPhoneNumber });
        resetField("credential");
      }
    },
  });

  return (
    <section className="w-full flex flex-col gap-8">
      <section className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            isPhoneNumber
            maxLength={12}
            label="Phone Number"
            className="w-full"
            {...register("credential")}
            error={errors.credential?.message}
          />
          <Button loading={loading} className="mt-2" type="submit" color="expired" size="xl">
            Sign In
          </Button>
        </form>
      </section>
    </section>
  );
}
