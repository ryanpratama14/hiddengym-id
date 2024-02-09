import { isTxnDateToday } from "@/lib/functions";
import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import {
  type RouterInputs,
  type RouterOutputs,
  THROW_OK,
  THROW_TRPC_ERROR,
  getConflictMessage,
  getCreatedMessage,
  prismaExclude,
} from "@/trpc/shared";
import { schema } from "@schema";
import { z } from "zod";

const paymentMethodSelect = {
  select: {
    packageTransactions: { select: { ...prismaExclude("PackageTransaction", []), buyer: true } },
    productTransactions: { select: { ...prismaExclude("ProductTransaction", []), buyer: true } },
    ...prismaExclude("PaymentMethod", []),
  },
};

export const paymentMethodRouter = createTRPCRouter({
  create: ownerProcedure.input(schema.paymentMethod.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.paymentMethod.findFirst({ where: { name: input.name } });
    if (data) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("payment method", "name"));
    await ctx.db.paymentMethod.create({ data: { name: input.name } });
    return THROW_OK("CREATED", getCreatedMessage("payment method"));
  }),

  list: ownerProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.paymentMethod.findMany({ ...paymentMethodSelect });

    return data.map((e) => ({
      ...e,
      todayPackageTransactions: e.packageTransactions.filter((txn) => isTxnDateToday(txn.transactionDate)),
      todayProductTransactions: e.productTransactions.filter((txn) => isTxnDateToday(txn.transactionDate)),
    }));
  }),

  detail: ownerProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const data = await ctx.db.paymentMethod.findFirst({ where: { id: input.id }, ...paymentMethodSelect });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");

    return {
      ...data,
      todayPackageTransaction: data.packageTransactions.filter((txn) => isTxnDateToday(txn.transactionDate)),
      todayProductTransaction: data.productTransactions.filter((txn) => isTxnDateToday(txn.transactionDate)),
    };
  }),
});

// outputs
export type PaymentMethodList = RouterOutputs["paymentMethod"]["list"];
export type PaymentMethodDetail = RouterOutputs["paymentMethod"]["detail"];

// inputs
export type PaymentMethodCreateInput = RouterInputs["paymentMethod"]["create"];
