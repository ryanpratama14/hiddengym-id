"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { ICONS } from "@/lib/constants";
import type { SearchParams } from "@/types";

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
        const search = val.search as HTMLInputElement;
        if (search.value) {
          newParams.set("search", search.value);
        } else newParams.delete("search");
        newParams.delete("page");
        redirectTable(newParams);
      }}
      className="gap-4 grid grid-cols-5"
    >
      <Input
        classNameDiv="col-span-4"
        key={searchParams.search}
        defaultValue={searchParams.search}
        name="search"
        autoComplete="off"
        placeholder="Search by name, email or phone number"
        icon={ICONS.search}
      />
      <Button loading={loading} type="submit" className="relative h-full" size="xl">
        <Iconify icon={ICONS.search} className="md:hidden absolute centered" width={30} />
        <span className="md:block hidden">Search</span>
      </Button>
    </form>
  );
}
