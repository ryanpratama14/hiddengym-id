"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import { type Locale } from "@/i18n.config";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { cn, createUrl } from "@/lib/utils";
import { type UserListInput } from "@/server/api/routers/user";
import { inputVariants } from "@/styles/variants";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  query: UserListInput;
  lang: Locale;
};

export default function TableSearch({ query, lang }: Props) {
  const router = useRouter();
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const val = e.target as HTMLFormElement;
        const search = val.fullName as HTMLInputElement;
        if (search.value) {
          newParams.set("q", search.value);
        } else newParams.delete("q");
        newParams.delete("page");
        router.push(createUrl(USER_REDIRECT.OWNER({ lang, href: "/visitors" }), newParams));
      }}
      className="flex justify-between gap-2 md:gap-6"
    >
      <section className="relative w-[80%] group">
        <input
          key={query.params?.fullName}
          defaultValue={query.params?.fullName}
          name="fullName"
          autoComplete="off"
          className={cn("pl-10 py-5", inputVariants({ border: "bottom", rounded: "none", color: "orange" }))}
          placeholder="Search by name..."
        />
        <Iconify icon={ICONS.search} className="absolute centered-left translate-x-1.5" width={25} />
        <button
          type="button"
          onClick={(e) => {
            const form = e.currentTarget.form!;
            if (form) {
              form.reset();
              if (!newParams.get("q")) return;
            }
            newParams.delete("q");
            router.push(createUrl(USER_REDIRECT.OWNER({ lang, href: "/visitors" }), newParams));
          }}
        >
          <Iconify icon={ICONS.close} className="absolute centered-right -translate-x-1.5 cursor-pointer" width={25} />
        </button>
      </section>
      <Button type="submit" className="relative h-full w-[20%]" size="xl">
        <Iconify icon={ICONS.search} className="md:hidden absolute centered" width={30} />
        <span className="md:block hidden">Search</span>
      </Button>
    </form>
  );
}
