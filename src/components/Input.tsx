"use client";

import { COUNTRY_CODE, ICONS } from "@/lib/constants";
import { cn } from "@/lib/functions";
import { inputVariants } from "@/styles/variants";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { forwardRef, useId, useState, type ComponentProps } from "react";
import { type VariantProps } from "tailwind-variants";
import Iconify from "./Iconify";

type InputProps = ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    error?: string;
    label?: string;
    classNameDiv?: string;
    icon?: IconifyIcon | string;
    withPasswordIcon?: boolean;
    isPhoneNumber?: boolean;
  };

export const inputIconSize = 22;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, className, size, color, icon, disabled, classNameDiv, withPasswordIcon, isPhoneNumber, ...rest }, ref) => {
    const id = useId();

    const [showPassword, setShowPassword] = useState(false);

    if (type !== "password") {
      return (
        <section className={cn(`${classNameDiv} gap-0.5 flex flex-col`)}>
          {label ? <label htmlFor={id}>{label}</label> : null}
          <section className="relative">
            <input
              disabled={disabled}
              inputMode={type === "number" || isPhoneNumber ? "numeric" : undefined}
              type={type ? type : "text"}
              className={cn("pr-3", inputVariants({ size, color, className }), {
                "pl-10": icon,
                "pl-[4.4rem]": isPhoneNumber,
                "border-dark/30": disabled,
              })}
              ref={ref}
              id={id}
              maxLength={isPhoneNumber ? 12 : 81}
              {...rest}
            />
            {icon ? <Iconify width={inputIconSize} icon={icon} className="absolute centered-left translate-x-3 text-dark" /> : null}
            {isPhoneNumber ? (
              <section className="flex gap-1 items-center absolute centered-left translate-x-3">
                <Iconify width={inputIconSize} icon={ICONS.phone} className="text-dark" />
                <p className="font-semibold">{COUNTRY_CODE}</p>
              </section>
            ) : null}
          </section>
          {error ? <small className={cn("text-red text-xs mt-0.5")}>{error}</small> : null}
        </section>
      );
    }

    return (
      <section className={cn(`${classNameDiv} gap-0.5 flex flex-col`)}>
        <label htmlFor={id}>Password</label>
        <section className="relative">
          <input
            ref={ref}
            {...rest}
            id={id}
            placeholder="----------"
            type={showPassword ? "text" : "password"}
            className={cn(inputVariants({ size, color, className }), {
              "border-red focus:border-red": error,
              "pl-10 pr-9": withPasswordIcon,
            })}
          />

          {withPasswordIcon ? (
            <Iconify width={inputIconSize} icon={ICONS.password} className="absolute centered-left translate-x-3 text-dark" />
          ) : null}

          <section
            className="absolute centered-right -translate-x-3 text-dark cursor-pointer text-xl"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </section>
        </section>
        {error ? <small className={cn("text-red text-xs mt-0.5")}>{error}</small> : null}
      </section>
    );
  },
);

export default Input;
