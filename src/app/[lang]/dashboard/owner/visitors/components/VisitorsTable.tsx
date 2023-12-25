"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import Input from "@/components/Input";
import Navigator from "@/components/Navigator";
import { type Locale } from "@/i18n.config";
import { GENDERS, ICONS, USER_REDIRECT } from "@/lib/constants";
import { cn, createUrl, formatCurrency, lozalizePhoneNumber, textEllipsis } from "@/lib/utils";
import { type UserList, type UserListInputParams } from "@/server/api/routers/user";
import { type SearchParams } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { type Gender, type Role } from "@prisma/client";
import { Table } from "antd";
import { type FilterDropdownProps } from "antd/es/table/interface";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  data?: UserList;
  searchParams: SearchParams;
  lang: Locale;
};

export default function VisitorsTable({ data, searchParams, lang }: Props) {
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());

  if (data?.isInvalidPage) {
    newParams.delete("page");
    redirect(createUrl(USER_REDIRECT.OWNER({ lang, href: "/visitors" }), newParams));
  }

  const router = useRouter();
  const [gender, setGender] = useState<Gender | undefined>(undefined);

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
            if (gender) newParams.set("gender", gender);
            confirm();
            redirectTable({ href: "/visitors", newParams, role: "OWNER" });
          }}
          className="flex flex-col gap-2 w-52 bg-light p-2 rounded-md shadow"
        >
          {name === "gender" ? (
            <section className="grid grid-cols-2">
              {GENDERS.map((option, index) => {
                const defaultValue = gender ?? searchParams.gender;
                const checked = defaultValue === option.value;
                return (
                  <section onClick={() => setGender(option.value)} key={option.label} className="items-center flex gap-2">
                    <button
                      type="button"
                      className={cn("relative rounded-full w-6 bg-white aspect-square border-1 border-dark", {
                        "bg-dark": checked,
                      })}
                    >
                      <input
                        value={defaultValue}
                        className="cursor-pointer absolute w-full h-full opacity-0 z-10 top-0 left-0"
                        id={`gender_option_${index}`}
                        type="radio"
                        name={name}
                        key={name}
                      />
                      <div
                        className={`animate absolute centered w-[40%] aspect-square rounded-full bg-white ${
                          !checked && "scale-0"
                        }`}
                      />
                    </button>
                    <label className="flex items-center" htmlFor={`gender_option_${index}`}>
                      <Iconify
                        className={cn("text-pink-500", {
                          "text-blue": option.value === "MALE",
                        })}
                        width={25}
                        icon={option.icon}
                      />
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
                if (gender) setGender(undefined);
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
        className={cn(
          "aspect-square w-7 text-cream hover:text-dark hover:bg-cream relative rounded-full hover:shadow-lg animate",
          {
            "bg-cream text-dark": Object.keys(searchParams).includes(name),
          },
        )}
      >
        <Iconify icon={ICONS.search} width={22} className="absolute centered" />
      </section>
    ),
  });

  return (
    <Table
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
            <Navigator color="link" href={USER_REDIRECT.OWNER({ lang, href: `/visitors/${id}` })}>
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
            <Link target="_blank" href={`tel:${text}`} className="hover:underline text-dark">
              {lozalizePhoneNumber(text)}
            </Link>
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
