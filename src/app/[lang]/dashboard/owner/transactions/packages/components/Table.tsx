import Navigator from "@/components/Navigator";
import NavigatorX from "@/components/NavigatorX";
import { type Locale } from "@/i18n.config";
import { USER_REDIRECT } from "@/lib/constants";
import {
  createUrl,
  formatCurrency,
  formatDateShort,
  getRemainingDays,
  isDateExpired,
  isDateToday,
  lozalizePhoneNumber,
} from "@/lib/utils";
import { type PackageTransactionList } from "@/server/api/routers/packageTransaction";
import { PAGINATION_LIMIT } from "@/trpc/shared";
import { type SearchParams } from "@/types";
import { type Role } from "@prisma/client";
import { Table } from "antd";
import { redirect, useRouter, useSearchParams } from "next/navigation";

type Props = {
  data?: PackageTransactionList;
  searchParams: SearchParams;
  lang: Locale;
  loading: boolean;
};

export default function PackageTransactionsTable({ data, searchParams, lang, loading }: Props) {
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());

  if (data?.isInvalidPage) {
    newParams.delete("page");
    redirect(createUrl(USER_REDIRECT.OWNER({ lang, href: "/transactions/packages" }), newParams));
  }

  const router = useRouter();

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT.OWNER({ lang, href: "/transactions/packages" }), newParams));
  };

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
          render: (id: string) => (
            <Navigator color="link" href={USER_REDIRECT.OWNER({ lang, href: `/transactions/packages/detail/${id}` })}>
              View
            </Navigator>
          ),
        },
        {
          title: "Type",
          key: "package.type",
          render: (_, item) => item.package.type,
        },
        {
          title: "Status",
          key: "status",
          dataIndex: "expiryDate",
          render: (text: Date, item) => {
            if (item.package.type === "TRAINER" && item.remainingPermittedSessions)
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
          title: "Status",
          key: "expiryDate",
          dataIndex: "expiryDate",
          render: (text: Date) => text?.toLocaleString(),
        },
        {
          title: "Package",
          key: "package.name",
          render: (_, item) => item.package.name,
        },
        {
          title: "Total Price",
          key: "totalPrice",
          dataIndex: "totalPrice",
          render: (text: number) => formatCurrency(text),
        },
        {
          title: "Payment Method",
          key: "paymentMethod.name",
          render: (_, item) => item.paymentMethod.name,
        },
        {
          title: "Buyer",
          key: "buyer.fullName",
          render: (_, item) => item.buyer.fullName,
        },
        {
          title: "Transaction Date",
          key: "transactionDate",
          dataIndex: "transactionDate",
          render: (text: Date) => formatDateShort(text),
        },
      ]}
    />
  );
}
