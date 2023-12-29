import {
  accumulateValue,
  formatName,
  formatPhoneNumber,
  getExpiryDateFromDate,
  getLocalDate,
  getNewDate,
  getStartDate,
} from "@/lib/utils";
import { schema } from "@/schema";
import { createTRPCRouter, ownerAdminProcedure, ownerProcedure, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import {
  getPagination,
  getPaginationData,
  getSortingQuery,
  insensitiveMode,
  prismaExclude,
  THROW_ERROR,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";
import { hash } from "argon2";
import { z } from "zod";

const userSelect = {
  select: {
    ...prismaExclude("User", ["credential", "scheduleIDs", "trainerPackageIDs", "trainerSportIDs"]),
    image: true,
    packageTransactions: true,
    productTransactions: true,
    // visits: true,
    // schedules: true,
    // files: true,
    // trainerSports: true,
    // trainerPackages: true,
    // trainerSchedules: true,
  },
};

export const userRouter = createTRPCRouter({
  create: publicProcedure.input(schema.user.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.user.findFirst({ where: { email: input.email } });
    if (data) return THROW_ERROR("CONFLICT");
    await ctx.db.user.create({
      data: {
        email: input.email.toLowerCase(),
        fullName: formatName(input.fullName),
        phoneNumber: formatPhoneNumber(input.phoneNumber),
        gender: input.gender,
        credential: await hash(input.credential),
        birthDate: input.birthDate && getNewDate(input.birthDate),
      },
    });
    return THROW_OK("CREATED");
  }),

  createVisitor: ownerAdminProcedure.input(schema.user.createVisitor).mutation(async ({ ctx, input }) => {
    const { packageData, visitorData } = input;
    const data = await ctx.db.user.findUnique({ where: { phoneNumber: visitorData.phoneNumber } });
    if (data) return THROW_ERROR("CONFLICT");

    if (visitorData.email) {
      const data = await ctx.db.user.findFirst({ where: { email: visitorData.email } });
      if (data) return THROW_ERROR("CONFLICT");
    }

    const newVisitor = await ctx.db.user.create({
      data: {
        fullName: formatName(visitorData.fullName),
        email: visitorData?.email ? visitorData.email.toLowerCase() : null,
        phoneNumber: formatPhoneNumber(visitorData.phoneNumber),
        gender: visitorData.gender,
        credential: await hash(visitorData.phoneNumber),
      },
    });

    if (packageData) {
      const selectedPackage = await ctx.db.package.findFirst({ where: { id: packageData.packageId } });
      const promoCode = input?.packageData?.promoCodeId
        ? await ctx.db.promoCode.findFirst({ where: { id: input.packageData.promoCodeId } })
        : null;

      if (selectedPackage) {
        const isSessions = selectedPackage.type === "SESSIONS";

        await ctx.db.packageTransaction.create({
          data: {
            totalPrice: promoCode ? selectedPackage.price - promoCode.discountPrice : selectedPackage.price,
            startDate: selectedPackage.type !== "SESSIONS" ? getStartDate(packageData.transactionDate) : null,
            expiryDate:
              selectedPackage.validityInDays && !isSessions
                ? getExpiryDateFromDate({
                    days: selectedPackage.validityInDays,
                    isVisit: selectedPackage.type === "VISIT",
                    dateString: packageData.transactionDate,
                  })
                : null,
            remainingPermittedSessions:
              isSessions && selectedPackage.totalPermittedSessions ? selectedPackage.totalPermittedSessions : null,
            transactionDate: getLocalDate(packageData.transactionDate),
            paymentMethodId: packageData.paymentMethodId,
            packageId: selectedPackage.id,
            buyerId: newVisitor.id,
            promoCodeId: promoCode?.id ? promoCode.id : null,
          },
        });
      }
    }

    return THROW_OK("CREATED");
  }),

  detail: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const data = await ctx.db.user.findUnique({
      where: { id: input.id },
      ...userSelect,
    });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    return data;
  }),

  detailMe: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      ...userSelect,
    });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    return data;
  }),

  update: protectedProcedure.input(schema.user.update).mutation(async ({ ctx, input }) => {
    const { body, userId } = input;
    await ctx.db.user.update({
      where: { id: userId },
      data: {
        fullName: formatName(input.body.fullName),
        phoneNumber: formatPhoneNumber(body.phoneNumber),
        birthDate: getNewDate(body.birthDate),
        email: body.email,
        gender: body.gender,
      },
    });
    return THROW_OK("OK");
  }),

  listTrainer: ownerProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.user.findMany({ where: { role: "TRAINER" }, ...userSelect });
    return data;
  }),

  listVisitor: ownerProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({ where: { role: "VISITOR" }, select: prismaExclude("User", ["credential"]) });
  }),

  list: ownerProcedure.input(schema.user.list).query(async ({ ctx, input }) => {
    const { pagination, params, sorting } = input;

    const whereQuery = {
      where: {
        role: params?.role,
        isActive: true,
        phoneNumber: { contains: params?.phoneNumber },
        email: { contains: params?.email, ...insensitiveMode },
        gender: params?.gender,
        fullName: { contains: params?.fullName && formatName(params?.fullName), ...insensitiveMode },
      },
    };

    const [data, totalData] = await ctx.db.$transaction([
      ctx.db.user.findMany({
        ...getSortingQuery(sorting),
        ...(!params.totalSpending && getPagination(pagination)),
        ...whereQuery,
        ...userSelect,
      }),
      ctx.db.user.count(whereQuery),
    ]);

    const updatedData = data
      .map((user) => ({
        ...user,
        spending: {
          package: accumulateValue(user.packageTransactions, "totalPrice"),
          product: accumulateValue(user.productTransactions, "totalPrice"),
          total: accumulateValue(user.packageTransactions, "totalPrice") + accumulateValue(user.productTransactions, "totalPrice"),
        },
      }))
      .filter((user) => user.spending.total >= params.totalSpending);

    if (params.totalSpending) {
      updatedData.sort((a, b) => a.spending.total - b.spending.total);
    }

    return {
      data: updatedData,
      ...getPaginationData({ page: pagination.page, limit: pagination.limit, totalData }),
    };
  }),
});

// outputs
export type User = RouterOutputs["user"]["detail"];
export type UserList = RouterOutputs["user"]["list"];
export type UserListVisitor = RouterOutputs["user"]["listVisitor"];
export type UserListData = RouterOutputs["user"]["list"]["data"];
export type UserListTrainer = RouterOutputs["user"]["listTrainer"];

// inputs
export type UserCreateInput = RouterInputs["user"]["create"];
export type UserCreateVisitorInput = RouterInputs["user"]["createVisitor"];
export type UserUpdateInput = RouterInputs["user"]["update"];
export type UserListInput = RouterInputs["user"]["list"];
export type UserListInputParams = RouterInputs["user"]["list"]["params"];
