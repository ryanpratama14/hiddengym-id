import { actionVariants } from "@/styles/variants";
import { type MouseEvent } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { Tooltip } from "antd";
import { type VariantProps } from "tailwind-variants";
import Iconify from "./Iconify";

type Props = VariantProps<typeof actionVariants> & {
  icon: IconifyIcon | string;
  title: string;
  onClick?: MouseEvent;
};

export default function ActionButton({ color, icon, title, onClick }: Props) {
  return (
    <Tooltip title={title} style={{ zIndex: 50 }}>
      <button type="button" onClick={onClick}>
        <Iconify icon={icon} width={25} className={actionVariants({ color })} />
      </button>
    </Tooltip>
  );
}
