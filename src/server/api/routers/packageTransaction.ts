import { formatName, getEndDate, getExpiryDate, getNewDate, getStartDate } from "@/lib/functions";
import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure, protectedProcedure } from "@/server/api/trpc";
import {
  getCreatedMessage,
  getPagination,
  getPaginationData,
  getSortingQuery,
  insensitiveMode,
  prismaExclude,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";
import { type NonUndefined } from "react-hook-form";
import { z } from "zod";
import { updateTotalSpending } from "./other";

const packageTransactionSelect = {
  select: {
    ...prismaExclude("PackageTransaction", []),
    buyer: {
      select: { ...prismaExclude("User", ["credential"]), image: true },
    },
    package: { select: { ...prismaExclude("Package", []) } },
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
        ...(params?.promoCodeCode ? { promoCode: { code: { contains: params?.promoCodeCode, ...insensitiveMode } } } : undefined),
        buyer: { fullName: { contains: params?.buyer && formatName(params?.buyer), ...insensitiveMode } },
        package: { name: { contains: params?.package, ...insensitiveMode }, type: params?.packageType },
        paymentMethod: { name: { contains: params?.paymentMethod, ...insensitiveMode } },
        totalPrice: { gte: params?.totalPrice },
        transactionDate: {
          gte: params?.transactionDate && getStartDate(params.transactionDate),
          lte: params?.transactionDate && getEndDate(params.transactionDate),
        },
      },
    };

    const [data, totalData] = await ctx.db.$transaction([
      ctx.db.packageTransaction.findMany({
        ...getPagination(pagination),
        ...packageTransactionSelect,
        ...whereQuery,
        orderBy: sorting ? getSortingQuery(sorting).orderBy : { transactionDate: "desc" },
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

    if (!selectedPackage) return THROW_TRPC_ERROR("NOT_FOUND");

    const isSessions = selectedPackage.type === "SESSIONS";

    await ctx.db.packageTransaction.create({
      data: {
        totalPrice: promoCode ? selectedPackage.price - promoCode.discountPrice : selectedPackage.price,
        startDate: selectedPackage.validityInDays ? getStartDate(input.transactionDate) : null,
        expiryDate: selectedPackage.validityInDays
          ? getExpiryDate({ days: selectedPackage.validityInDays, dateString: input.transactionDate })
          : null,
        remainingSessions: isSessions && selectedPackage.approvedSessions ? selectedPackage.approvedSessions : null,
        transactionDate: getNewDate(input.transactionDate),
        paymentMethodId: input.paymentMethodId,
        packageId: input.packageId,
        buyerId: input.buyerId,
        promoCodeId: promoCode?.id ? promoCode.id : null,
      },
    });

    await updateTotalSpending(input.buyerId);
    return THROW_OK("CREATED", getCreatedMessage("package transaction"));
  }),
});

// outputs
export type PackageTransactionList = RouterOutputs["packageTransaction"]["list"];
export type PackageTransactionDetail = RouterOutputs["packageTransaction"]["detail"];

// inputs
export type PackageTransactionCreateInput = RouterInputs["packageTransaction"]["create"];
export type PackageTransactionListInputParams = NonUndefined<RouterInputs["packageTransaction"]["list"]["params"]>;
export type PackageTransactionListInput = RouterInputs["packageTransaction"]["list"];
