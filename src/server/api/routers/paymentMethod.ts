import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import { prismaExclude, type RouterOutputs } from "@/trpc/shared";

export const paymentMethodRouter = createTRPCRouter({
  list: ownerProcedure.query(async ({ ctx }) => {
    const data = ctx.db.paymentMethod.findMany({
      select: {
        packageTransactions: true,
        productTransactions: true,
        ...prismaExclude("PaymentMethod", ["createdDate"]),
      },
    });
    return data;
  }),
});

// outputs
export type PaymentMethodList = RouterOutputs["paymentMethod"]["list"];
