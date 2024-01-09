import { USER_REDIRECT } from "@/lib/constants";
import { cn } from "@/lib/functions";
import { type AddButtonKey, type DashboardMenuKey, type Lang } from "@/types";
import { type Role } from "@prisma/client";
import Link from "next/link";

const DashboardNavigator = ({
  href,
  newTab,
  className,
  role,
  isChildren,
  children,
  lang,
  smallText,
}: {
  href: DashboardMenuKey | AddButtonKey;
  isChildren?: boolean;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
  role: Role;
  lang: Lang;
  smallText?: boolean;
}) => {
  return (
    <Link
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={cn(`select-none font-medium text-base ${className}`, { "ml-3 text-sm": isChildren }, { "text-sm": smallText })}
      href={USER_REDIRECT[role]({ lang, href })}
    >
      {children}
    </Link>
  );
};

export default DashboardNavigator;
