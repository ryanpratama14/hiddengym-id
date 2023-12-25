import { type Dictionary } from "@/lib/dictionary";
import { COLORS } from "@/styles/theme";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { notification } from "antd";
import Iconify from "./Iconify";

type ToastType = "success" | "error" | "warning" | "info";

const toastIcons: Record<ToastType, { icon: IconifyIcon | string; color: string }> = {
  success: {
    icon: "icon-park-solid:folder-success",
    color: COLORS.green,
  },
  error: {
    icon: "icon-park-solid:folder-failed",
    color: COLORS.red,
  },
  info: {
    icon: "icon-park-solid:info",
    color: COLORS.blue,
  },
  warning: {
    icon: "material-symbols:warning",
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
