import { cn } from "@/lib/utils";
import { type ComponentProps } from "react";

interface LogoProps extends Omit<ComponentProps<"section">, "className">, Required<Pick<ComponentProps<"section">, "className">> {}

export default function LogoBlackWhite({ className, ...rest }: LogoProps) {
  return (
    <section {...rest} className={cn(className, "flex gap-2 items-center justify-center")}>
      <section className="flex items-center justify-center w-[20%] h-full">
        <div className="-skew-x-25 h-[15%] w-[50%] bg-dark translate-x-0.5" />
        <div className="-skew-x-25 h-[50%] w-[50%] bg-dark" />
      </section>

      <div className="-skew-x-25 h-[75%] w-[10%] bg-dark" />
      <div className="-skew-x-25 h-full w-[10%] bg-dark" />

      <div className="-skew-x-25 h-[15%] w-[20%] bg-dark" />

      <div className="-skew-x-25 h-full w-[10%] bg-dark" />
      <div className="-skew-x-25 h-[75%] w-[10%] bg-dark" />

      <section className="flex items-center justify-center w-[20%] h-full">
        <div className="-skew-x-25 h-[50%] w-[50%] bg-dark" />
        <div className="-skew-x-25 h-[15%] w-[50%] bg-dark -translate-x-0.5" />
      </section>
    </section>
  );
}
