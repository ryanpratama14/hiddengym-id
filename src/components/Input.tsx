import { cn } from "@/lib/utils";
import { inputVariants } from "@/styles/variants";
import { forwardRef, type ComponentProps, useId, useState } from "react";
import { type VariantProps } from "tailwind-variants";
import Iconify from "./Iconify";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { COUNTRY_CODE, ICONS } from "@/lib/constants";

type InputProps = ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    error?: string;
    label?: string;
    classNameDiv?: string;
    icon?: IconifyIcon | string;
    withPasswordIcon?: boolean;
    isPhoneNumber?: boolean;
  };

const iconSize = 22;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, className, size, color, icon, classNameDiv, withPasswordIcon, isPhoneNumber, ...rest }, ref) => {
    const id = useId();

    const [showPassword, setShowPassword] = useState(false);

    if (type !== "password") {
      return (
        <section className={cn(`${classNameDiv} flex flex-col`)}>
          {label ? <label htmlFor={id}>{label}</label> : null}
          <section className="relative">
            <input
              inputMode={isPhoneNumber ? "numeric" : undefined}
              type={type ? type : "text"}
              className={cn(inputVariants({ size, color, className }), {
                "border-red border-dashed": error,
                "pl-7": icon,
                "pl-16": isPhoneNumber,
              })}
              ref={ref}
              id={id}
              maxLength={isPhoneNumber ? 12 : 56}
              {...rest}
            />
            {icon ? <Iconify width={iconSize} icon={icon} className="absolute centered-left text-dark" /> : null}
            {isPhoneNumber ? (
              <section className="flex gap-2 items-centered absolute centered-left">
                <Iconify width={iconSize} icon={ICONS.phone} className="text-dark" />
                <p className="absolute centered-left font-semibold translate-x-6">{COUNTRY_CODE}</p>
              </section>
            ) : null}
          </section>
          {error ? <small className={cn("text-red  text-xs mt-0.5")}>{error}</small> : null}
        </section>
      );
    }

    return (
      <section className={cn(`${classNameDiv} flex flex-col`)}>
        <label htmlFor={id}>Password</label>
        <section className="relative">
          <input
            ref={ref}
            {...rest}
            id={id}
            placeholder="----------"
            type={showPassword ? "text" : "password"}
            className={cn(inputVariants({ size, color, className }), {
              "border-red border-dashed": error,
              "pl-7 pr-9": withPasswordIcon,
            })}
          />

          {withPasswordIcon ? (
            <Iconify width={iconSize} icon={ICONS.password} className="absolute centered-left text-dark" />
          ) : null}

          <Iconify
            width={iconSize}
            icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute centered-right -translate-x-2 text-dark"
          />
        </section>
        {error ? <small className={cn("text-red  text-xs mt-0.5")}>{error}</small> : null}
      </section>
    );
  }
);

export default Input;
