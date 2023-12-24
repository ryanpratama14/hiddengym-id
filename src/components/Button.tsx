import { cn } from "@/lib/utils";
import { buttonVariants } from "@/styles/variants";
import { type ComponentProps, forwardRef } from "react";
import { type VariantProps } from "tailwind-variants";
import Iconify from "./Iconify";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { COLORS } from "@/styles/theme";
import { PulseLoader } from "react-spinners";

function ButtonLoader() {
  return <PulseLoader color={COLORS.cream} size={6} />;
}

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    icon?: IconifyIcon | string;
    classNameDiv?: string;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type, color, size, className, loading = false, children, classNameDiv, rounded, icon, ...rest }, ref) => {
    return (
      <button
        disabled={loading}
        type={type ? type : "button"}
        ref={ref}
        {...rest}
        className={cn(buttonVariants({ color, size, rounded, className }))}
      >
        {loading ? (
          <ButtonLoader />
        ) : (
          <section className={cn(classNameDiv, { "flex justify-center gap-2 items-center": icon })}>
            {icon && !loading ? <Iconify icon={icon} width={22} /> : ""}
            <section>{children}</section>
          </section>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
