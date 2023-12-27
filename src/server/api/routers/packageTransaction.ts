import { getExpiryDateFromDate, getStartDate } from "@/lib/utils";
import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import { THROW_TRPC_ERROR, type RouterInputs, type RouterOutputs } from "@/trpc/shared";

export const packageTransactionRouter = createTRPCRouter({
  list: ownerProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.packageTransaction.findMany();
    return data;
  }),

  create: ownerProcedure.input(schema.packageTransaction.create).mutation(async ({ ctx, input }) => {
    const selectedPackage = await ctx.db.package.findFirst({ where: { id: input.packageId } });
    const promoCode = input?.promoCodeCode ? await ctx.db.promoCode.findFirst({ where: { code: input.promoCodeCode } }) : null;

    if (!selectedPackage) return THROW_TRPC_ERROR("NOT_FOUND");

    await ctx.db.packageTransaction.create({
      data: {
        totalPrice: promoCode ? selectedPackage.price - promoCode.discountPrice : selectedPackage.price,
        startDate: input.transactionDate ? getStartDate(input.transactionDate) : null,
        expiryDate: selectedPackage.validityInDays
          ? getExpiryDateFromDate({
              days: selectedPackage.validityInDays,
              isVisit: selectedPackage.type === "VISIT",
              dateString: input.transactionDate,
            })
          : null,
        remainingPermittedSessions: selectedPackage.totalPermittedSessions,
        transactionDate: getStartDate(input.transactionDate),
        paymentMethodId: input.paymentMethodId,
        packageId: input.packageId,
        buyerId: input.buyerId,
        promoCodeId: promoCode?.id ? promoCode.id : null,
      },
    });
  }),
});

// outputs
export type PackageTransactionList = RouterOutputs["packageTransaction"]["list"];

// inputs
export type PackageTransactionCreateInput = RouterInputs["packageTransaction"]["create"];
