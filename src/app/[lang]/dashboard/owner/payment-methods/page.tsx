import Button from "@/components/Button";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";

export default async function PaymentMethodsPage() {
  const data = await api.paymentMethod.list.query();

  return (
    <section className="flex flex-col gap-6">
      <h4>Payment Method</h4>
      <section className="grid md:grid-cols-3 gap-6">
        {data?.map((e) => {
          return (
            <section key={e?.id} className="p-6 bg-light rounded-md border-1 border-dark/50">
              <section className="flex justify-between flex-wrap items-start gap-6">
                <h4>{e?.name}</h4>
                <section className="flex flex-col gap-4 w-full">
                  <section className="flex flex-col gap-1">
                    <p className={cn(" text-lg w-full text-right")}>Today's Transactions</p>
                    <section className="flex gap-2 items-center">
                      <div className="p-1 text-lg flex items-center justify-center  aspect-square rounded-full bg-green text-cream">
                        <p>120</p>
                      </div>
                      <p>packages</p>
                    </section>
                    <section className="flex gap-2 items-center">
                      <div className="p-1 text-lg flex items-center justify-center  aspect-square rounded-full bg-orange text-cream">
                        <p>120</p>
                      </div>
                      <p>products</p>
                    </section>
                  </section>
                  <Button color="link" size="l">
                    More Detail
                  </Button>
                </section>
              </section>
            </section>
          );
        })}
      </section>
    </section>
  );
}
