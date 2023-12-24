import { createTRPCRouter } from "@/server/api/trpc";

// routers
import { userRouter } from "@/server/api/routers/user";
import { paymentMethodRouter } from "@/server/api/routers/paymentMethod";
import { packageRouter } from "@/server/api/routers/package";

export const appRouter = createTRPCRouter({
  user: userRouter,
  paymentMethod: paymentMethodRouter,
  package: packageRouter,
});

export type AppRouter = typeof appRouter;
