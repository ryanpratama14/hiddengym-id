import { COUNTRY_CODE, GENDERS } from "@/lib/constants";
import {
  cn,
  formatCurrency,
  formatDateLong,
  formatDateShort,
  getExpiryDate,
  getNewDate,
  getRemainingDate,
  getStartDate,
  localizePhoneNumber,
} from "@/lib/functions";
import type { File, Gender, Package, PackageType, PromoCode } from "@prisma/client";
import Iconify from "./Iconify";
import Img from "./Img";
import Logo from "./Logo";
import NavigatorX from "./NavigatorX";

export default function TransactionInvoice({
  children,
  background,
  shadow,
}: {
  children: React.ReactNode;
  background?: "light" | "cream";
  shadow?: "none" | "base";
}) {
  return (
    <section className="flex justify-center items-center">
      <section
        className={cn("md:w-[30rem] w-full flex flex-col gap-4 p-3 lg:p-6 shadow bg-light text-dark", {
          "bg-cream": background === "cream",
          "shadow-none": shadow === "none",
        })}
      >
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
    <section className="flex flex-col gap-0.5">
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

TransactionInvoice.Buyer = function InvoiceBuyer(props: {
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  image?: File | null;
  gender: Gender;
}) {
  return (
    <section className="flex gap-2 items-center">
      <section className="size-10 bg-cream rounded-full relative shadow border-1 border-dotted border-dark flex items-center justify-center">
        {props.image ? (
          <Img src={props.image.url} alt={props.fullName} className="object-cover w-full h-full rounded-full" />
        ) : (
          <Iconify icon={GENDERS[props.gender].picture} className="text-dark" width={30} />
        )}
      </section>
      <section className="flex flex-col text-left">
        <p className="font-medium -mb-0.5">{props.fullName}</p>
        <NavigatorX newTab href={`tel:${COUNTRY_CODE}${props.phoneNumber}`}>
          <small className="hover:text-blue">{localizePhoneNumber(props.phoneNumber)}</small>
        </NavigatorX>
        <small>{props.email}</small>
      </section>
    </section>
  );
};

TransactionInvoice.Header = function InvoiceHeader(props: {
  title: string;
  totalPrice: number;
  transactionDate?: string;
  transactionDateDate?: Date;
  tz: string;
}) {
  return (
    <section className="flex justify-between w-full">
      <section className="flex flex-col text-left">
        <h6>{props.title} TXN</h6>
        <small>
          {formatDateLong({
            date: props.transactionDateDate ? props.transactionDateDate : getNewDate(props.transactionDate),
            tz: props.tz,
          })}
        </small>
      </section>
      <section className="flex flex-col items-end">
        <p className="font-medium">TOTAL AMOUNT</p>
        <p className="text-lg font-semibold w-fit px-2 text-light bg-orange">{formatCurrency(props.totalPrice)}</p>
      </section>
    </section>
  );
};

TransactionInvoice.Package = function InvoicePackage(props: { unitPrice: number; package: Package; promoCode?: PromoCode | null }) {
  return (
    <section className="flex flex-col gap-1">
      <section className="flex justify-between items-center">
        <section className="flex gap-2 items-center">
          <small className="font-semibold border-1 border-dark px-1">{props.package.type}</small>
          <small>{props.package.name}</small>
        </section>
        <small>{formatCurrency(props.unitPrice)}</small>
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

TransactionInvoice.PackageWithTxnId = function InvoicePackageWithTxnId(props: {
  package: { name: string; unitPrice: number; type: PackageType };
  promoCode?: { code?: string; discountPrice: number | null };
}) {
  return (
    <section className="flex flex-col gap-1">
      <section className="flex justify-between items-center">
        <section className="flex gap-2 items-center">
          <small className="font-semibold border-1 border-dark px-1">{props.package.type}</small>
          <small>{props.package.name}</small>
        </section>
        <small>{formatCurrency(props.package.unitPrice)}</small>
      </section>
      {props.promoCode?.code && props.promoCode.discountPrice ? (
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

TransactionInvoice.Validity = function InvoiceValidity(props: {
  validityInDays?: number | null;
  startDate?: string | null;
  tz: string;
}) {
  return props.validityInDays && props.startDate ? (
    <section className="flex flex-col">
      <section className="flex justify-between">
        <small>Start</small>
        <small>Expiry</small>
      </section>
      <section className="flex justify-between items-center gap-6 relative">
        <section className="flex flex-col w-fit">
          <p className="font-semibold">{formatDateShort({ date: getStartDate(props.startDate) })}</p>
        </section>
        <div className="absolute centered w-[25%] h-0.5 bg-dark" />
        <section className="flex flex-col text-right w-fit">
          <p className="font-semibold">
            {getRemainingDate(getExpiryDate({ days: props.validityInDays, dateString: props.startDate }), props.tz)}
          </p>
        </section>
      </section>
    </section>
  ) : null;
};

TransactionInvoice.ApprovedSessions = function InvoiceApprovedSessions({ approvedSessions }: { approvedSessions?: number | null }) {
  return approvedSessions ? <small className="text-left">Approved sessions: {`${approvedSessions} session(s)`}</small> : null;
};

TransactionInvoice.PaymentMethod = function InvoicePaymentMethod({ paymentMethod }: { paymentMethod?: string }) {
  return paymentMethod ? (
    <section className="flex w-full bg-blue text-light justify-center text-lg py-1 font-medium shadow-lg">
      PAID BY {paymentMethod.toUpperCase()}
    </section>
  ) : null;
};

TransactionInvoice.PaymentMethodWithTxnId = function InvoicePaymentMethodWithTxnId(props: { paymentMethod: string; txnId: string }) {
  return (
    <section className="px-4 py-1 shadow-lg text-light bg-blue flex flex-col">
      <section className="text-lg font-medium">PAID BY {props.paymentMethod.toUpperCase()}</section>
      <small className={cn("text-xs")}>txn {props.txnId}</small>
    </section>
  );
};
