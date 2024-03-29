import Button from "@/components/Button";
import FilterIcon from "@/components/FilterIcon";
import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import Input from "@/components/Input";
import { GENDERS, ICONS, PACKAGE_TYPES } from "@/lib/constants";
import {
  formatCurrency,
  formatDateShort,
  getRemainingDays,
  isDateExpired,
  isDateFuture,
  isDateToday,
  openModal,
  textEllipsis,
} from "@/lib/functions";
import { inputVariants, statusVariants } from "@/styles/variants";
import { PAGINATION_LIMIT } from "@/trpc/shared";
import type { SearchParams } from "@/types";
import ActionButton from "@dashboard/components/ActionButton";
import type { IconifyIcon } from "@iconify/react/dist/iconify.js";
import type { PackageTransactionList, PackageTransactionListInput } from "@router/packageTransaction";
import { Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";

type Props = {
  data?: PackageTransactionList;
  searchParams: SearchParams;
  loading: boolean;
  newParams: URLSearchParams;
  redirect: (newParams: URLSearchParams) => void;
};

export default function PackageTransactionsTable({ data, searchParams, loading, newParams, redirect }: Props) {
  const getTableFilter = ({
    name,
    icon,
    type,
  }: {
    name: keyof PackageTransactionListInput;
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
            redirect(newParams);
          }}
          className="flex flex-col gap-2 w-52 bg-light p-2 rounded-md shadow"
        >
          {name === "packageType" ? (
            <select className={inputVariants()} name={name} defaultValue={searchParams[name]} key={name}>
              <option value="">All</option>
              {PACKAGE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          ) : (
            <Input icon={icon} key={name} defaultValue={searchParams[name]} name={name} type={type} />
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
                redirect(newParams);
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
          redirect(newParams);
        },
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} package transactions`,
      }}
      onChange={(pagination) => {
        if (pagination.current === 1) {
          newParams.delete("page");
        } else newParams.set("page", String(pagination.current));
        redirect(newParams);
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
          render: (id: string) => {
            return (
              <section className="flex gap-2 justify-center items-center">
                <ActionButton onClick={openModal({ newParams, id, action: "detail", redirect })} icon={ICONS.invoice} color="blue" />
                <ActionButton onClick={openModal({ newParams, id, action: "update", redirect })} icon={ICONS.edit} color="yellow" />
                <ActionButton onClick={openModal({ newParams, id, action: "delete", redirect })} icon={ICONS.delete} color="red" />
              </section>
            );
          },
        },
        {
          title: "Type",
          key: "package.type",
          align: "center",
          render: (_, item) => (
            <p className="font-semibold border-1 border-dark px-2 select-none text-sm xl:text-base">{item.package.type}</p>
          ),
          ...getTableFilter({ name: "packageType" }),
        },
        {
          title: "Package",
          key: "package.name",
          render: (_, item) => item.package.name,
          ...getTableFilter({ name: "package", icon: ICONS.package }),
        },
        {
          title: "Total Price",
          key: "totalPrice",
          align: "right",
          dataIndex: "totalPrice",
          render: (text: number) => formatCurrency(text),
          ...getTableFilter({ name: "totalPrice", type: "number" }),
        },
        {
          title: "Paid By",
          key: "paymentMethod.name",
          render: (_, item) => item.paymentMethod.name,
          ...getTableFilter({ name: "paymentMethod", icon: ICONS.payment_method }),
        },
        {
          title: "Buyer",
          key: "buyer.fullName",
          render: (_, item) => (
            <section className="flex gap-2 items-center">
              <section className="size-7 bg-cream rounded-full relative shadow border-1 border-dotted border-dark flex items-center justify-center">
                {item.buyer?.image?.url ? (
                  <Img src={item.buyer.image.url} alt={item.buyer.fullName} className="object-cover w-full h-full rounded-full" />
                ) : (
                  <Iconify icon={GENDERS[item.buyer.gender].picture} className="absolute centered text-dark" width={20} />
                )}
              </section>
              {textEllipsis(item.buyer.fullName, 27)}
            </section>
          ),
          ...getTableFilter({ name: "buyer", icon: ICONS.person }),
        },
        {
          title: "Status",
          key: "status",
          dataIndex: "expiryDate",
          render: (expiryDate: Date, item) => {
            const activeInDays = item.startDate && isDateFuture(item.startDate, item.buyer.tz);
            if (activeInDays)
              return (
                <p className={statusVariants({ status: "future" })}>
                  Active {activeInDays === 1 ? "tomorrow" : `in ${activeInDays} day(s)`}
                </p>
              );

            if (isDateExpired(expiryDate, item.buyer.tz)) return <p className={statusVariants({ status: "expired" })}>Expired</p>;
            if (isDateToday(expiryDate, item.buyer.tz)) return <p className={statusVariants({ status: "today" })}>Today</p>;

            if (item.package.type === "SESSIONS") {
              if (item.remainingSessions) {
                if (!expiryDate) return <p className={statusVariants({ status: "session" })}>{item.remainingSessions} session(s)</p>;
                return (
                  <section className="flex gap-2">
                    <p className={statusVariants({ status: "session" })}>{item.remainingSessions} session(s)</p>
                    <p className={statusVariants({ status: "active" })}>{getRemainingDays(expiryDate, item.buyer.tz)} day(s)</p>
                  </section>
                );
              }
              if (!expiryDate) return <p className={statusVariants({ status: "expired" })}>Expired</p>;
            }

            return <p className={statusVariants({ status: "active" })}>{getRemainingDays(expiryDate, item.buyer.tz)} day(s)</p>;
          },
        },
        {
          title: "TXN Date",
          key: "transactionDate",
          dataIndex: "transactionDate",
          render: (date: Date) => formatDateShort({ date }),
          ...getTableFilter({ name: "transactionDate", type: "date" }),
        },
        {
          title: "Promo Code",
          key: "promoCode",
          render: (_, item) => <code>{item.promoCode ? item.promoCode.code : "-"}</code>,
          ...getTableFilter({ name: "promoCodeCode" }),
        },
      ]}
    />
  );
}
