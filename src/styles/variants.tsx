import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: "select-none font-semibold text-light active:scale-95 outline-none text-center",
  variants: {
    rounded: {
      md: "rounded-md",
      none: " ",
    },
    color: {
      primary: "bg-orange hover:bg-orange2",
      success: "bg-green hover:bg-green2",
      danger: "bg-red hover:bg-red2",
      link: "bg-blue hover:bg-blue2",
      active: "bg-emerald hover:bg-emerald2",
      expired: "bg-dark",
      disabled: "bg-dark2",
      ghost: "hover:bg-dark/20 font-normal",
      none: " ",
    },
    size: {
      xxl: "px-4 h-10 text-xl",
      xl: "px-3 h-9 text-lg",
      l: "px-3 h-7 text-lg",
      m: "px-3 h-6",
      s: "px-2 h-6 text-sm",
      none: " ",
    },
  },
  defaultVariants: {
    size: "m",
    color: "primary",
    rounded: "md",
  },
});

export const inputVariants = tv({
  base: "w-full rounded-none animate outline-none bg-inherit hover:border-dark/30 placeholder:text-dark/30",
  variants: {
    color: {
      blue: " focus:border-blue2",
      orange: "focus:border-orange",
    },
    size: {
      m: "h-10",
    },
    border: {
      bottom: "border-b-1.5 border-dark",
      all: "border-1.5 border-dark",
    },
    rounded: {
      none: "!rounded-none",
      md: "rounded-md",
    },
  },
  defaultVariants: {
    size: "m",
    color: "blue",
    border: "bottom",
    rounded: "none",
  },
});

export const notificationVariants = tv({
  base: "text-dark font-poppins bg-cream",
  variants: {
    type: {
      info: "",
      warning: "",
      error: "",
      success: "",
    },
  },
  defaultVariants: {
    type: "info",
  },
});
