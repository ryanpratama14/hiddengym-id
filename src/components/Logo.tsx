import { cn } from "@/lib/utils";
import { type ComponentProps, type FC } from "react";

interface LogoProps
  extends Omit<ComponentProps<"section">, "className">,
    Required<Pick<ComponentProps<"section">, "className">> {}

const Logo: FC<LogoProps> = ({ className, ...rest }) => {
  return (
    <section {...rest} className={cn(className, "flex gap-2 items-center justify-center")}>
      <section className="flex items-center justify-center w-[20%] h-full">
        <div className="-skew-x-25 h-[15%] w-[50%] bg-orange translate-x-0.5" />
        <div className="-skew-x-25 h-[50%] w-[50%] bg-orange" />
      </section>

      <div className="-skew-x-25 h-[75%] w-[10%] bg-orange" />
      <div className="-skew-x-25 h-full w-[10%] bg-orange" />

      <div className="-skew-x-25 h-[15%] w-[20%] bg-orange" />

      <div className="-skew-x-25 h-full w-[10%] bg-green" />
      <div className="-skew-x-25 h-[75%] w-[10%] bg-green" />

      <section className="flex items-center justify-center w-[20%] h-full">
        <div className="-skew-x-25 h-[50%] w-[50%] bg-green" />
        <div className="-skew-x-25 h-[15%] w-[50%] bg-green -translate-x-0.5" />
      </section>
    </section>
  );
};

export default Logo;
