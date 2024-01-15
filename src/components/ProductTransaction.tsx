import { cn, formatCurrency, formatDateShort, localizePhoneNumber } from "@/lib/functions";
import { type ProductTransactionDetail } from "@/server/api/routers/productTransaction";
import { Fragment } from "react";
import Logo from "./Logo";

type Props = {
  data: ProductTransactionDetail | null;
};

export default function ProductTransaction({ data }: Props) {
  if (!data) return null;

  return (
    <Fragment>
      <section className="flex justify-center items-center relative z-0 bg-light">
        <section className="md:w-[30rem] w-full flex flex-col gap-4 p-3 lg:p-6 shadow text-dark">
          <section className="flex justify-between w-full">
            <section className="flex flex-col text-left">
              <h6>Package TXN</h6>
              <p className="font-medium">Date: {formatDateShort({ date: data.transactionDate })}</p>
            </section>
            <section className="flex flex-col items-end">
              <p className="font-semibold">TOTAL AMOUNT</p>
              <h6 className="w-fit px-2 text-light bg-orange">{formatCurrency(data.totalPrice)}</h6>
            </section>
          </section>
          <section className="flex flex-col">
            <p className="font-medium underline">{data.buyer.fullName}</p>
            <p>{localizePhoneNumber(data.buyer.phoneNumber)}</p>
            <small>{data.buyer?.email}</small>
          </section>

          <section className="flex flex-col gap-1">
            {data.products.map((product, index) => (
              <section key={index} className="flex justify-between items-center">
                <p>
                  {product.quantity}x {product.product.name}
                </p>
                <p>{formatCurrency(product.quantity * product.unitPrice)}</p>
              </section>
            ))}
          </section>

          <section className="px-4 py-1 shadow-lg text-light bg-blue flex flex-col">
            <section className="text-lg font-medium">PAID BY {data.paymentMethod.name.toUpperCase()}</section>
            <small className={cn("text-xs")}>txn no. {data.id}</small>
          </section>
          <section className="flex flex-col justify-center items-center gap-6 mt-6">
            <Logo className="aspect-video w-[50%]" />
            <section className="flex justify-center flex-col gap-1 text-center">
              <h6>HIDDEN GYM</h6>
              <small className="text-balance">
                Jl. Cengkir No.9 10, RT.10/RW.12, Utan Kayu Sel., Kec. Matraman, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta
                13120
              </small>
            </section>
          </section>
        </section>
      </section>
    </Fragment>
  );
}
