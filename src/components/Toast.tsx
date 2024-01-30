import { ICONS } from "@/lib/constants";
import { COLORS } from "@/styles/theme";
import type { Dictionary } from "@/types";
import type { IconifyIcon } from "@iconify/react/dist/iconify.js";
import { toast as sonner } from "sonner";
import Iconify from "./Iconify";

type ToastType = "success" | "error" | "warning" | "info";

const toastStyles: Record<ToastType, { icon: IconifyIcon | string; color: string }> = {
  success: { icon: ICONS.success, color: COLORS.green },
  error: { icon: ICONS.error, color: COLORS.red },
  info: { icon: ICONS.info, color: COLORS.blue },
  warning: { icon: ICONS.warning, color: COLORS.orange },
};

export const toast = ({ type, description, t }: { type: ToastType; description: string; t: Dictionary }) => {
  return sonner[type](
    <section className="flex flex-col gap-1 py-4 px-6 rounded-md shadow-xl text-dark bg-light">
      <section className="flex items-center gap-2">
        <Iconify icon={toastStyles[type].icon} width={18} color={toastStyles[type].color} />
        <p className="font-semibold !text-base">{t.toast[type]}</p>
      </section>
      <small className="whitespace-pre-line">{description}</small>
    </section>,
  );
};

export const toastError = ({ t, description }: { t: Dictionary; description: string }) => toast({ t, description, type: "error" });
export const toastSuccess = ({ t, description }: { t: Dictionary; description: string }) => toast({ t, description, type: "success" });
export const toastWarning = ({ t, description }: { t: Dictionary; description: string }) => toast({ t, description, type: "warning" });
export const toastInfo = ({ t, description }: { t: Dictionary; description: string }) => toast({ t, description, type: "info" });
