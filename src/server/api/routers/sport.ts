import { formatName } from "@/lib/functions";
import { schema } from "@/schema";
import { createTRPCRouter, ownerProcedure } from "@/server/api/trpc";
import {
  getConflictMessage,
  getCreatedMessage,
  prismaExclude,
  THROW_OK,
  THROW_TRPC_ERROR,
  type RouterInputs,
  type RouterOutputs,
} from "@/trpc/shared";

export const sportRouter = createTRPCRouter({
  list: ownerProcedure.query(async ({ ctx }) => {
    return ctx.db.sport.findMany({
      select: {
        trainers: true,
        packages: true,
        ...prismaExclude("Sport", ["createdDate"]),
      },
    });
  }),

  create: ownerProcedure.input(schema.sport.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.sport.findFirst({ where: { name: input.name } });
    if (data) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("sport type", "name"));
    await ctx.db.sport.create({ data: { name: formatName(input.name) } });
    return THROW_OK("CREATED", getCreatedMessage("sport type"));
  }),
});

// outputs
export type SportList = RouterOutputs["sport"]["list"];

// inputs
export type SportCreateInput = RouterInputs["sport"]["create"];
