import { USER_REDIRECT } from "@/lib/constants";
import { cn } from "@/lib/functions";
import type { AddButtonKey, DashboardMenuKey, Lang } from "@/types";
import type { Role } from "@prisma/client";
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
  isChildrenAddButton,
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
  isChildrenAddButton?: boolean;
}) => {
  return (
    <Link
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={cn(
        `select-none font-medium text-sm lg:text-base ${className}`,
        { "ml-3 text-[13px] lg:text-sm": isChildren },
        { "ml-4 lg:text-sm": isChildrenAddButton },
        { "lg:text-sm": smallText },
      )}
      href={USER_REDIRECT({ lang, href, role })}
    >
      {children}
    </Link>
  );
};

export default DashboardNavigator;
