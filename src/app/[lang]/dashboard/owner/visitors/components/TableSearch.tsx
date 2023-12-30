"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { type Locale } from "@/lib/internationalization";
import { type UserListInput } from "@/server/api/routers/user";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  query: UserListInput;
  lang: Locale;
  loading: boolean;
};

export default function TableSearch({ query, lang, loading }: Props) {
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
        <Input
          key={query.params?.fullName}
          defaultValue={query.params?.fullName}
          name="fullName"
          autoComplete="off"
          placeholder="Search by full name..."
          icon={ICONS.search}
        />
      </section>
      <Button loading={loading} type="submit" className="relative h-full w-[20%]" size="xl">
        <Iconify icon={ICONS.search} className="md:hidden absolute centered" width={30} />
        <span className="md:block hidden">Search</span>
      </Button>
    </form>
  );
}
