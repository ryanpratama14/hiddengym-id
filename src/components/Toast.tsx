import Iconify from "@/components/Iconify";
import { ICONS } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { COLORS } from "@/styles/theme";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { notification } from "antd";

type ToastType = "success" | "error" | "warning" | "info";

const toastIcons: Record<ToastType, { icon: IconifyIcon | string; color: string }> = {
  success: {
    icon: ICONS.success,
    color: COLORS.green,
  },
  error: {
    icon: ICONS.error,
    color: COLORS.red,
  },
  info: {
    icon: ICONS.info,
    color: COLORS.blue,
  },
  warning: {
    icon: ICONS.warning,
    color: COLORS.orange,
  },
};

export const toast = ({ type, description, t }: { type: ToastType; description: string; t: Dictionary }) => {
  return notification[type]({
    description,
    message: t.toast[type],
    duration: 3,
    icon: <Iconify icon={toastIcons[type].icon} width={25} color={toastIcons[type].color} />,
  });
};
