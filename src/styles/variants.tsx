import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: "select-none font-medium text-light active:scale-95 outline-none text-center",
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
  base: "w-full pl-3 rounded-none animate outline-none bg-inherit hover:border-dark/30 placeholder:text-dark/30",
  variants: {
    color: {
      blue: " focus:border-blue2",
      orange: "focus:border-orange",
    },
    size: {
      m: "h-10",
      none: " ",
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
    color: "orange",
    border: "all",
    rounded: "md",
  },
});

export const statusVariants = tv({
  base: "h-7 font-medium flex items-center w-fit text-cream shadow px-2 rounded-md",
  variants: {
    status: {
      active: "bg-emerald",
      expired: "bg-red",
      session: "bg-purple-600",
      today: "bg-yellow-600",
    },
  },
});

export const actionVariants = tv({
  base: "p-1 text-cream rounded-md",
  variants: {
    color: {
      green: "bg-green",
      yellow: "bg-yellow-600",
      purple: "bg-purple-600",
      orange: "bg-orange",
      red: "bg-red",
      blue: "bg-blue",
    },
  },
  defaultVariants: { color: "green" },
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
