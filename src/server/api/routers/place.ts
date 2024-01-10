import { formatName } from "@/lib/functions";
import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import {
  getConflictMessage,
  getCreatedMessage,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";

export const placeRouter = createTRPCRouter({
  create: ownerProcedure.input(schema.place.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.place.findFirst({ where: { name: input.name } });
    if (data) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("place", "name"));
    await ctx.db.place.create({ data: { name: formatName(input.name), address: input.address, url: input.url } });
    return THROW_OK("CREATED", getCreatedMessage("place"));
  }),

  list: ownerProcedure.query(async ({ ctx }) => await ctx.db.place.findMany()),
});

// outputs
export type PlaceList = RouterOutputs["place"]["list"];

// inputs
export type PlaceCreateInput = RouterInputs["place"]["create"];
