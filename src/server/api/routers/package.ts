import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure, publicProcedure } from "@/server/api/trpc";
import {
  getConflictMessage,
  getCreatedMessage,
  insensitiveMode,
  prismaExclude,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";
import { z } from "zod";

const packageSelect = {
  select: {
    ...prismaExclude("Package", []),
    trainers: true,
    places: true,
    sports: true,
    transactions: true,
  },
};

export const packageRouter = createTRPCRouter({
  update: ownerProcedure.input(schema.package.update).mutation(async ({ ctx, input }) => {
    const { body, id } = input;
    await ctx.db.package.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        validityInDays: body.validityInDays,
        approvedSessions: body.approvedSessions,
        price: body.price,
        type: body.type,
        placeIDs: body.placeIDs,
        sportIDs: body.sportIDs,
        trainerIDs: body.trainerIDs,
      },
    });

    return THROW_OK("OK", "Package has been updated.");
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
        placeIDs: input.placeIDs,
        sportIDs: input.sportIDs,
        trainerIDs: input.trainerIDs,
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
    let data = await ctx.db.package.findMany({
      ...packageSelect,
      where: {
        name: { contains: input.name, ...insensitiveMode },
        type: input.type,
        price: { gte: input.price },
      },
      orderBy: { type: "asc" },
    });
    if (input.totalTransactions) data = data.filter((item) => item.transactions.length >= input.totalTransactions!);
    return data;
  }),
});

// ouputs
export type PackageList = RouterOutputs["package"]["list"];

// inputs
export type PackageCreateInput = RouterInputs["package"]["create"];
export type PackageListInput = RouterInputs["package"]["list"];
