import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import { prismaExclude } from "@/trpc/shared";

export const paymentMethodRouter = createTRPCRouter({
  list: ownerProcedure.query(async ({ ctx }) => {
    return ctx.db.paymentMethod.findMany({
      select: {
        packageTransactions: true,
        productTransactions: true,
        ...prismaExclude("PaymentMethod", ["createdDate"]),
      },
    });
  }),
});
