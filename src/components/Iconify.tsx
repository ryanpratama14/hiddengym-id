"use client";

import { cn } from "@/lib/functions";
import { Icon, type IconifyIcon } from "@iconify/react";

type Props = {
  icon: IconifyIcon | string;
  width?: number;
  className?: string;
  rotate?: number;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  color?: string;
  style?: React.CSSProperties;
};

export default function Iconify({ icon, width, className, rotate, style, onClick, color }: Props) {
  return (
    <Icon
      onClick={onClick}
      icon={icon}
      width={width}
      rotate={rotate}
      style={style}
      color={color}
      className={cn(`animate ${className}`, { "cursor-pointer": onClick })}
    />
  );
}
