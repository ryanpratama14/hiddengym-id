import { ICONS } from "@/lib/constants";
import { formatCurrency, openModal } from "@/lib/functions";
import type { ProductList } from "@/server/api/routers/product";
import type { SearchParams } from "@/types";
import ActionButton from "@dashboard/components/ActionButton";
import { Skeleton } from "antd";

type Props = {
  searchParams: SearchParams;
  data?: ProductList;
  loading: boolean;
  redirect: (newParams: URLSearchParams) => void;
  newParams: URLSearchParams;
};

export default function ProductsList({ data, loading, redirect, newParams }: Props) {
  return loading
    ? Array(10)
        .fill(10)
        .map((_, index) => <Skeleton active key={index} />)
    : data?.map((product) => {
        return (
          <section key={product.id} className="flex flex-col gap-4 p-3 bg-light shadow-lg border-1 border-dark rounded-md">
            <header className="flex justify-between">
              <section className="flex gap-2 items-center">
                <p className="text-lg">{product.name}</p>
                <p className="px-2 bg-orange text-cream w-fit">{formatCurrency(product.price)}</p>
              </section>
              <ActionButton
                icon={ICONS.edit}
                color="green"
                onClick={openModal({ id: product.id, action: "update", newParams, redirect })}
              />
            </header>
            <section className="flex flex-col">
              <p className="text-blue2 font-medium">Recent transactions</p>
              {product?.transactions?.slice?.(0, 10)?.map((txn) => (
                <section key={txn.id} className="flex justify-between">
                  <small>{txn.productTransaction.buyer.fullName}</small>
                  <small>
                    {txn.quantity}x {formatCurrency(txn.quantity * txn.unitPrice)}
                  </small>
                </section>
              ))}
            </section>
          </section>
        );
      });
}
