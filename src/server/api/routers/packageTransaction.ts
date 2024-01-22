import { formatName, getEndDate, getExpiryDate, getNewDate, getStartDate } from "@/lib/functions";
import { schema, type Pagination } from "@/schema";
import { createTRPCRouter, ownerProcedure, protectedProcedure } from "@/server/api/trpc";
import {
  getCreatedMessage,
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
import { z } from "zod";
import { updatePackageTotalTransactions, updateTotalSpending } from "./other";

const packageTransactionSelect = {
  select: {
    ...prismaExclude("PackageTransaction", []),
    buyer: { select: { ...prismaExclude("User", ["credential"]), image: true } },
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
    const pagination: Pagination = { limit: input.limit, page: input.page };

    const whereQuery = {
      where: {
        ...(input?.promoCodeCode ? { promoCode: { code: { contains: input?.promoCodeCode, ...insensitiveMode } } } : undefined),
        buyer: { fullName: { contains: input?.buyer && formatName(input?.buyer), ...insensitiveMode } },
        package: { name: { contains: input?.package, ...insensitiveMode }, type: input?.packageType },
        paymentMethod: { name: { contains: input?.paymentMethod, ...insensitiveMode } },
        totalPrice: { gte: input?.totalPrice },
        transactionDate: {
          gte: input?.transactionDate && getStartDate(input.transactionDate),
          lte: input?.transactionDate && getEndDate(input.transactionDate),
        },
      },
    };

    const [data, totalData] = await ctx.db.$transaction([
      ctx.db.packageTransaction.findMany({
        ...(input.pagination && getPaginationQuery(pagination)),
        ...packageTransactionSelect,
        ...whereQuery,
        ...(input.sort ? getSortingQuery(input.sort) : { orderBy: { transactionDate: "desc" } }),
      }),
      ctx.db.packageTransaction.count(whereQuery),
    ]);

    return { data, ...(input.pagination && getPaginationData({ ...pagination, totalData })) };
  }),

  create: ownerProcedure.input(schema.packageTransaction.create).mutation(async ({ ctx, input }) => {
    const selectedPackage = await ctx.db.package.findFirst({ where: { id: input.packageId } });
    const promoCode = input?.promoCodeId ? await ctx.db.promoCode.findFirst({ where: { id: input.promoCodeId } }) : null;

    if (!selectedPackage) return THROW_TRPC_ERROR("NOT_FOUND");

    const isSessions = selectedPackage.type === "SESSIONS";

    await ctx.db.packageTransaction.create({
      data: {
        unitPrice: input.unitPrice,
        discountPrice: promoCode?.discountPrice ? promoCode.discountPrice : null,
        totalPrice: promoCode ? input.unitPrice - promoCode.discountPrice : input.unitPrice,
        startDate: getStartDate(input.startDate),
        expiryDate: getExpiryDate({ days: selectedPackage.validityInDays, dateString: input.startDate }),
        remainingSessions: isSessions && selectedPackage.approvedSessions ? selectedPackage.approvedSessions : null,
        transactionDate: getNewDate(input.transactionDate),
        paymentMethodId: input.paymentMethodId,
        packageId: input.packageId,
        buyerId: input.buyerId,
        promoCodeId: promoCode?.id ? promoCode.id : null,
      },
    });

    await updateTotalSpending(input.buyerId);
    await updatePackageTotalTransactions(selectedPackage.id);
    return THROW_OK("CREATED", getCreatedMessage("package transaction"));
  }),

  update: ownerProcedure.input(schema.packageTransaction.update).mutation(async ({ input, ctx }) => {
    const { body, id } = input;
    const data = await ctx.db.packageTransaction.findFirst({ where: { id }, ...packageTransactionSelect });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    const selectedPackage = await ctx.db.package.findFirst({ where: { id: body.packageId } });
    if (!selectedPackage) return THROW_TRPC_ERROR("NOT_FOUND");

    const promoCode = body?.promoCodeId ? await ctx.db.promoCode.findFirst({ where: { id: body.promoCodeId } }) : null;

    const isSessions = selectedPackage.type === "SESSIONS";

    await ctx.db.packageTransaction.update({
      where: { id },
      data: {
        unitPrice: body.unitPrice,
        discountPrice: promoCode?.discountPrice ? promoCode.discountPrice : null,
        totalPrice: promoCode ? body.unitPrice - promoCode.discountPrice : body.unitPrice,
        startDate: getStartDate(body.startDate),
        expiryDate: getExpiryDate({ days: selectedPackage.validityInDays, dateString: body.startDate }),
        remainingSessions: isSessions && selectedPackage.approvedSessions ? selectedPackage.approvedSessions : null,
        transactionDate: getNewDate(body.transactionDate),
        paymentMethodId: body.paymentMethodId,
        packageId: body.packageId,
        buyerId: body.buyerId,
        promoCodeId: promoCode?.id ? promoCode.id : null,
      },
    });

    await updateTotalSpending(body.buyerId);
    return THROW_OK("OK", getUpdatedMessage("package transaction"));
  }),
});

// outputs
export type PackageTransactionList = RouterOutputs["packageTransaction"]["list"];
export type PackageTransactionDetail = RouterOutputs["packageTransaction"]["detail"];

// inputs
export type PackageTransactionCreateInput = RouterInputs["packageTransaction"]["create"];
export type PackageTransactionUpdateInput = RouterInputs["packageTransaction"]["update"];
export type PackageTransactionListInput = RouterInputs["packageTransaction"]["list"];
