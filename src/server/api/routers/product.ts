import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import {
  getConflictMessage,
  getCreatedMessage,
  getUpdatedMessage,
  insensitiveMode,
  prismaExclude,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";
import { z } from "zod";

const productSelect = {
  select: {
    ...prismaExclude("Product", []),
    transactions: {
      select: {
        ...prismaExclude("ProductOnTransaction", []),
        productTransaction: { select: { ...prismaExclude("ProductTransaction", []), buyer: true } },
      },
    },
  },
};

export const productRouter = createTRPCRouter({
  create: ownerProcedure.input(schema.product.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.product.findFirst({ where: { name: input.name } });
    if (data) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("product", "name"));
    await ctx.db.product.create({ data: { name: input.name, price: input.price } });
    return THROW_OK("CREATED", getCreatedMessage("product"));
  }),

  update: ownerProcedure.input(schema.product.update).mutation(async ({ ctx, input }) => {
    const { body, id } = input;
    const data = await ctx.db.product.findFirst({ where: { id } });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    await ctx.db.product.update({ where: { id }, data: { name: body.name, price: body.price } });
    return THROW_OK("OK", getUpdatedMessage("product"));
  }),

  list: ownerProcedure.input(schema.product.list).query(async ({ ctx, input }) => {
    const data = await ctx.db.product.findMany({
      ...productSelect,
      where: {
        name: { contains: input.name, ...insensitiveMode },
        price: { gte: input.price },
        totalTransactions: { gte: input.totalTransactions },
      },
      orderBy: input.price ? { price: "asc" } : { name: "asc" },
    });

    return data;
  }),

  detail: ownerProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.product.findFirst({ where: { id: input.id }, ...productSelect });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    return data;
  }),
});

// outputs
export type ProductList = RouterOutputs["product"]["list"];
export type ProductDetail = RouterOutputs["product"]["detail"];

// inputs
export type ProductCreateInput = RouterInputs["product"]["create"];
export type ProductUpdateInput = RouterInputs["product"]["update"];
export type ProductDetailInput = RouterInputs["product"]["detail"];
