import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import Input from "@/components/Input";
import { Modal } from "@/components/Modal";
import PackageTransaction from "@/components/PackageTransaction";
import { type Locale } from "@/i18n.config";
import { DETERMINE_GENDER, ICONS, PACKAGE_TYPES, USER_REDIRECT } from "@/lib/constants";
import {
  cn,
  createUrl,
  formatCurrency,
  formatDateShort,
  getRemainingDays,
  isDateExpired,
  isDateToday,
  textEllipsis,
} from "@/lib/utils";
import {
  type PackageTransactionDetail,
  type PackageTransactionList,
  type PackageTransactionListInputParams,
} from "@/server/api/routers/packageTransaction";
import { inputVariants } from "@/styles/variants";
import { PAGINATION_LIMIT } from "@/trpc/shared";
import { type SearchParams } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { Table } from "antd";
import { type FilterDropdownProps } from "antd/es/table/interface";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";

type Props = {
  data?: PackageTransactionList;
  searchParams: SearchParams;
  lang: Locale;
  loading: boolean;
};

export default function PackageTransactionsTable({ data, searchParams, lang, loading }: Props) {
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());
  const [selectedTransaction, setSelectedTransaction] = useState<PackageTransactionDetail | null>(null);
  const [show, setShow] = useState(false);

  if (data?.isInvalidPage) {
    newParams.delete("page");
    redirect(createUrl(USER_REDIRECT.OWNER({ lang, href: "/transactions/packages" }), newParams));
  }

  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT.OWNER({ lang, href: "/transactions/packages" }), newParams));
  };

  const getTableFilter = ({ name, icon }: { name: keyof PackageTransactionListInputParams; icon?: IconifyIcon | string }) => ({
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
            <Input
              icon={icon}
              key={name}
              defaultValue={searchParams[name]}
              name={name}
              type={name === "totalPrice" ? "number" : "text"}
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
    <Fragment>
      <Modal show={show} closeModal={() => setShow(false)}>
        <Modal.Body>
          <PackageTransaction data={selectedTransaction} />
        </Modal.Body>
      </Modal>
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
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} package transactions`,
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
            render: (_, item) => (
              <Button
                onClick={() => {
                  setSelectedTransaction(item);
                  setShow(true);
                }}
                color="link"
              >
                View
              </Button>
            ),
          },
          {
            title: "Type",
            key: "package.type",
            render: (_, item) => item.package.type,
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
            ...getTableFilter({ name: "totalPrice" }),
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
                <section className="w-8 aspect-square bg-cream rounded-full relative shadow border-1 border-dotted border-dark">
                  {item.buyer?.image?.url ? (
                    <Img
                      src={item.buyer.image.url}
                      alt={item.buyer.fullName}
                      className="absolute centered object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <Iconify icon={DETERMINE_GENDER[item.buyer.gender].picture} className="absolute centered text-dark" width={22} />
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
            render: (text: Date, item) => {
              if (item.remainingPermittedSessions)
                return (
                  <p className="px-2 py-0.5 rounded-md shadow bg-purple-600 text-center text-cream w-fit">
                    {item.remainingPermittedSessions} session(s)
                  </p>
                );

              if (isDateExpired(text))
                return <p className="px-2 py-0.5 rounded-md shadow bg-red text-center text-cream w-fit">Expired</p>;

              if (isDateToday(text))
                return <p className="px-2 py-0.5 rounded-md shadow bg-indigo-600 text-center text-cream w-fit">Today</p>;

              return (
                <p className="px-2 rounded-md shadow bg-emerald text-center text-cream w-fit">
                  {getRemainingDays({ expiryDate: text, isVisit: item.package.type === "VISIT" })} days
                </p>
              );
            },
          },
          {
            title: "TXN Date",
            key: "transactionDate",
            dataIndex: "transactionDate",
            render: (text: Date) => formatDateShort(text),
          },
          {
            title: "Promo Code",
            key: "promoCode",
            render: (_, item) => <code>{item.promoCode ? item.promoCode.code : "-"}</code>,
          },
        ]}
      />
    </Fragment>
  );
}
