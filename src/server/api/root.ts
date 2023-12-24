import { createTRPCRouter } from "@/server/api/trpc";

// routers
import { userRouter } from "@/server/api/routers/user";
import { paymentMethodRouter } from "@/server/api/routers/paymentMethod";

export const appRouter = createTRPCRouter({
  user: userRouter,
  paymentMethod: paymentMethodRouter,
});

export type AppRouter = typeof appRouter;
