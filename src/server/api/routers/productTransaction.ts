import { formatName, getEndDate, getNewDate, getStartDate } from "@/lib/functions";
import {
  getCreatedMessage,
  getDeletedMessage,
  getPaginationData,
  getPaginationQuery,
  getSortingQuery,
  getUpdatedMessage,
  insensitiveMode,
  prismaExclude,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";
import { schema, type Pagination } from "@schema";
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
        ...(input.pagination && getPaginationQuery(pagination)),
        ...whereQuery,
        ...(input.sort ? getSortingQuery(input.sort) : { orderBy: { transactionDate: "desc" } }),
      }),
      ctx.db.productTransaction.count(whereQuery),
    ]);

    return { data, ...(input.pagination && getPaginationData({ ...pagination, totalData })) };
  }),

  detail: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const data = await ctx.db.productTransaction.findFirst({ where: { id: input.id }, ...productTransactionSelect });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    return data;
  }),

  create: ownerAdminProcedure.input(schema.productTransaction.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.productTransaction.create({
      data: {
        totalPrice: input.products.reduce((sum, product) => sum + product.quantity * product.unitPrice, 0),
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

  update: ownerAdminProcedure.input(schema.productTransaction.update).mutation(async ({ ctx, input }) => {
    const { id, body } = input;
    const data = await ctx.db.productTransaction.findFirst({ where: { id }, ...productTransactionSelect });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");

    for (const product of body.products) {
      const updatedData = {
        data: { productId: product.productId, quantity: product.quantity, unitPrice: product.unitPrice, productTransactionId: id },
      };
      const productOnTransaction = await ctx.db.productOnTransaction.findFirst({
        where: { productTransactionId: id, productId: product.productId },
      });

      if (productOnTransaction) {
        await ctx.db.productOnTransaction.update({ where: { id: productOnTransaction.id }, ...updatedData });
      } else {
        await ctx.db.productOnTransaction.create({ ...updatedData });
      }
    }

    for (const productOnTransactionIDs of data.products
      .filter((existingProduct) => !body.products.some((newProduct) => newProduct.productId === existingProduct.productId))
      .map((e) => e.id)) {
      await ctx.db.productOnTransaction.delete({ where: { id: productOnTransactionIDs } });
    }

    await ctx.db.productTransaction.update({
      where: { id },
      data: {
        totalPrice: body.products.reduce((sum, product) => sum + product.quantity * product.unitPrice, 0),
        buyerId: body.buyerId,
        paymentMethodId: body.paymentMethodId,
        transactionDate: getNewDate(body.transactionDate),
      },
    });

    await updateTotalSpending(data.buyerId);
    await updateProductTotalTransactions(body.products.map((product) => product.productId));
    return THROW_OK("OK", getUpdatedMessage("product transaction"));
  }),

  delete: ownerAdminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.productTransaction.findFirst({ where: { id: input.id }, ...productTransactionSelect });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    for (const id of data.products.map((e) => e.id)) {
      await ctx.db.productOnTransaction.delete({ where: { id } });
    }
    await ctx.db.productTransaction.delete({ where: { id: input.id } });
    await updateTotalSpending(data.buyerId);
    await updateProductTotalTransactions(data.products.map((product) => product.productId));
    return THROW_OK("OK", getDeletedMessage("product transaction"));
  }),
});

// outputs
export type ProductTransactionList = RouterOutputs["productTransaction"]["list"];
export type ProductTransactionDetail = RouterOutputs["productTransaction"]["detail"];

// inputs
export type ProductTransactionCreateInput = RouterInputs["productTransaction"]["create"];
export type ProductTransactionUpdateInput = RouterInputs["productTransaction"]["update"];
export type ProductTransactionListInput = RouterInputs["productTransaction"]["list"];
