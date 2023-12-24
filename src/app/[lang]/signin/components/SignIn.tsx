import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Login, schema } from "@/schema";
import Button from "@/components/Button";
import { useMutation } from "@tanstack/react-query";
import { getSession, signIn } from "next-auth/react";
import { PulseLoader } from "react-spinners";
import { type Dictionary } from "@/lib/dictionary";
import Input from "@/components/Input";
import { ICONS, USER_PATHNAMES } from "@/lib/constants";
import { COLORS } from "@/styles/theme";
import { openToast } from "@/lib/utils";

type Props = {
  callbackUrl?: string;
  setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
  t: Dictionary;
};

export default function Login({ callbackUrl, t }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    reset,
  } = useForm<Login>({ resolver: zodResolver(schema.login) });

  const onSubmit: SubmitHandler<Login> = (data) => logIn(data);

  const { mutate: logIn, isLoading } = useMutation({
    mutationFn: async (data: Login) => {
      const res = await signIn("credentials", {
        credential: data.credential,
        email: data.email,
        redirect: false,
      });
      const session = await getSession();
      if (!res?.error && session?.user) {
        reset();
        openToast({ message: t.login.correct.message, description: t.login.correct.description, type: "success" });
        router.push(callbackUrl ? `/${callbackUrl}` : USER_PATHNAMES[session.user.role]);
      } else {
        openToast({ message: t.login.incorrectEmail, type: "error" });
        resetField("credential");
      }
    },
  });

  return (
    <section className="w-full flex flex-col gap-8">
      <section className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            icon={ICONS.email}
            placeholder="hiddengym@gmail.com"
            type="text"
            {...register("email")}
            error={errors.email?.message}
            label="Email"
          />
          <Input withPasswordIcon {...register("credential")} error={errors.credential?.message} type="password" />
          <Button className="mt-2" type="submit" color={isLoading ? "disabled" : "expired"} size="xl" disabled={isLoading}>
            {isLoading ? <PulseLoader color={COLORS.cream} size={6} /> : "Sign In"}
          </Button>
        </form>
      </section>
    </section>
  );
}
