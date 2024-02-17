import Iconify from "@/components/Iconify";
import { USER_REDIRECT } from "@/lib/constants";
import { actionVariants } from "@/styles/variants";
import type { DashboardHrefKey, Lang, MouseEvent } from "@/types";
import type { IconifyIcon } from "@iconify/react/dist/iconify.js";
import type { Role } from "@prisma/client";
import Link from "next/link";
import type { VariantProps } from "tailwind-variants";

type Props = VariantProps<typeof actionVariants> & {
  icon: IconifyIcon | string;
  onClick?: MouseEvent;
  href?: DashboardHrefKey;
  role?: Role;
  lang?: Lang;
  params?: string;
};

export default function ActionButton({ color, role, icon, onClick, href, lang, params }: Props) {
  return href && role && lang ? (
    <Link href={USER_REDIRECT({ lang, role, href, params })} className={actionVariants({ color })}>
      <Iconify icon={icon} width={18} className="absolute centered" />
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={actionVariants({ color })}>
      <Iconify icon={icon} width={18} className="absolute centered" />
      <span className="sr-only">Action</span>
    </button>
  );
}
