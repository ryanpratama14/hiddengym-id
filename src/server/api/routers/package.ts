import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import { type RouterInputs, THROW_OK, THROW_TRPC_ERROR } from "@/trpc/shared";

export const packageRouter = createTRPCRouter({
  create: ownerProcedure.input(schema.package.create).query(async ({ ctx, input }) => {
    const data = await ctx.db.package.findFirst({ where: { name: input.name } });
    if (data) return THROW_TRPC_ERROR("CONFLICT");
    await ctx.db.package.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        type: input.type,
        placeIDs: input.placeIDs,
        sportIDs: input.sportIDs,
        trainerIDs: input.trainerIDs,
      },
    });
    return THROW_OK("CREATED");
  }),
});

// inputs
export type PackageCreateInput = RouterInputs["package"]["create"];
