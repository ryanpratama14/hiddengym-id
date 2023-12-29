import { formatCurrency, formatDateShort, isDateExpired, isDateToday, localizePhoneNumber } from "@/lib/utils";
import { type PackageTransactionDetail } from "@/server/api/routers/packageTransaction";
import Logo from "./Logo";

type Props = {
  data: PackageTransactionDetail | null;
};

export default function PackageTransaction({ data }: Props) {
  if (!data) return null;

  return (
    <section className="flex justify-center items-center relative z-0 bg-light">
      <section className="md:w-[30rem] w-full flex flex-col gap-4 p-3 lg:p-6 shadow text-dark">
        <section className="flex justify-between w-full">
          <section className="flex flex-col text-left">
            <h6>Package TXN</h6>
            <p className="font-medium">Date: {formatDateShort(data.transactionDate)}</p>
          </section>
          <section className="flex flex-col items-end">
            <p className="font-semibold">TOTAL AMOUNT</p>
            <h6 className="w-fit px-2 text-light bg-orange">{formatCurrency(data.totalPrice)}</h6>
          </section>
        </section>
        <section className="flex flex-col">
          <p className="font-medium underline">{data.buyer.fullName}</p>
          <small>{localizePhoneNumber(data.buyer.phoneNumber)}</small>
          <small>{data.buyer?.email}</small>
        </section>
        <section className="flex flex-col gap-1">
          <section className="flex justify-between items-center">
            <section className="flex gap-2 items-center">
              <small className="font-semibold border-1 border-dark px-1">{data.package.type}</small>
              <small>{data.package.name}</small>
            </section>
            <small>{formatCurrency(data.package.price)}</small>
          </section>
          {data.promoCode ? (
            <section className="flex justify-between items-center">
              <section className="flex gap-1 items-center">
                <small>PROMO CODE</small>
                <code className="text-sm italic underline">{data.promoCode.code}</code>
              </section>

              <small>{formatCurrency(-data.promoCode.discountPrice)}</small>
            </section>
          ) : null}
        </section>
        <section className="flex flex-col">
          {data.expiryDate && data.startDate ? (
            <section className="flex flex-col">
              <section className="flex justify-between">
                <small>Start</small>
                <small>Expiry</small>
              </section>
              <section className="flex justify-between items-center gap-6">
                <section className="flex flex-col w-fit">
                  <p className="font-semibold">{formatDateShort(data.startDate)}</p>
                </section>
                <div className="w-[50%] h-0.5 bg-dark" />
                <section className="flex flex-col text-right w-fit">
                  <p className="font-semibold">
                    {isDateToday(data.expiryDate)
                      ? "Today"
                      : isDateExpired(data.expiryDate)
                        ? "Expired"
                        : formatDateShort(data.expiryDate)}
                  </p>
                </section>
              </section>
            </section>
          ) : null}

          {data.package.totalPermittedSessions ? (
            <small className="text-left">Sessions given: {`${data.package.totalPermittedSessions} session(s)`}</small>
          ) : null}

          {data.remainingPermittedSessions ? (
            <small className="text-left">Sessions left: {`${data.remainingPermittedSessions} session(s)`}</small>
          ) : null}
        </section>

        <section className="px-4 py-1 shadow-lg text-light bg-blue flex flex-col">
          <section className="text-lg font-medium">PAID BY {data.paymentMethod.name.toUpperCase()}</section>
          <small className="!text-xs">txn. {data.id}</small>
        </section>
        <section className="flex flex-col justify-center items-center gap-6 mt-6">
          <Logo className="aspect-video w-full md:w-[70%]" />
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
