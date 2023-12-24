"use client";

import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginVisitor, schema } from "@/schema";
import Button from "@/components/Button";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { type Dictionary } from "@/lib/dictionary";
import Input from "@/components/Input";
import { EMAIL_VISITOR_READONLY, USER_PATHNAMES } from "@/lib/constants";
import { openToast } from "@/lib/utils";

type Props = {
  callbackUrl?: string;
  t: Dictionary;
};

export default function SignInVisitor({ callbackUrl, t }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    reset,
  } = useForm<LoginVisitor>({ resolver: zodResolver(schema.loginVisitor) });

  const onSubmit: SubmitHandler<LoginVisitor> = (data) => logIn(data);

  const { mutate: logIn, isLoading } = useMutation({
    mutationFn: async (data: LoginVisitor) => {
      const email = EMAIL_VISITOR_READONLY;
      const res = await signIn("credentials", {
        email,
        credential: data.credential,
        redirect: false,
      });
      if (!res?.error) {
        reset();
        openToast({ message: t.login.correct.message, description: t.login.correct.description, type: "success" });
        router.push(callbackUrl ? `/${callbackUrl}` : USER_PATHNAMES.VISITOR);
      } else {
        openToast({ message: t.login.incorrectPhoneNumber, type: "error" });
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
          <Button
            loading={isLoading}
            disabled={isLoading}
            className="mt-2"
            type="submit"
            color={isLoading ? "disabled" : "expired"}
            size="xl"
          >
            Sign In
          </Button>
        </form>
      </section>
    </section>
  );
}
