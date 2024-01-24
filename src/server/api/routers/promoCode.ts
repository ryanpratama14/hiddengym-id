import { formatDateShort, getUserAge } from "@/lib/functions";
import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import {
  getConflictMessage,
  getCreatedMessage,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";
import { schema } from "@schema";
import { z } from "zod";

export const promoCodeRouter = createTRPCRouter({
  create: ownerProcedure.input(schema.promoCode.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.promoCode.findUnique({ where: { code: input.code } });
    if (data) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("promo code", "code"));
    await ctx.db.promoCode.create({ data: { code: input.code, discountPrice: input.discountPrice, type: input.type } });
    return THROW_OK("CREATED", getCreatedMessage("promo code"));
  }),

  list: ownerProcedure.query(async ({ ctx }) => await ctx.db.promoCode.findMany()),

  checkPromoCode: ownerProcedure
    .input(z.object({ code: z.string(), birthDate: z.date().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.promoCode.findFirst({ where: { code: input.code } });
      if (!data || !data.isActive) return THROW_TRPC_ERROR("NOT_FOUND", "Promo code is expired or doesn't exist.");

      if (data.type === "STUDENT") {
        if (!input.birthDate) return THROW_TRPC_ERROR("FORBIDDEN", "Not eligible to use this promo code.\nNo birth date set.");
        if (getUserAge(input.birthDate) > 22)
          return THROW_TRPC_ERROR(
            "FORBIDDEN",
            `Not eligible to use this promo code.${`\nDate of birth: ${formatDateShort({ date: input.birthDate })}.\nAge: ${getUserAge(
              input.birthDate,
            )}.`}
        `,
          );
      }

      return { data, ...THROW_OK("OK", "Promo code applied.") };
    }),

  detail: ownerProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.promoCode.findFirst({ where: { id: input.id } });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    return data;
  }),
});

// outputs
export type PromoCodeList = RouterOutputs["promoCode"]["list"];
export type PromoCodeCheck = RouterOutputs["promoCode"]["checkPromoCode"];

// inputs
export type PromoCodeCreateInput = RouterInputs["promoCode"]["create"];
export type PromoCodeCheckInput = RouterInputs["promoCode"]["checkPromoCode"];
