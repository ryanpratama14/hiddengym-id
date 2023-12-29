import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import {
  getConflictMessage,
  getCreatedMessage,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";
import { z } from "zod";

export const productRouter = createTRPCRouter({
  create: ownerProcedure.input(schema.product.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.product.findFirst({ where: { name: input.name } });
    if (data) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("product", "name"));
    await ctx.db.product.create({ data: { name: input.name, price: input.price } });
    return THROW_OK("CREATED", getCreatedMessage("product"));
  }),

  list: ownerProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.product.findMany();
    return data;
  }),

  detail: ownerProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.product.findFirst({ where: { id: input.id } });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    return data;
  }),
});

// outputs
export type ProductList = RouterOutputs["product"]["list"];
export type ProductDetail = RouterOutputs["product"]["detail"];

// inputs
export type ProductCreateInput = RouterInputs["product"]["create"];
export type ProductDetailInput = RouterInputs["product"]["detail"];
