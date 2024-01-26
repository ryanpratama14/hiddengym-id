import { ICONS } from "@/lib/constants";
import { cn } from "@/lib/functions";
import type { SearchParams } from "@/types";
import Iconify from "./Iconify";

type Props = {
  name: string;
  searchParams: SearchParams;
};

export default function FilterIcon({ name, searchParams }: Props) {
  return (
    <section
      className={cn("aspect-square w-7 text-cream hover:text-dark hover:bg-cream relative rounded-full hover:shadow-lg animate", {
        "bg-cream text-dark": Object.keys(searchParams).includes(name),
      })}
    >
      <Iconify icon={ICONS.search} width={22} className="absolute centered" />
    </section>
  );
}
