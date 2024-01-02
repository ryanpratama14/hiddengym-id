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
    <button type="button" className={cn(`text-base select-none font-medium ${className}`, { "ml-3 text-sm": isChildren })}>
      {children}
    </button>
  );
};

export default DashboardNavigator;
