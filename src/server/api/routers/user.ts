import { formatName, getNewDate } from "@/lib/functions";
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
import { schema, type Pagination } from "@schema";
import { hash, verify } from "argon2";
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
  changePassword: protectedProcedure.input(schema.user.changePassword).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.user.findFirst({ where: { id: ctx.session.user.id } });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    const isOldPasswordValid = await verify(data.credential, input.oldPassword);
    if (!isOldPasswordValid) return THROW_TRPC_ERROR("BAD_REQUEST", "Old password is wrong.");
    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { credential: await hash(input.newPassword) },
    });
    return THROW_OK("OK", "Your password has been changed.");
  }),

  create: publicProcedure.input(schema.user.create).mutation(async ({ ctx, input }) => {
    const dataByEmail = await ctx.db.user.findFirst({ where: { email: input.email } });
    if (dataByEmail) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("user", "email"));

    const dataByPhoneNumber = await ctx.db.user.findUnique({ where: { phoneNumber: input.phoneNumber } });
    if (dataByPhoneNumber) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("user", "phone number"));

    const newData = await ctx.db.user.create({
      data: {
        role: input.role,
        email: input.email.toLowerCase(),
        fullName: formatName(input.fullName),
        phoneNumber: input.phoneNumber,
        gender: input.gender,
        credential: await hash(input.credential),
        birthDate: input.birthDate ? getNewDate(input.birthDate) : null,
        imageId: null,
        emailVerified: null,
        activeVisitId: null,
      },
    });

    return { ...THROW_OK("CREATED", getCreatedMessage("new visitor")), userId: newData.id };
  }),

  createVisitor: ownerAdminProcedure.input(schema.user.createVisitor).mutation(async ({ ctx, input }) => {
    const { visitorData } = input;

    if (visitorData.email) {
      const dataByEmail = await ctx.db.user.findFirst({ where: { email: visitorData.email } });
      if (dataByEmail) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("visitor", "email"));
    }

    const dataByPhoneNumber = await ctx.db.user.findUnique({ where: { phoneNumber: visitorData.phoneNumber } });
    if (dataByPhoneNumber) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("visitor", "phone number"));

    const newData = await ctx.db.user.create({
      data: {
        fullName: formatName(visitorData.fullName),
        email: visitorData?.email ? visitorData.email.toLowerCase() : null,
        phoneNumber: visitorData.phoneNumber,
        gender: visitorData.gender,
        credential: await hash(visitorData.phoneNumber),
        birthDate: visitorData.birthDate ? getNewDate(visitorData.birthDate) : null,
        imageId: null,
        emailVerified: null,
        activeVisitId: null,
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
    const data = await ctx.db.user.findFirst({ where: { id: userId } });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    await ctx.db.user.update({
      where: { id: userId },
      data: {
        fullName: formatName(input.body.fullName),
        phoneNumber: body.phoneNumber,
        birthDate: getNewDate(body.birthDate),
        email: body.email,
        gender: body.gender,
      },
    });
    return THROW_OK("OK", "Your profile has been updated.");
  }),

  list: ownerProcedure.input(schema.user.list).query(async ({ ctx, input }) => {
    const pagination: Pagination = { limit: input.limit, page: input.page };

    const whereQuery = {
      where: {
        isActive: true,
        role: input?.role,
        OR: input?.search
          ? [
              { phoneNumber: { contains: input?.search } },
              { fullName: { contains: input?.search && formatName(input?.search), ...insensitiveMode } },
              { email: { contains: input?.search, ...insensitiveMode } },
            ]
          : undefined,
        phoneNumber: { contains: input?.phoneNumber },
        email: { contains: input?.email, ...insensitiveMode },
        gender: input?.gender,
        fullName: { contains: input?.fullName && formatName(input?.fullName), ...insensitiveMode },
        totalSpending: { gte: input?.totalSpending },
      },
    };

    const [data, totalData] = await ctx.db.$transaction([
      ctx.db.user.findMany({
        ...getSortingQuery(input.sort),
        ...(input.pagination && getPaginationQuery(pagination)),
        ...whereQuery,
        ...userSelect,
      }),
      ctx.db.user.count(whereQuery),
    ]);

    return { data, ...(input.pagination && getPaginationData({ ...pagination, totalData })) };
  }),
});

// outputs
export type User = RouterOutputs["user"]["detail"];
export type UserList = RouterOutputs["user"]["list"];
export type UserListData = RouterOutputs["user"]["list"]["data"];
export type UserCreateVisitor = RouterOutputs["user"]["createVisitor"];

// inputs
export type UserCreateInput = RouterInputs["user"]["create"];
export type UserCreateVisitorInput = RouterInputs["user"]["createVisitor"];
export type UserUpdateInput = RouterInputs["user"]["update"];
export type UserListInput = RouterInputs["user"]["list"];
export type UserChangePasswordInput = RouterInputs["user"]["changePassword"];
