import { packageRouter } from "@/server/api/routers/package";
import { paymentMethodRouter } from "@/server/api/routers/paymentMethod";
import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  paymentMethod: paymentMethodRouter,
  package: packageRouter,
});

export type AppRouter = typeof appRouter;
