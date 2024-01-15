import ActionButton from "@/app/[lang]/dashboard/components/ActionButton";
import Button from "@/components/Button";
import FilterIcon from "@/components/FilterIcon";
import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import Input from "@/components/Input";
import { Modal } from "@/components/Modal";
import ProductTransaction from "@/components/ProductTransaction";
import { useZustand } from "@/global/store";
import { DETERMINE_GENDER, ICONS, USER_REDIRECT } from "@/lib/constants";
import { cn, createUrl, formatCurrency, formatDateShort, textEllipsis } from "@/lib/functions";
import {
  type ProductTransactionDetail,
  type ProductTransactionList,
  type ProductTransactionListInput,
} from "@/server/api/routers/productTransaction";
import { PAGINATION_LIMIT } from "@/trpc/shared";
import { type SearchParams } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { Table } from "antd";
import { type FilterDropdownProps } from "antd/es/table/interface";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";

type Props = {
  data?: ProductTransactionList;
  searchParams: SearchParams;
  loading: boolean;
};

export default function ProductTransactionsTable({ data, searchParams, loading }: Props) {
  const { lang } = useZustand();
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());
  const [selectedTransaction, setSelectedTransaction] = useState<ProductTransactionDetail | null>(null);
  const [show, setShow] = useState(false);

  if (data?.isPaginationInvalid) {
    newParams.delete("page");
    redirect(createUrl(USER_REDIRECT.OWNER({ lang, href: "/transactions/products" }), newParams));
  }

  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT.OWNER({ lang, href: "/transactions/products" }), newParams));
  };

  const getTableFilter = ({
    name,
    icon,
    type,
  }: {
    name: keyof ProductTransactionListInput;
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
          <Input
            icon={icon}
            key={name}
            defaultValue={searchParams[name]}
            name={name}
            type={type ? type : "text"}
            className={cn("text-base")}
          />
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
      <Modal show={show} closeModal={() => setShow(false)}>
        <Modal.Body>
          <ProductTransaction data={selectedTransaction} />
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
              <section className="flex justify-center items-center">
                <ActionButton
                  onClick={() => {
                    setSelectedTransaction(item);
                    setShow(true);
                  }}
                  title="Invoice"
                  icon={ICONS.invoice}
                  color="green"
                />
              </section>
            ),
          },
          {
            title: "Products",
            key: "products",
            render: (_, item) => {
              return (
                <section className="flex flex-col">
                  {item.products.map((e) => (
                    <p className="md:text-base text-sm">
                      {e.quantity}x {e.product.name}
                    </p>
                  ))}
                </section>
              );
            },
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
                <section className="size-7 bg-cream rounded-full relative shadow border-1 border-dotted border-dark flex items-center justify-center p-0.5">
                  {item.buyer?.image?.url ? (
                    <Img src={item.buyer.image.url} alt={item.buyer.fullName} className="object-cover w-full h-full rounded-full" />
                  ) : (
                    <Iconify icon={DETERMINE_GENDER[item.buyer.gender].picture} className="absolute centered text-dark" width={20} />
                  )}
                </section>
                {textEllipsis(item.buyer.fullName, 27)}
              </section>
            ),
            ...getTableFilter({ name: "buyer", icon: ICONS.person }),
          },

          {
            title: "TXN Date",
            key: "transactionDate",
            dataIndex: "transactionDate",
            render: (date: Date) => formatDateShort({ date }),
            ...getTableFilter({ name: "transactionDate", type: "date" }),
          },
        ]}
      />
    </Fragment>
  );
}