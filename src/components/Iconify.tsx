"use client";

import { cn } from "@/lib/utils";
import { Icon, type IconifyIcon } from "@iconify/react";

type Props = {
  icon: IconifyIcon | string;
  width?: number;
  className?: string;
  rotate?: number;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  collapsed?: boolean;
  color?: string;
};

export default function Iconify({ icon, width, className, rotate, onClick, collapsed, color }: Props) {
  return (
    <Icon
      onClick={onClick}
      icon={icon}
      width={width}
      rotate={rotate}
      color={color}
      className={cn("animate", className, {
        "cursor-pointer": onClick,
        "absolute centered": collapsed,
      })}
    />
  );
}
