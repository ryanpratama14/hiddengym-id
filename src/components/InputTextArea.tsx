import { cn } from "@/lib/utils";
import { inputVariants } from "@/styles/variants";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { forwardRef, useId, type ComponentProps } from "react";
import { type VariantProps } from "tailwind-variants";
import Iconify from "./Iconify";
import { inputIconSize } from "./Input";

type InputProps = ComponentProps<"textarea"> &
  VariantProps<typeof inputVariants> & {
    error?: string;
    label?: string;
    classNameDiv?: string;
    icon?: IconifyIcon | string;
  };

const InputTextArea = forwardRef<HTMLTextAreaElement, InputProps>(
  ({ label, error, className, color, icon, disabled, classNameDiv, ...rest }, ref) => {
    const id = useId();

    return (
      <section className={cn(`${classNameDiv} gap-0.5 flex flex-col`)}>
        {label ? <label htmlFor={id}>{label}</label> : null}
        <section className="relative">
          <textarea
            rows={3}
            disabled={disabled}
            className={cn("pr-3 pt-3", inputVariants({ size: "none", color, className }), {
              "border-red focus:border-red": error,
              "pl-10": icon,
              "border-dark/30": disabled,
            })}
            ref={ref}
            id={id}
            {...rest}
          />
          {icon ? <Iconify width={inputIconSize} icon={icon} className="absolute centered-left translate-x-3 text-dark" /> : null}
        </section>
        {error ? <small className={cn("text-red  text-xs mt-0.5")}>{error}</small> : null}
      </section>
    );
  },
);

export default InputTextArea;
