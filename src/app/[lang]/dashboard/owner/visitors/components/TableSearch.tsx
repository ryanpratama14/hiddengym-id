"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { ICONS } from "@/lib/constants";
import { type SearchParams } from "@/types";

type Props = {
  searchParams: SearchParams;
  loading: boolean;
  newParams: URLSearchParams;
  redirectTable: (newParams: URLSearchParams) => void;
};

export default function TableSearch({ searchParams, loading, newParams, redirectTable }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const val = e.target as HTMLFormElement;
        const search = val.fullName as HTMLInputElement;
        if (search.value) {
          newParams.set("fullName", search.value);
        } else newParams.delete("fullName");
        newParams.delete("page");
        redirectTable(newParams);
      }}
      className="flex justify-between gap-2 md:gap-6"
    >
      <section className="relative w-[80%] group">
        <Input
          key={searchParams.fullName as string}
          defaultValue={searchParams.fullName}
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
