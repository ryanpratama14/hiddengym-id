"use client";

import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInVisitorHeader() {
  const router = useRouter();
  const [count, setCount] = useState(0);

  return (
    <header className="flex flex-col items-center justify-center gap-6 w-[50%] max-md:-translate-y-4 md:-translate-x-4">
      <Logo
        onClick={() => {
          setCount((prev) => prev + 1);
          if (count === 7) return router.push(`/signin`);
        }}
        className="w-full aspect-video"
      />
      <section className="flex flex-col text-center">
        <h6>HIDDEN GYM</h6>
        <small className="italic ">eat sleep gym repeat</small>
      </section>
    </header>
  );
}
