import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure, publicProcedure } from "@/server/api/trpc";
import { prismaExclude, THROW_ERROR, THROW_OK, type RouterInputs } from "@/trpc/shared";

export const packageRouter = createTRPCRouter({
  create: ownerProcedure.input(schema.package.create).query(async ({ ctx, input }) => {
    const data = await ctx.db.package.findFirst({ where: { name: input.name } });
    if (data) return THROW_ERROR("CONFLICT");

    await ctx.db.package.create({
      data: {
        name: input.name,
        description: input.description,
        validityInDays: input.validityInDays,
        totalPermittedSessions: input.totalPermittedSessions,
        price: input.price,
        type: input.type,
        placeIDs: input.placeIDs,
        sportIDs: input.sportIDs,
        trainerIDs: input.trainerIDs,
      },
    });
    return THROW_OK("CREATED");
  }),

  list: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.package.findMany({
      select: {
        ...prismaExclude("Package", ["placeIDs", "sportIDs", "trainerIDs"]),
        trainers: true,
        places: true,
        sports: true,
      },
    });
    return data;
  }),
});

// inputs
export type PackageCreateInput = RouterInputs["package"]["create"];
