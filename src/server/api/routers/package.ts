import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure, publicProcedure } from "@/server/api/trpc";
import {
  getConflictMessage,
  getCreatedMessage,
  prismaExclude,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";
import { z } from "zod";

const packageSelect = {
  select: {
    ...prismaExclude("Package", ["placeIDs", "sportIDs", "trainerIDs"]),
    trainers: true,
    places: true,
    sports: true,
  },
};

export const packageRouter = createTRPCRouter({
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

  list: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.package.findMany({ ...packageSelect });
    return data;
  }),
});

// ouputs
export type PackageList = RouterOutputs["package"]["list"];

// inputs
export type PackageCreateInput = RouterInputs["package"]["create"];
