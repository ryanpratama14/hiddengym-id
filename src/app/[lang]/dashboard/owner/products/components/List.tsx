import { ICONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/functions";
import type { ProductList } from "@/server/api/routers/product";
import type { Dictionary, SearchParams } from "@/types";
import ActionButton from "@dashboard/components/ActionButton";
import { Skeleton } from "antd";
import ModalUpdate from "./ModalUpdate";

type Props = {
  searchParams: SearchParams;
  newParams: URLSearchParams;
  t: Dictionary;
  data?: ProductList;
  loading: boolean;
  redirectTable: (newParams: URLSearchParams) => void;
};

export default function ProductsList({ searchParams, newParams, t, data, loading, redirectTable }: Props) {
  return (
    <section className="flex flex-col gap-6">
      <ModalUpdate
        t={t}
        data={searchParams.id && data ? data.find((e) => e.id === searchParams.id)! : null}
        show={!!searchParams.id}
        closeModal={() => {
          newParams.delete("id");
          redirectTable(newParams);
        }}
      />
      <section className="grid grid-cols-4 gap-4">
        {loading
          ? Array(10)
              .fill(10)
              .map((_, index) => <Skeleton key={index} />)
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
                      onClick={() => {
                        newParams.set("id", product.id);
                        redirectTable(newParams);
                      }}
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
            })}
      </section>
    </section>
  );
}
