import Iconify from "@/components/Iconify";
import { actionVariants } from "@/styles/variants";
import { type MouseEvent } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
// import { Tooltip } from "antd";
import { type VariantProps } from "tailwind-variants";

type Props = VariantProps<typeof actionVariants> & {
  icon: IconifyIcon | string;
  onClick?: MouseEvent;
};

export default function ActionButton({ color, icon, onClick }: Props) {
  return (
    <button type="button" onClick={onClick}>
      <Iconify icon={icon} width={25} className={actionVariants({ color })} />
    </button>
  );
}
