import Iconify from "@/components/Iconify";
import { cn } from "@/lib/functions";
import type { IconifyIcon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { inputIconSize } from "./Input";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
  icon?: IconifyIcon | string;
};

export default function NavigatorX({ href, children, newTab, className, icon }: Props) {
  return (
    <Link
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={cn(className, { "gap-2": icon })}
      href={href}
    >
      {icon ? <Iconify icon={icon} width={inputIconSize} /> : null}
      {children}
    </Link>
  );
}
