import ActionButton from "@/app/[lang]/dashboard/components/ActionButton";
import Button from "@/components/Button";
import FilterIcon from "@/components/FilterIcon";
import Input from "@/components/Input";
import { ICONS, PACKAGE_TYPES } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/functions";
import { type PackageList, type PackageListInput } from "@/server/api/routers/package";
import { inputVariants, statusVariants } from "@/styles/variants";
import { type Lang, type SearchParams } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { type PackageTransaction, type PackageType } from "@prisma/client";
import { Table } from "antd";
import { type FilterDropdownProps } from "antd/es/table/interface";
import { Fragment } from "react";

type Props = {
  data?: PackageList;
  lang: Lang;
  loading: boolean;
  searchParams: SearchParams;
  newParams: URLSearchParams;
  redirectTable: (newParams: URLSearchParams) => void;
};

export default function PackagesTable({ data, loading, searchParams, newParams, redirectTable }: Props) {
  const getTableFilter = ({
    name,
    icon,
    type,
  }: {
    name: keyof PackageListInput;
    icon?: IconifyIcon | string;
    type?: React.HTMLInputTypeAttribute;
  }) => ({
    filterDropdown: ({ confirm }: FilterDropdownProps) => {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const val = e.target as HTMLFormElement;
            const value = val[name] as HTMLInputElement;
            if (value.value) {
              newParams.set(name, value.value);
            } else newParams.delete(name);
            confirm();
            redirectTable(newParams);
          }}
          className="flex flex-col gap-2 w-52 bg-light p-2 rounded-md shadow"
        >
          {name === "type" ? (
            <select className={inputVariants()} name={name} defaultValue={searchParams[name]} key={name}>
              <option value="">All</option>
              {PACKAGE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              icon={icon}
              key={name}
              defaultValue={searchParams[name]}
              name={name}
              type={type ? type : "text"}
              className={cn("text-base")}
            />
          )}
          <section className="grid grid-cols-2 gap-2">
            <Button color="success" type="submit">
              Search
            </Button>
            <Button
              color="expired"
              onClick={(e) => {
                const form = e.currentTarget.form!;
                if (form) {
                  form.reset();
                  if (!searchParams[name]) return;
                }
                newParams.delete(name);
                newParams.delete("page");
                confirm();
                redirectTable(newParams);
              }}
            >
              Reset
            </Button>
          </section>
        </form>
      );
    },
    filterIcon: () => <FilterIcon name={name} searchParams={searchParams} />,
  });

  return (
    <Fragment>
      <Table
        dataSource={data}
        loading={loading}
        pagination={false}
        rowKey="id"
        scroll={{ x: "max-content" }}
        columns={[
          {
            fixed: "left",
            align: "center",
            key: "id",
            dataIndex: "id",
            title: "Action",
            width: 1,
            render: (id: string) => (
              <section className="flex justify-center items-center">
                <ActionButton
                  onClick={() => {
                    newParams.set("id", id);
                    redirectTable(newParams);
                  }}
                  icon={ICONS.edit}
                  color="yellow"
                />
              </section>
            ),
          },
          {
            title: "Type",
            key: "type",
            dataIndex: "type",
            align: "center",
            width: 1,
            ...getTableFilter({ name: "type", icon: ICONS.package }),
            render: (text: PackageType) => <p className="font-semibold border-1 border-dark px-2 select-none">{text}</p>,
          },
          {
            title: "Name",
            key: "name",
            dataIndex: "name",
            ...getTableFilter({ name: "name", icon: ICONS.name }),
          },
          {
            title: "Price",
            key: "price",
            align: "right",
            dataIndex: "price",
            ...getTableFilter({ name: "price", icon: ICONS.payment_method, type: "number" }),
            render: (text: number) => formatCurrency(text),
          },
          {
            title: "Validity",
            key: "validityInDays",
            dataIndex: "validityInDays",
            render: (text: number, item) => {
              if (item.type === "SESSIONS") {
                return (
                  <section className="flex gap-2">
                    <p className={statusVariants({ status: "session" })}>{item.approvedSessions} session(s)</p>
                    {text ? <p className={statusVariants({ status: "active" })}>{text} day(s)</p> : null}
                  </section>
                );
              }
              return <p className={statusVariants({ status: "active" })}>{text} day(s)</p>;
            },
          },
          {
            title: "Total Transactions",
            key: "transactions",
            dataIndex: "transactions",
            ...getTableFilter({ name: "totalTransactions", type: "number" }),
            render: (text: PackageTransaction[]) => text.length,
          },
        ]}
      />
    </Fragment>
  );
}
