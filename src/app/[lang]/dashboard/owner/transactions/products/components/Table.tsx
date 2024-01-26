import Button from "@/components/Button";
import FilterIcon from "@/components/FilterIcon";
import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import Input from "@/components/Input";
import { GENDERS, ICONS } from "@/lib/constants";
import { cn, formatCurrency, formatDateShort, openModal, textEllipsis } from "@/lib/functions";
import type { ProductTransactionList, ProductTransactionListInput } from "@/server/api/routers/productTransaction";
import { PAGINATION_LIMIT } from "@/trpc/shared";
import type { SearchParams } from "@/types";
import ActionButton from "@dashboard/components/ActionButton";
import type { IconifyIcon } from "@iconify/react/dist/iconify.js";
import { Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";

type Props = {
  data?: ProductTransactionList;
  searchParams: SearchParams;
  loading: boolean;
  newParams: URLSearchParams;
  redirect: (newParams: URLSearchParams) => void;
};

export default function ProductTransactionsTable({ data, searchParams, loading, newParams, redirect }: Props) {
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
            redirect(newParams);
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
              <section className="flex justify-center items-center gap-2">
                <ActionButton onClick={openModal({ id, action: "detail", newParams, redirect })} icon={ICONS.invoice} color="blue" />
                <ActionButton onClick={openModal({ id, action: "update", newParams, redirect })} icon={ICONS.edit} color="yellow" />
                <ActionButton onClick={openModal({ id, action: "delete", newParams, redirect })} icon={ICONS.delete} color="red" />
              </section>
            );
          },
        },
        {
          title: "Products",
          key: "products",
          render: (_, item) =>
            item.products.map((e) => (
              <p key={e.id} className="md:text-base text-sm">
                {e.quantity}x {e.product.name}
              </p>
            )),
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
          title: "TXN Date",
          key: "transactionDate",
          dataIndex: "transactionDate",
          render: (date: Date) => formatDateShort({ date }),
          ...getTableFilter({ name: "transactionDate", type: "date" }),
        },
      ]}
    />
  );
}
