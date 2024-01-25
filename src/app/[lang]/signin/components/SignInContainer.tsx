"use client";

import Logo from "@/components/Logo";
import type { Dictionary } from "@/types";
import { useState } from "react";
import SignIn from "./SignIn";

type Props = {
  callbackUrl?: string;
  t: Dictionary;
};

export default function SignInPageContainer({ callbackUrl, t }: Props) {
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <article className="flex items-center justify-center h-dvh">
      <section className="flex md:flex-row flex-col md:flex-nowrap flex-wrap md:w-[80%] w-full md:bg-light">
        <section className="md:w-[50%] w-full flex items-center justify-center max-md:border-b-2 border-dark max-md:rounded-b-full bg-cream aspect-[4/3] md:aspect-square">
          <header className="flex flex-col items-center justify-center gap-6 w-[50%] max-md:-translate-y-4 md:-translate-x-4">
            <Logo className="w-full aspect-video" />
            <section className="flex flex-col text-center">
              <h6>HIDDEN GYM</h6>
              <small className="italic">eat sleep gym repeat</small>
            </section>
          </header>
        </section>
        <section className="md:shadow-lg gap-8 p-normal md:w-[50%] w-full  md:bg-light flex flex-col justify-center items-center aspect-square">
          <h4>{isForgotPassword ? "Reset Password" : t.login.welcomeBack}</h4>
          <SignIn callbackUrl={callbackUrl} setIsForgotPassword={setIsForgotPassword} t={t} />
        </section>
      </section>
    </article>
  );
}
