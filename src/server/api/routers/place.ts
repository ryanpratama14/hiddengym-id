import { formatName } from "@/lib/utils";
import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import { THROW_ERROR, THROW_OK, type RouterInputs } from "@/trpc/shared";

export const placeRouter = createTRPCRouter({
  create: ownerProcedure.input(schema.place.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.place.findFirst({ where: { name: input.name } });
    if (data) return THROW_ERROR("CONFLICT");
    await ctx.db.place.create({ data: { name: formatName(input.name), address: input.address, url: input.url } });
    return THROW_OK("CREATED");
  }),
});

// inputs
export type PlaceCreateInput = RouterInputs["place"]["create"];
