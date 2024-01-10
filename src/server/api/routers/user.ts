import { formatName, formatPhoneNumber, getNewDate } from "@/lib/functions";
import { schema, type Pagination } from "@/schema";
import { createTRPCRouter, ownerAdminProcedure, ownerProcedure, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import {
  getConflictMessage,
  getCreatedMessage,
  getPaginationData,
  getPaginationQuery,
  getSortingQuery,
  insensitiveMode,
  prismaExclude,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";
import { hash } from "argon2";
import { z } from "zod";

const userSelect = {
  select: {
    ...prismaExclude("User", ["credential"]),
    image: true,
    packageTransactions: true,
    productTransactions: true,
    totalSpending: true,
    totalSpendingPackage: true,
    totalSpendingProduct: true,
    visits: true,
    schedules: true,
    files: true,
    trainerSports: true,
    trainerPackages: true,
    trainerSchedules: true,
  },
};

export const userRouter = createTRPCRouter({
  create: publicProcedure.input(schema.user.create).mutation(async ({ ctx, input }) => {
    const dataByEmail = await ctx.db.user.findFirst({ where: { email: input.email } });
    if (dataByEmail) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("user", "email"));

    const dataByPhoneNumber = await ctx.db.user.findUnique({ where: { phoneNumber: formatPhoneNumber(input.phoneNumber) } });
    if (dataByPhoneNumber) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("user", "phone number"));

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
    const { visitorData } = input;

    if (visitorData.email) {
      const dataByEmail = await ctx.db.user.findFirst({ where: { email: visitorData.email } });
      if (dataByEmail) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("visitor", "email"));
    }

    const dataByPhoneNumber = await ctx.db.user.findUnique({ where: { phoneNumber: formatPhoneNumber(visitorData.phoneNumber) } });
    if (dataByPhoneNumber) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("visitor", "phone number"));

    const newData = await ctx.db.user.create({
      data: {
        fullName: formatName(visitorData.fullName),
        email: visitorData?.email ? visitorData.email.toLowerCase() : null,
        phoneNumber: formatPhoneNumber(visitorData.phoneNumber),
        gender: visitorData.gender,
        credential: await hash(visitorData.phoneNumber),
        birthDate: visitorData.birthDate ? getNewDate(visitorData.birthDate) : null,
      },
    });

    return { ...THROW_OK("CREATED", getCreatedMessage("new visitor")), visitorId: newData.id };
  }),

  detail: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const data = await ctx.db.user.findUnique({ where: { id: input.id }, ...userSelect });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    return data;
  }),

  detailMe: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id }, ...userSelect });
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
    return THROW_OK("OK", "Your profile has been updated.");
  }),

  listTrainer: ownerProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.user.findMany({ where: { role: "TRAINER" }, ...userSelect });
    return data;
  }),

  listVisitor: ownerProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({ where: { role: "VISITOR" }, select: prismaExclude("User", ["credential"]) });
  }),

  list: ownerProcedure.input(schema.user.list).query(async ({ ctx, input }) => {
    const pagination: Pagination = { limit: input.limit, page: input.page };

    const whereQuery = {
      where: {
        role: input?.role,
        isActive: true,
        phoneNumber: { contains: input?.phoneNumber },
        email: { contains: input?.email, ...insensitiveMode },
        gender: input?.gender,
        fullName: { contains: input?.fullName && formatName(input?.fullName), ...insensitiveMode },
        totalSpending: { gte: input?.totalSpending },
      },
    };

    const [data, totalData] = await ctx.db.$transaction([
      ctx.db.user.findMany({ ...getSortingQuery(input.sorting), ...getPaginationQuery(pagination), ...whereQuery, ...userSelect }),
      ctx.db.user.count(whereQuery),
    ]);

    return { data, ...getPaginationData({ ...pagination, totalData }) };
  }),
});

// outputs
export type User = RouterOutputs["user"]["detail"];
export type UserList = RouterOutputs["user"]["list"];
export type UserListVisitor = RouterOutputs["user"]["listVisitor"];
export type UserListData = RouterOutputs["user"]["list"]["data"];
export type UserListTrainer = RouterOutputs["user"]["listTrainer"];
export type UserCreateVisitor = RouterOutputs["user"]["createVisitor"];

// inputs
export type UserCreateInput = RouterInputs["user"]["create"];
export type UserCreateVisitorInput = RouterInputs["user"]["createVisitor"];
export type UserUpdateInput = RouterInputs["user"]["update"];
export type UserListInput = RouterInputs["user"]["list"];
