import { createTRPCRouter, ownerProcedure, publicProcedure } from "@/server/api/trpc";
import {
  type RouterInputs,
  type RouterOutputs,
  THROW_OK,
  THROW_TRPC_ERROR,
  getConflictMessage,
  getCreatedMessage,
  getSortingQuery,
  getUpdatedMessage,
  insensitiveMode,
  prismaExclude,
} from "@/trpc/shared";
import { schema } from "@schema";
import { z } from "zod";

const packageSelect = { select: { ...prismaExclude("Package", []), trainers: true, places: true, sports: true, transactions: true } };

export const packageRouter = createTRPCRouter({
  update: ownerProcedure.input(schema.package.update).mutation(async ({ ctx, input }) => {
    const { body, id } = input;
    const data = await ctx.db.package.findFirst({ where: { id } });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");

    await ctx.db.package.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        validityInDays: body.validityInDays,
        approvedSessions: body.approvedSessions,
        price: body.price,
        type: body.type,
        places: { set: body.placeIDs.map((id) => ({ id })) },
        sports: { set: body.sportIDs.map((id) => ({ id })) },
        trainers: { set: body.trainerIDs?.map((id) => ({ id })) },
      },
    });

    return THROW_OK("OK", getUpdatedMessage("package"));
  }),

  create: ownerProcedure.input(schema.package.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.package.findFirst({ where: { name: input.name } });
    if (data) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("package", "name"));

    await ctx.db.package.create({
      data: {
        name: input.name,
        description: input.description,
        validityInDays: input.validityInDays,
        approvedSessions: input.approvedSessions,
        price: input.price,
        type: input.type,
        places: { connect: input.placeIDs.map((id) => ({ id })) },
        sports: { connect: input.sportIDs.map((id) => ({ id })) },
        trainers: { connect: input.trainerIDs?.map((id) => ({ id })) },
      },
    });

    return THROW_OK("CREATED", getCreatedMessage("package"));
  }),

  detail: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const data = await ctx.db.package.findFirst({ where: { id: input.id }, ...packageSelect });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    return data;
  }),

  list: publicProcedure.input(schema.package.list).query(async ({ ctx, input }) => {
    const data = await ctx.db.package.findMany({
      ...packageSelect,
      where: {
        name: { contains: input.name, ...insensitiveMode },
        type: input.type,
        price: { gte: input.price },
        totalTransactions: { gte: input.totalTransactions },
      },
      ...(input.sort ? getSortingQuery(input.sort) : { orderBy: { type: "asc" } }),
    });
    return data;
  }),
});

// ouputs
export type PackageList = RouterOutputs["package"]["list"];
export type PackageDetail = RouterOutputs["package"]["detail"];

// inputs
export type PackageCreateInput = RouterInputs["package"]["create"];
export type PackageUpdateInput = RouterInputs["package"]["update"];
export type PackageListInput = RouterInputs["package"]["list"];
