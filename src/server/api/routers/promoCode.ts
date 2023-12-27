import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import { THROW_ERROR, THROW_OK, THROW_TRPC_ERROR, type RouterInputs, type RouterOutputs } from "@/trpc/shared";
import { z } from "zod";

export const promoCodeRouter = createTRPCRouter({
  create: ownerProcedure.input(schema.promoCode.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.promoCode.findFirst({ where: { code: input.code } });
    if (data) return THROW_ERROR("CONFLICT");
    await ctx.db.promoCode.create({ data: { code: input.code, discountPrice: input.discountPrice } });
    return THROW_OK("CREATED");
  }),

  list: ownerProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.promoCode.findMany();
    return data;
  }),

  detail: ownerProcedure.input(z.object({ code: z.string() })).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.promoCode.findFirst({ where: { code: input.code } });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    if (!data.isActive) return THROW_TRPC_ERROR("FORBIDDEN");
    return data;
  }),
});

// outputs
export type PromoCodeList = RouterOutputs["promoCode"]["list"];
export type PromoCodeDetail = RouterOutputs["promoCode"]["detail"];

// inputs
export type PromoCodeCreateInput = RouterInputs["promoCode"]["create"];
export type PromoCodeDetailInput = RouterInputs["promoCode"]["detail"];
