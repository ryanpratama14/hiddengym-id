import { getExpiryDateFromDate, getStartDate } from "@/lib/utils";
import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure, protectedProcedure } from "@/server/api/trpc";
import {
  getPagination,
  getPaginationData,
  prismaExclude,
  THROW_ERROR,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";
import { z } from "zod";

const packageTransactionSelect = {
  select: {
    ...prismaExclude("PackageTransaction", []),
    buyer: true,
    package: true,
    promoCode: true,
    paymentMethod: true,
  },
};

export const packageTransactionRouter = createTRPCRouter({
  detail: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const data = await ctx.db.packageTransaction.findFirst({ where: { id: input.id }, ...packageTransactionSelect });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    return data;
  }),

  list: ownerProcedure.input(schema.packageTransaction.list).query(async ({ ctx, input }) => {
    const { pagination, params, sorting } = input;

    const whereQuery = {
      where: {
        buyer: { fullName: { contains: params?.buyer } },
        package: { name: { contains: params?.package }, type: params?.pacageType },
        paymentMethod: { name: { contains: params?.paymentMethod } },
        promoCodeId: params?.withPromoCode ? { not: null } : undefined,
      },
    };

    const [data, totalData] = await ctx.db.$transaction([
      ctx.db.packageTransaction.findMany({
        ...getPagination(pagination),
        ...packageTransactionSelect,
        ...whereQuery,
        orderBy: [{ transactionDate: "desc" }],
      }),
      ctx.db.packageTransaction.count(whereQuery),
    ]);

    return {
      data,
      ...getPaginationData({ page: pagination.page, limit: pagination.limit, totalData }),
    };
  }),

  create: ownerProcedure.input(schema.packageTransaction.create).mutation(async ({ ctx, input }) => {
    const selectedPackage = await ctx.db.package.findFirst({ where: { id: input.packageId } });
    const promoCode = input?.promoCodeId ? await ctx.db.promoCode.findFirst({ where: { id: input.promoCodeId } }) : null;

    if (!selectedPackage) return THROW_ERROR("NOT_FOUND");

    await ctx.db.packageTransaction.create({
      data: {
        totalPrice: promoCode ? selectedPackage.price - promoCode.discountPrice : selectedPackage.price,
        startDate: input.transactionDate && selectedPackage.type !== "TRAINER" ? getStartDate(input.transactionDate) : null,
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

    return THROW_OK("CREATED");
  }),
});

// outputs
export type PackageTransactionList = RouterOutputs["packageTransaction"]["list"];
export type PackageTransactionDetail = RouterOutputs["packageTransaction"]["detail"];

// inputs
export type PackageTransactionCreateInput = RouterInputs["packageTransaction"]["create"];
export type PackageTransactionListInput = RouterInputs["packageTransaction"]["list"];
