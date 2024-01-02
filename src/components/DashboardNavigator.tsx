import { cn } from "@/lib/functions";

const DashboardNavigator = ({
  className,
  isChildren,
  children,
}: {
  isChildren?: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn(`text-base select-none font-medium h-full flex items-center ${className}`, { "ml-3 text-sm": isChildren })}>
      {children}
    </p>
  );
};

export default DashboardNavigator;
