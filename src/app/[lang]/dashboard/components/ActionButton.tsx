import Iconify from "@/components/Iconify";
import { USER_REDIRECT } from "@/lib/constants";
import { actionVariants } from "@/styles/variants";
import { type Lang, type MouseEvent } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { type Role } from "@prisma/client";
import Link from "next/link";
import { type VariantProps } from "tailwind-variants";

type Props = VariantProps<typeof actionVariants> & {
  icon: IconifyIcon | string;
  onClick?: MouseEvent;
  href?: string;
  role?: Role;
  lang?: Lang;
};

export default function ActionButton({ color, role, icon, onClick, href, lang }: Props) {
  return href && role && lang ? (
    <Link href={USER_REDIRECT[role]({ lang, href })}>
      <Iconify icon={icon} width={25} className={actionVariants({ color })} />
    </Link>
  ) : (
    <button type="button" onClick={onClick}>
      <Iconify icon={icon} width={25} className={actionVariants({ color })} />
    </button>
  );
}
