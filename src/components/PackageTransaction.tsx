import { formatDateShort, getRemainingDate } from "@/lib/functions";
import { type PackageTransactionDetail } from "@/server/api/routers/packageTransaction";
import TransactionInvoice from "./TransactionInvoice";

type Props = {
  data: PackageTransactionDetail | null;
};

export default function PackageTransaction({ data }: Props) {
  if (!data) return null;

  return (
    <TransactionInvoice shadow="none" background="cream">
      <TransactionInvoice.Header title="Package" transactionDateDate={data.transactionDate} totalPrice={data.totalPrice} />
      <TransactionInvoice.Buyer fullName={data.buyer.fullName} phoneNumber={data.buyer.phoneNumber} email={data.buyer?.email} />
      <TransactionInvoice.PackageWithTxnId
        package={{ name: data.package.name, unitPrice: data.unitPrice, type: data.package.type }}
        promoCode={{ code: data.promoCode?.code, discountPrice: data?.discountPrice }}
      />

      <section className="flex flex-col gap-4">
        {data.expiryDate && data.startDate ? (
          <section className="flex flex-col">
            <section className="flex justify-between">
              <small>Start</small>
              <small>Expiry</small>
            </section>
            <section className="flex justify-between items-center gap-6 relative">
              <div className="absolute centered w-[25%] h-0.5 bg-dark" />
              <section className="flex flex-col w-fit">
                <p className="font-semibold">{formatDateShort({ date: data.startDate })}</p>
              </section>

              <section className="flex flex-col text-right w-fit">
                <p className="font-semibold">{getRemainingDate(data.expiryDate, data.buyer.tz)}</p>
              </section>
            </section>
          </section>
        ) : null}

        {data.package.approvedSessions && data.remainingSessions ? (
          <section className="flex flex-col">
            <section className="flex justify-between">
              <small>Approved</small>
              <small>Remaining</small>
            </section>
            <section className="flex justify-between items-center gap-6 relative">
              <div className="absolute centered w-[25%] h-0.5 bg-dark" />
              <section className="flex flex-col w-fit">
                <p className="font-semibold">{data.package.approvedSessions} session(s)</p>
              </section>
              <section className="flex flex-col text-right w-fit">
                <p className="font-semibold">{data.remainingSessions} session(s)</p>
              </section>
            </section>
          </section>
        ) : null}
      </section>

      <TransactionInvoice.PaymentMethodWithTxnId paymentMethod={data.paymentMethod.name} txnId={data.id} />
    </TransactionInvoice>
  );
}
