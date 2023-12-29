import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { THROW_TRPC_ERROR } from "@/trpc/shared";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();
  return { db, session, ...opts };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: { ...shape.data, zodError: error.cause instanceof ZodError ? error.cause.flatten() : null },
  }),
});

const enforceIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) return THROW_TRPC_ERROR("UNAUTHORIZED");
  return next({ ctx: { session: { ...ctx.session, user: ctx.session.user } } });
});

const enforceIsAdminAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || ctx.session.user.role !== "ADMIN") return THROW_TRPC_ERROR("UNAUTHORIZED");
  return next({ ctx: { session: { ...ctx.session, user: ctx.session.user } } });
});

const enforceIsOwnerAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || ctx.session.user.role !== "OWNER") return THROW_TRPC_ERROR("UNAUTHORIZED");
  return next({ ctx: { session: { ...ctx.session, user: ctx.session.user } } });
});

const enforceIsOwnerAdminAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || (ctx.session.user.role !== "OWNER" && ctx.session.user.role !== "ADMIN")) {
    return THROW_TRPC_ERROR("UNAUTHORIZED");
  }
  return next({ ctx: { session: { ...ctx.session, user: ctx.session.user } } });
});

const enforceIsTrainerAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || ctx.session.user.role !== "TRAINER") return THROW_TRPC_ERROR("UNAUTHORIZED");
  return next({ ctx: { session: { ...ctx.session, user: ctx.session.user } } });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceIsAuthed);
export const adminProcedure = t.procedure.use(enforceIsAdminAuthed);
export const ownerProcedure = t.procedure.use(enforceIsOwnerAuthed);
export const ownerAdminProcedure = t.procedure.use(enforceIsOwnerAdminAuthed);
export const trainerProcedure = t.procedure.use(enforceIsTrainerAuthed);
