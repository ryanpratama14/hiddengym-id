import Button from "@/components/Button";
import Input from "@/components/Input";
import { toast } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { schema, type Login } from "@/schema";
import { COLORS } from "@/styles/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { PulseLoader } from "react-spinners";

type Props = {
  callbackUrl?: string;
  setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
  t: Dictionary;
  lang: Locale;
};

export default function Login({ callbackUrl, t, lang }: Props) {
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
        toast({ t, description: t.login.correct, type: "success" });
        router.push(callbackUrl ? `/${lang}${callbackUrl}` : USER_REDIRECT[session.user.role]({ lang, href: "" }));
      } else {
        toast({ t, description: t.login.incorrectEmail, type: "error" });
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
