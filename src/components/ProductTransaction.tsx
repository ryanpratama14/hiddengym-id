import { type ProductTransactionDetail } from "@/server/api/routers/productTransaction";
import { Skeleton } from "antd";
import { Fragment } from "react";
import TransactionInvoice from "./TransactionInvoice";

type Props = { data?: ProductTransactionDetail };

export default function ProductTransaction({ data }: Props) {
  return (
    <TransactionInvoice shadow="none" background="cream">
      <Fragment>
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
            <TransactionInvoice.Buyer
              fullName={data.buyer.fullName}
              phoneNumber={data.buyer.phoneNumber}
              email={data.buyer?.email}
              gender={data.buyer.gender}
              image={data.buyer.image}
            />
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
      </Fragment>
    </TransactionInvoice>
  );
}
