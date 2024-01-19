import { type ProductTransactionDetail } from "@/server/api/routers/productTransaction";
import TransactionInvoice from "./TransactionInvoice";

type Props = { data: ProductTransactionDetail | null };

export default function ProductTransaction({ data }: Props) {
  if (!data) return null;

  return (
    <TransactionInvoice>
      <TransactionInvoice.Header title="Product" transactionDateDate={data.transactionDate} totalPrice={data.totalPrice} />
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
    </TransactionInvoice>
  );
}
