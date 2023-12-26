"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import Input from "@/components/Input";
import Navigator from "@/components/Navigator";
import NavigatorX from "@/components/NavigatorX";
import { type Locale } from "@/i18n.config";
import { GENDERS, ICONS, USER_REDIRECT } from "@/lib/constants";
import { cn, createUrl, formatCurrency, lozalizePhoneNumber, textEllipsis } from "@/lib/utils";
import { type UserList, type UserListInputParams } from "@/server/api/routers/user";
import { type SearchParams } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { type Role } from "@prisma/client";
import { Table } from "antd";
import { type FilterDropdownProps } from "antd/es/table/interface";
import { redirect, useRouter, useSearchParams } from "next/navigation";

type Props = {
  data?: UserList;
  searchParams: SearchParams;
  lang: Locale;
  loading: boolean;
};

export default function VisitorsTable({ data, searchParams, lang, loading }: Props) {
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());

  if (data?.isInvalidPage) {
    newParams.delete("page");
    redirect(createUrl(USER_REDIRECT.OWNER({ lang, href: "/visitors" }), newParams));
  }

  const router = useRouter();

  const redirectTable = ({ role, href, newParams }: { role: Role; href: string; newParams: URLSearchParams }) => {
    router.push(createUrl(USER_REDIRECT[role]({ lang, href }), newParams));
  };

  const getTableFilter = ({ name, icon }: { name: keyof UserListInputParams; icon?: IconifyIcon | string }) => ({
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
            redirectTable({ href: "/visitors", newParams, role: "OWNER" });
          }}
          className="flex flex-col gap-2 w-52 bg-light p-2 rounded-md shadow"
        >
          {name === "gender" ? (
            <section className="grid grid-cols-2">
              {GENDERS.map((option, index) => {
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
              className={cn("text-base h-8")}
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
                redirectTable({ href: "/visitors", newParams, role: "OWNER" });
              }}
            >
              Reset
            </Button>
          </section>
        </form>
      );
    },
    filterIcon: () => (
      <section
        className={cn("aspect-square w-7 text-cream hover:text-dark hover:bg-cream relative rounded-full hover:shadow-lg animate", {
          "bg-cream text-dark": Object.keys(searchParams).includes(name),
        })}
      >
        <Iconify icon={ICONS.search} width={22} className="absolute centered" />
      </section>
    ),
  });

  return (
    <Table
      loading={loading}
      className="drop-shadow"
      pagination={{
        current: data?.page,
        pageSize: data?.limit,
        total: data?.totalData,
      }}
      onChange={(pagination) => {
        if (pagination.current === 1) {
          newParams.delete("page");
        } else newParams.set("page", String(pagination.current));
        redirectTable({ href: "/visitors", newParams, role: "OWNER" });
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
            <Navigator color="link" href={USER_REDIRECT.OWNER({ lang, href: `/visitors/detail/${id}` })}>
              View
            </Navigator>
          ),
        },
        {
          title: "Full Name",
          key: "fullName",
          dataIndex: "fullName",
          render: (text: string, user) => (
            <section className="flex gap-2 items-center">
              <section className="w-8 aspect-square bg-cream rounded-full relative shadow border-1 border-dotted border-dark">
                {user?.image?.url ? (
                  <Img src={user.image.url} alt={text} className="absolute centered object-cover w-full h-full rounded-full" />
                ) : (
                  <Iconify
                    icon={user.gender === "MALE" ? ICONS.male : ICONS.female}
                    className="absolute centered text-dark"
                    width={22}
                  />
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
            <NavigatorX newTab href={`tel:${text}`} className="hover:underline text-dark">
              {lozalizePhoneNumber(text)}
            </NavigatorX>
          ),
        },
        {
          title: "Email",
          key: "email",
          dataIndex: "email",
          ...getTableFilter({ name: "email", icon: "ic:outline-email" }),
          render: (text: string) => (text ? text : "-"),
        },
        {
          title: "Gender",
          key: "gender",
          width: 1,
          align: "center",
          dataIndex: "gender",
          ...getTableFilter({ name: "gender" }),
          render: (text: string) => {
            const gender = GENDERS.find((item) => item.value === text);
            return (
              <section className="flex items-center justify-center">
                <Iconify width={25} icon={gender!.icon} color={gender!.color} />
              </section>
            );
          },
        },
        {
          align: "right",
          title: "Total Spending",
          key: "totalSpending",
          dataIndex: "totalSpending",
          ...getTableFilter({ name: "totalSpending" }),
          render: () => formatCurrency(12312333),
        },
      ]}
    />
  );
}
