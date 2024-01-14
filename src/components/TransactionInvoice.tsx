import {
  formatCurrency,
  formatDateShort,
  getExpiryDate,
  getNewDate,
  getStartDate,
  isDateExpired,
  isDateToday,
  localizePhoneNumber,
} from "@/lib/functions";
import { type Package, type PromoCode } from "@prisma/client";
import Logo from "./Logo";

export default function TransactionInvoice({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex justify-center items-center">
      <section className="md:w-[30rem] w-full flex flex-col gap-4 p-3 lg:p-6 shadow bg-light text-dark">
        {children}
        <section className="flex flex-col justify-center items-center gap-6 mt-6">
          <Logo className="aspect-video w-[50%]" />
          <section className="flex justify-center flex-col gap-1 text-center">
            <h6>HIDDEN GYM</h6>
            <small className="text-balance">
              Jl. Cengkir No.9 10, RT.10/RW.12, Utan Kayu Sel., Kec. Matraman, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13120
            </small>
          </section>
        </section>
      </section>
    </section>
  );
}

TransactionInvoice.Products = function InvoiceProducts({
  products,
}: {
  products: { unitPrice: number; quantity: number; productId: string; name: string }[];
}) {
  return (
    <section className="flex flex-col gap-1">
      {products.map((product, index) =>
        product.productId ? (
          <section key={index} className="flex justify-between items-center">
            <p>
              {product.quantity}x {product.name}
            </p>
            <p>{formatCurrency(product.quantity * product.unitPrice)}</p>
          </section>
        ) : null,
      )}
    </section>
  );
};

TransactionInvoice.Buyer = function InvoiceBuyer(props: { fullName: string; phoneNumber: string; email?: string | null }) {
  return (
    <section className="flex flex-col text-center">
      <p className="font-medium underline">{props.fullName}</p>
      <small>{localizePhoneNumber(props.phoneNumber)}</small>
      <small>{props.email}</small>
    </section>
  );
};

TransactionInvoice.Header = function InvoiceHeader(props: {
  title: string;
  totalPrice: number;
  transactionDate?: string;
  transactionDateDate?: Date;
}) {
  return (
    <section className="flex justify-between w-full">
      <section className="flex flex-col">
        <h6>{props.title} TXN</h6>
        <p className="font-medium">
          Date:{" "}
          {props.transactionDate
            ? formatDateShort({ date: props.transactionDateDate ? props.transactionDateDate : getNewDate(props.transactionDate) })
            : null}
        </p>
      </section>
      <section className="flex flex-col items-end">
        <p className="font-semibold">TOTAL AMOUNT</p>
        <h6 className="w-fit px-2 text-light bg-orange">{formatCurrency(props.totalPrice)}</h6>
      </section>
    </section>
  );
};

TransactionInvoice.Package = function InvoicePackage(props: { package: Package; promoCode?: PromoCode | null }) {
  return (
    <section className="flex flex-col gap-1">
      <section className="flex justify-between items-center">
        <section className="flex gap-2 items-center">
          <small className="font-semibold border-1 border-dark px-1">{props.package.type}</small>
          <small>{props.package.name}</small>
        </section>
        <small>{formatCurrency(props.package.price)}</small>
      </section>
      {props.promoCode ? (
        <section className="flex justify-between items-center">
          <section className="flex gap-1 items-center">
            <small>PROMO CODE</small>
            <code className="text-sm italic underline">{props.promoCode.code}</code>
          </section>

          <small>{formatCurrency(-props.promoCode.discountPrice)}</small>
        </section>
      ) : null}
    </section>
  );
};

TransactionInvoice.Validity = function InvoiceValidity(props: { validityInDays?: number | null; transactionDate?: string }) {
  return props.validityInDays && props.transactionDate ? (
    <section className="flex flex-col">
      <section className="flex justify-between">
        <small>Start</small>
        <small>Expiry</small>
      </section>
      <section className="flex justify-between items-center gap-6 relative">
        <section className="flex flex-col w-fit">
          <p className="font-semibold">{formatDateShort({ date: getStartDate(props.transactionDate) })}</p>
        </section>
        <div className="absolute centered w-[25%] h-0.5 bg-dark" />
        <section className="flex flex-col text-right w-fit">
          <p className="font-semibold">
            {isDateToday(getExpiryDate({ days: props.validityInDays, dateString: props.transactionDate }))
              ? "Today"
              : isDateExpired(getExpiryDate({ days: props.validityInDays, dateString: props.transactionDate }))
                ? "Expired"
                : formatDateShort({
                    date: getExpiryDate({ days: props.validityInDays, dateString: props.transactionDate }),
                  })}
          </p>
        </section>
      </section>
    </section>
  ) : null;
};

TransactionInvoice.ApprovedSessions = function InvoiceApprovedSessions({ approvedSessions }: { approvedSessions?: number | null }) {
  return approvedSessions ? <small className="text-left">Approved sessions: {`${approvedSessions} session(s)`}</small> : null;
};

TransactionInvoice.PaymentMethod = function InvoiceApprovedSession({ paymentMethod }: { paymentMethod?: string }) {
  return paymentMethod ? (
    <section className="flex w-full bg-blue text-light justify-center text-lg py-1 font-medium shadow-lg">
      PAID BY {paymentMethod.toUpperCase()}
    </section>
  ) : null;
};
