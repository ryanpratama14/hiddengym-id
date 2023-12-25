import Iconify from "@/components/Iconify";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/styles/variants";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { type VariantProps } from "tailwind-variants";

const iconSize = 22;

const Navigator = ({
  href,
  children,
  newTab,
  className,

  icon,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
  target?: React.HTMLAttributeAnchorTarget;

  icon?: IconifyIcon | string;
} & VariantProps<typeof buttonVariants>) => {
  return (
    <Link
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={cn({ "gap-2": icon }, buttonVariants({ ...rest, className }))}
      href={href}
    >
      {icon ? <Iconify icon={icon} width={iconSize} /> : null}
      {children}
    </Link>
  );
};

export default Navigator;
