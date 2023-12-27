import { packageRouter } from "@/server/api/routers/package";
import { paymentMethodRouter } from "@/server/api/routers/paymentMethod";
import { sportRouter } from "@/server/api/routers/sport";
import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";
import { placeRouter } from "./routers/place";

export const appRouter = createTRPCRouter({
  user: userRouter,
  paymentMethod: paymentMethodRouter,
  package: packageRouter,
  sport: sportRouter,
  place: placeRouter,
});

export type AppRouter = typeof appRouter;
