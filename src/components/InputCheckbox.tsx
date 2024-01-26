import { ICONS } from "@/lib/constants";
import { cn } from "@/lib/functions";
import type { MouseEvent } from "@/types";
import { type ComponentProps, forwardRef, useId } from "react";
import Iconify from "./Iconify";

type InputProps = ComponentProps<"input"> & {
  onClickButton: MouseEvent;
  selectedValue: boolean;
  label: string;
};
const InputCheckbox = forwardRef<HTMLInputElement, InputProps>(({ onClickButton, selectedValue, label, ...rest }, ref) => {
  const id = useId();
  return (
    <section className="flex gap-2 items-center justify-end">
      <button
        onClick={onClickButton}
        type="button"
        className={cn("relative rounded-md size-5 border-1.5 border-dark bg-light", {
          "bg-orange border-orange": selectedValue,
        })}
      >
        <div />
        <Iconify
          icon={ICONS.check}
          width={20}
          className={cn("text-cream absolute centered", {
            "scale-0": !selectedValue,
          })}
        />
        <input id={id} ref={ref} {...rest} className="cursor-pointer absolute centered opacity-0 size-full" type="checkbox" />
      </button>
      <label htmlFor={id}>{label}</label>
    </section>
  );
});

export default InputCheckbox;
