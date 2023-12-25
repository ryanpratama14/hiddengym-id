import { cn } from "@/lib/utils";
import { buttonVariants } from "@/styles/variants";
import Link from "next/link";
import { type VariantProps } from "tailwind-variants";

const NavigatorX = ({
  href,
  children,
  className,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: React.HTMLAttributeAnchorTarget;
} & VariantProps<typeof buttonVariants>) => {
  return (
    <Link target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ ...rest, className }))} href={href}>
      {children}
    </Link>
  );
};

export default NavigatorX;
