import { createTRPCRouter } from "@/server/api/trpc";
import { packageRouter } from "@router/package";
import { packageTransactionRouter } from "@router/packageTransaction";
import { paymentMethodRouter } from "@router/paymentMethod";
import { placeRouter } from "@router/place";
import { productRouter } from "@router/product";
import { productTransactionRouter } from "@router/productTransaction";
import { promoCodeRouter } from "@router/promoCode";
import { sportRouter } from "@router/sport";
import { userRouter } from "@router/user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  paymentMethod: paymentMethodRouter,
  package: packageRouter,
  packageTransaction: packageTransactionRouter,
  productTransaction: productTransactionRouter,
  product: productRouter,
  sport: sportRouter,
  place: placeRouter,
  promoCode: promoCodeRouter,
});

export type AppRouter = typeof appRouter;
