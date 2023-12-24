import { formatName, formatPhoneNumber, getNewDate } from "@/lib/utils";
import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import {
  type RouterInputs,
  type RouterOutputs,
  THROW_OK,
  THROW_TRPC_ERROR,
  prismaExclude,
  getPagination,
  getPaginationData,
  insensitiveMode,
  getSortingQuery,
} from "@/trpc/shared";
import { hash } from "argon2";
import { z } from "zod";

const userSelect = {
  select: {
    ...prismaExclude("User", ["credential", "scheduleIDs", "trainerPackageIDs", "trainerSportIDs"]),
    image: true,
    // packageTransactions: true,
    // productTransactions: true,
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
    if (data) return THROW_TRPC_ERROR("CONFLICT");
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

  createVisitor: publicProcedure.input(schema.user.createVisitor).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.user.findUnique({ where: { phoneNumber: input.phoneNumber } });
    if (data) return THROW_TRPC_ERROR("CONFLICT");
    await ctx.db.user.create({
      data: {
        fullName: formatName(input.fullName),
        email: input?.email ? input.email.toLowerCase() : null,
        phoneNumber: formatPhoneNumber(input.phoneNumber),
        gender: input.gender,
        credential: await hash(input.phoneNumber),
      },
    });
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
        ...getPagination(pagination),
        ...whereQuery,
        ...userSelect,
      }),
      ctx.db.user.count(whereQuery),
    ]);

    return {
      data,
      ...getPaginationData({ page: pagination.page, limit: pagination.limit, totalData }),
    };
  }),
});

// outputs
export type User = RouterOutputs["user"]["detail"];
export type UserList = RouterOutputs["user"]["list"];
export type UserListData = RouterOutputs["user"]["list"]["data"];

// inputs
export type UserCreateInput = RouterInputs["user"]["create"];
export type UserCreateVisitorInput = RouterInputs["user"]["createVisitor"];
export type UserUpdateInput = RouterInputs["user"]["update"];
export type UserListInput = RouterInputs["user"]["list"];
export type UserListInputParams = RouterInputs["user"]["list"]["params"];
