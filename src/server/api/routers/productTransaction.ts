import { getNewDate } from "@/lib/functions";
import { schema } from "@/schema";
import { getCreatedMessage, THROW_OK, type RouterInputs } from "@/trpc/shared";
import { createTRPCRouter, ownerAdminProcedure } from "../trpc";
import { updateTotalSpending } from "./other";

export const productTransactionRouter = createTRPCRouter({
  create: ownerAdminProcedure.input(schema.productTransaction.create).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.productTransaction.create({
      data: {
        totalPrice: input.products.reduce((sum, product) => {
          const productTotalPrice = product.quantity * product.unitPrice;
          return sum + productTotalPrice;
        }, 0),
        buyerId: input.buyerId,
        paymentMethodId: input.paymentMethodId,
        transactionDate: getNewDate(input.transactionDate),
      },
    });

    await ctx.db.productOnTransaction.createMany({
      data: input.products.map((e) => ({
        productId: e.productId,
        quantity: e.quantity,
        unitPrice: e.unitPrice,
        productTransactionId: data.id,
      })),
    });

    await updateTotalSpending(input.buyerId);
    return THROW_OK("CREATED", getCreatedMessage("product transaction"));
  }),
});

// inputs
export type ProductTransactionInput = RouterInputs["productTransaction"]["create"];
