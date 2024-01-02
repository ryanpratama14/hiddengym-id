import "@/styles/ant-select.css";
import { cn } from "@/lib/functions";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { Select } from "antd";
import { type DefaultOptionType } from "antd/es/cascader";
import { type BaseOptionType, type SelectProps } from "antd/es/select";
import { type BaseSelectRef } from "rc-select";
import { forwardRef, useId } from "react";
import Iconify from "./Iconify";
import { inputIconSize } from "./Input";

type ValueType = unknown;
type OptionType = BaseOptionType | DefaultOptionType;

const InputSelect = forwardRef<
  BaseSelectRef,
  SelectProps<ValueType, OptionType> & {
    children?: React.ReactNode;
    icon?: IconifyIcon | string;
    label?: string;
    error?: string;
    multiple?: boolean;
    showSearch?: boolean;
    className?: string;
  }
>(function InputSelect(props, ref) {
  const id = useId();

  return (
    <section className="flex flex-col gap-0.5">
      {props.label ? <label htmlFor={id}>{props.label}</label> : null}
      <section className="relative">
        <Select
          {...props}
          id={id}
          ref={ref}
          optionFilterProp="children"
          filterOption={(input, option) => ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())}
          style={{ width: "100%", height: "100%" }}
          showSearch={props.showSearch}
        />
        {props.icon ? (
          <Iconify width={inputIconSize} icon={props.icon} className="absolute centered-left translate-x-3 text-dark" />
        ) : null}
      </section>
      {props.error ? <small className={cn("text-red text-xs mt-0.5")}>{props.error}</small> : null}
    </section>
  );
});

export default InputSelect;
