import { api } from "@/trpc/react";
import { Skeleton } from "antd";
import { Fragment } from "react";
import TransactionInvoice from "./TransactionInvoice";

type Props = { id: string };

export default function ProductTransaction({ id }: Props) {
  const { data } = api.productTransaction.detail.useQuery({ id }, { enabled: !!id });

  return (
    <TransactionInvoice shadow="none" background="cream">
      {!data ? (
        <Skeleton paragraph={{ rows: 8 }} />
      ) : (
        <Fragment>
          <TransactionInvoice.Header
            tz={data.buyer.tz}
            title="Product"
            transactionDateDate={data.transactionDate}
            totalPrice={data.totalPrice}
          />
          <TransactionInvoice.Buyer fullName={data.buyer.fullName} phoneNumber={data.buyer.phoneNumber} email={data.buyer?.email} />
          <TransactionInvoice.Products
            products={data.products.map((e) => ({
              unitPrice: e.unitPrice,
              quantity: e.quantity,
              name: e.product.name,
              productId: e.product.id,
            }))}
          />
          <TransactionInvoice.PaymentMethodWithTxnId paymentMethod={data.paymentMethod.name} txnId={data.id} />
        </Fragment>
      )}
    </TransactionInvoice>
  );
}
