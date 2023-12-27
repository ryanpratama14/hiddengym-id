import { packageRouter } from "@/server/api/routers/package";
import { paymentMethodRouter } from "@/server/api/routers/paymentMethod";
import { sportRouter } from "@/server/api/routers/sport";
import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  paymentMethod: paymentMethodRouter,
  package: packageRouter,
  sport: sportRouter,
});

export type AppRouter = typeof appRouter;
