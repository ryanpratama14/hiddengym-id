import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import {
  getConflictMessage,
  getCreatedMessage,
  prismaExclude,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";

export const paymentMethodRouter = createTRPCRouter({
  create: ownerProcedure.input(schema.paymentMethod.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.paymentMethod.findFirst({ where: { name: input.name } });
    if (data) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("payment method", "name"));
    await ctx.db.paymentMethod.create({ data: { name: input.name } });
    return THROW_OK("CREATED", getCreatedMessage("payment method"));
  }),

  list: ownerProcedure.query(async ({ ctx }) => {
    const data = ctx.db.paymentMethod.findMany({
      select: { packageTransactions: true, productTransactions: true, ...prismaExclude("PaymentMethod", []) },
    });
    return data;
  }),
});

// outputs
export type PaymentMethodList = RouterOutputs["paymentMethod"]["list"];

// inputs
export type PaymentMethodCreateInput = RouterInputs["paymentMethod"]["create"];
