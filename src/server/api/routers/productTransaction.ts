import { formatName, getEndDate, getNewDate, getStartDate } from "@/lib/functions";
import { schema, type Pagination } from "@/schema";
import {
  getCreatedMessage,
  getPaginationData,
  getPaginationQuery,
  getSortingQuery,
  insensitiveMode,
  prismaExclude,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";
import { z } from "zod";
import { createTRPCRouter, ownerAdminProcedure, protectedProcedure } from "../trpc";
import { updateProductTotalTransactions, updateTotalSpending } from "./other";

const productTransactionSelect = {
  select: {
    ...prismaExclude("ProductTransaction", []),
    buyer: { select: { ...prismaExclude("User", ["credential"]), image: true } },
    products: { select: { ...prismaExclude("ProductOnTransaction", []), product: true } },
    paymentMethod: true,
  },
};

export const productTransactionRouter = createTRPCRouter({
  list: ownerAdminProcedure.input(schema.productTransaction.list).query(async ({ ctx, input }) => {
    const pagination: Pagination = { limit: input.limit, page: input.page };
    const whereQuery = {
      where: {
        transactionDate: {
          gte: input?.transactionDate && getStartDate(input.transactionDate),
          lte: input?.transactionDate && getEndDate(input.transactionDate),
        },
        totalPrice: { gte: input?.totalPrice },
        buyer: { fullName: { contains: input?.buyer && formatName(input?.buyer), ...insensitiveMode } },
        paymentMethod: { name: { contains: input?.paymentMethod, ...insensitiveMode } },
      },
    };

    const [data, totalData] = await ctx.db.$transaction([
      ctx.db.productTransaction.findMany({
        ...productTransactionSelect,
        ...getPaginationQuery(pagination),
        ...whereQuery,
        ...(input.sort ? getSortingQuery(input.sort) : { orderBy: { transactionDate: "desc" } }),
      }),
      ctx.db.productTransaction.count(whereQuery),
    ]);

    return { data, ...getPaginationData({ ...pagination, totalData }) };
  }),

  detail: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const data = await ctx.db.productTransaction.findFirst({ where: { id: input.id }, ...productTransactionSelect });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    return data;
  }),

  create: ownerAdminProcedure.input(schema.productTransaction.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.productTransaction.create({
      data: {
        totalPrice: input.products.reduce((sum, product) => {
          const productTotalPrice = product.quantity * product.unitPrice;
          return sum + productTotalPrice;
        }, 0),
        buyerId: input.buyerId,
        paymentMethodId: input.paymentMethodId,
        transactionDate: getNewDate(input.transactionDate),
      },
    });

    await ctx.db.productOnTransaction.createMany({
      data: input.products.map((e) => ({
        productId: e.productId,
        quantity: e.quantity,
        unitPrice: e.unitPrice,
        productTransactionId: data.id,
      })),
    });

    await updateTotalSpending(input.buyerId);
    await updateProductTotalTransactions(input.products.map((product) => product.productId));
    return THROW_OK("CREATED", getCreatedMessage("product transaction"));
  }),
});

// outputs
export type ProductTransactionList = RouterOutputs["productTransaction"]["list"];
export type ProductTransactionDetail = RouterOutputs["productTransaction"]["detail"];

// inputs
export type ProductTransactionInput = RouterInputs["productTransaction"]["create"];
export type ProductTransactionListInput = RouterInputs["productTransaction"]["list"];
