import Button from "@/components/Button";
import FilterIcon from "@/components/FilterIcon";
import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import Input from "@/components/Input";
import NavigatorX from "@/components/NavigatorX";
import { COUNTRY_CODE, GENDERS, GENDER_OPTIONS, ICONS } from "@/lib/constants";
import { cn, getUserAge, localizePhoneNumber, openModal, textEllipsis } from "@/lib/functions";
import type { UserList, UserListInput } from "@/server/api/routers/user";
import { inputVariants } from "@/styles/variants";
import type { Lang, SearchParams } from "@/types";
import ActionButton from "@dashboard/components/ActionButton";
import type { IconifyIcon } from "@iconify/react/dist/iconify.js";
import type { Gender, Package } from "@prisma/client";
import { Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";

type Props = {
  data?: UserList;
  searchParams: SearchParams;
  loading: boolean;
  newParams: URLSearchParams;
  redirectTable: (newParams: URLSearchParams) => void;
  lang: Lang;
  packages?: Package[];
};

export default function TrainersTable({ data, searchParams, loading, newParams, redirectTable, packages }: Props) {
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
          ) : name === "trainerPackageId" ? (
            <select className={inputVariants()} name={name} defaultValue={searchParams[name]} key={name}>
              <option value="">All</option>
              {packages?.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          ) : (
            <Input
              icon={icon}
              key={name}
              defaultValue={searchParams[name]}
              isPhoneNumber={name === "phoneNumber"}
              name={name}
              type={type}
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
      pagination={false}
      dataSource={data?.data}
      rowKey="id"
      scroll={{ x: "max-content" }}
      columns={[
        {
          fixed: "left",
          align: "center",
          title: "Action",
          key: "id",
          dataIndex: "id",
          width: 1,
          render: (id: string) => {
            return (
              <section className="flex gap-2 justify-center items-center">
                <ActionButton
                  onClick={openModal({ id, newParams, redirect: redirectTable, action: "update" })}
                  icon={ICONS.edit}
                  color="yellow"
                />
              </section>
            );
          },
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
            <NavigatorX newTab href={`tel:${COUNTRY_CODE}${text}`} className="hover:underline text-dark td">
              {localizePhoneNumber(text)}
            </NavigatorX>
          ),
        },
        {
          title: "Email",
          key: "email",
          dataIndex: "email",
          ...getTableFilter({ name: "email", icon: ICONS.email }),
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
          title: "Age",
          key: "birthDate",
          dataIndex: "birthDate",
          render: (birthDate: Date) => getUserAge(birthDate),
          ...getTableFilter({ name: "age", type: "number" }),
        },
        {
          title: "Packages",
          key: "trainerPackages",
          dataIndex: "trainerPackages",
          ...getTableFilter({ name: "trainerPackageId", icon: ICONS.package }),
          render: (packages: Package[]) => (
            <ul>
              {packages?.map((e) => (
                <li key={e.id} className="td">
                  {e.name}
                </li>
              ))}
            </ul>
          ),
        },
      ]}
    />
  );
}
