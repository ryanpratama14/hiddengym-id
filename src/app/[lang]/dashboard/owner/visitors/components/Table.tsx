"use client";

import Button from "@/components/Button";
import FilterIcon from "@/components/FilterIcon";
import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import Input from "@/components/Input";
import NavigatorX from "@/components/NavigatorX";
import { COUNTRY_CODE, GENDERS, GENDER_OPTIONS, ICONS } from "@/lib/constants";
import { cn, formatCurrency, localizePhoneNumber, textEllipsis } from "@/lib/functions";
import { PAGINATION_LIMIT } from "@/trpc/shared";
import type { Lang, SearchParams } from "@/types";
import ActionButton from "@dashboard/components/ActionButton";
import type { IconifyIcon } from "@iconify/react/dist/iconify.js";
import type { Gender } from "@prisma/client";
import type { UserList, UserListInput } from "@router/user";
import { Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";

type Props = {
  data?: UserList;
  searchParams: SearchParams;
  loading: boolean;
  newParams: URLSearchParams;
  redirectTable: (newParams: URLSearchParams) => void;
  lang: Lang;
};

export default function VisitorsTable({ data, searchParams, lang, loading, newParams, redirectTable }: Props) {
  const getTableFilter = ({
    name,
    icon,
    type,
  }: {
    name: keyof UserListInput;
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
          {name === "gender" ? (
            <section className="grid grid-cols-2">
              {GENDER_OPTIONS.map((option, index) => {
                return (
                  <section key={option.label} className="items-center flex gap-2">
                    <button
                      type="button"
                      className="relative rounded-full w-6 bg-white aspect-square border-1 border-dark has-[:checked]:bg-dark"
                    >
                      <div className="has-[:checked]:scale-0 animate absolute centered w-[40%] aspect-square rounded-full bg-white" />
                      <input
                        className="cursor-pointer absolute w-full h-full opacity-0 z-10 top-0 left-0 "
                        id={`gender_option_${index}`}
                        type="radio"
                        name={name}
                        key={name}
                        value={option.value}
                        defaultChecked={searchParams.gender === option.value}
                      />
                    </button>
                    <label className="flex items-center" htmlFor={`gender_option_${index}`}>
                      <Iconify color={option.color} width={25} icon={option.icon} />
                    </label>
                  </section>
                );
              })}
            </section>
          ) : (
            <Input
              icon={icon}
              key={name}
              defaultValue={searchParams[name]}
              isPhoneNumber={name === "phoneNumber"}
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
                const form = e.currentTarget.form;
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
    <Table
      loading={loading}
      className="drop-shadow"
      pagination={{
        current: data?.page,
        pageSize: data?.limit,
        total: data?.totalData,
        showSizeChanger: true,
        pageSizeOptions: [String(PAGINATION_LIMIT), "75", "100"],
        onChange: (_, limit) => {
          if (limit === PAGINATION_LIMIT) {
            newParams.delete("limit");
          } else newParams.set("limit", String(limit));
          redirectTable(newParams);
        },
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} visitors`,
      }}
      onChange={(pagination) => {
        if (pagination.current === 1) {
          newParams.delete("page");
        } else newParams.set("page", String(pagination.current));
        redirectTable(newParams);
      }}
      rowKey="id"
      dataSource={data?.data}
      scroll={{ x: "max-content" }}
      columns={[
        {
          fixed: "left",
          align: "center",
          title: "Action",
          key: "id",
          width: 1,
          dataIndex: "id",
          render: (id: string) => (
            <section className="flex justify-center items-center">
              <ActionButton href="/visitors/detail" params={`/${id}`} lang={lang} role="OWNER" icon={ICONS.detail} color="blue" />
            </section>
          ),
        },
        {
          title: "Full Name",
          key: "fullName",
          dataIndex: "fullName",
          render: (text: string, user) => (
            <section className="flex gap-2 items-center">
              <section className="size-7 bg-cream rounded-full relative shadow border-1 border-dotted border-dark flex items-center justify-center">
                {user?.image?.url ? (
                  <Img src={user.image.url} alt={text} className="object-cover w-full h-full rounded-full" />
                ) : (
                  <Iconify icon={GENDERS[user.gender].picture} className="text-dark" width={20} />
                )}
              </section>
              {textEllipsis(text, 27)}
            </section>
          ),
        },
        {
          title: "Phone Number",
          key: "phoneNumber",
          dataIndex: "phoneNumber",
          ...getTableFilter({ name: "phoneNumber" }),
          render: (text: string) => (
            <NavigatorX newTab href={`tel:${COUNTRY_CODE}${text}`} className="hover:underline text-dark xl:text-base text-sm">
              {localizePhoneNumber(text)}
            </NavigatorX>
          ),
        },
        {
          title: "Email",
          key: "email",
          dataIndex: "email",
          ...getTableFilter({ name: "email", icon: "ic:outline-email" }),
          render: (text: string) => text ?? "-",
        },
        {
          title: "Gender",
          key: "gender",
          width: 1,
          align: "center",
          dataIndex: "gender",
          ...getTableFilter({ name: "gender" }),
          render: (gender: Gender) => {
            return (
              <section className="flex items-center justify-center">
                <Iconify width={25} icon={GENDERS[gender].icon} color={GENDERS[gender].color} />
              </section>
            );
          },
        },
        {
          align: "right",
          title: "Total Spending",
          key: "totalSpending",
          dataIndex: "totalSpending",
          ...getTableFilter({ name: "totalSpending", icon: ICONS.payment_method, type: "number" }),
          render: (text: number) => formatCurrency(text),
        },
      ]}
    />
  );
}
