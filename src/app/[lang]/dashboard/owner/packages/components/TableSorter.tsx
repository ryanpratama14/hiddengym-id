"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import { ICONS, PACKAGE_SORTERERS } from "@/lib/constants";
import { cn, getSorterSlug } from "@/lib/functions";

type Props = { newParams: URLSearchParams; redirect: (newParams: URLSearchParams) => void };

export default function TableSorter({ newParams, redirect }: Props) {
  return (
    <section className="hidden md:flex flex-col gap-2">
      <section className="flex justify-between items-end">
        <p className={cn("text-gray-600 text-sm")}>Sort by</p>
        {newParams.get("sort") ? (
          <Button
            className="shadow"
            color="expired"
            onClick={() => {
              newParams.delete("sort");
              redirect(newParams);
            }}
          >
            Reset
          </Button>
        ) : null}
      </section>
      <section className="flex flex-col gap-1">
        {PACKAGE_SORTERERS.map((opt) => {
          const sort = getSorterSlug(newParams.get("sort"));
          const active = sort?.name === opt.name;
          return (
            <section key={opt.name} className="flex gap-2 items-center">
              <Button
                onClick={() => {
                  if (sort?.sorterer === "asc") {
                    newParams.set("sort", `${opt.name}-desc`);
                  } else newParams.set("sort", `${opt.name}-asc`);
                  redirect(newParams);
                }}
                className={cn("hover:underline w-fit text-dark", {
                  underline: active,
                })}
                size="none"
                color="none"
              >
                {opt.title}
              </Button>
              {active && sort?.sorterer ? (
                <Iconify
                  icon={ICONS.arrow}
                  className={cn("bg-cream text-dark border-1.5 border-black rounded-md shadow", {
                    "rotate-180": sort.sorterer === "asc",
                  })}
                  width={22}
                />
              ) : null}
            </section>
          );
        })}
      </section>
    </section>
  );
}
