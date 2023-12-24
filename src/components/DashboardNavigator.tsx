import { USER_PATHNAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { type Role } from "@prisma/client";
import Link from "next/link";

const DashboardNavigator = ({
  href,
  newTab,
  className,
  role,
  isChildren,
  children,
}: {
  href: string;
  isChildren?: boolean;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
  role: Role;
}) => {
  return (
    <Link
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={cn(`text-base select-none font-medium ${className}`, { "ml-3 text-sm": isChildren })}
      href={`${USER_PATHNAMES[role]}${href}`}
    >
      {children}
    </Link>
  );
};

export default DashboardNavigator;
