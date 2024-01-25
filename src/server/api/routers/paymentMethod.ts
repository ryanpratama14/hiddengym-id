import { isTxnDateToday } from "@/lib/functions";
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
import { schema } from "@schema";
import { z } from "zod";

const paymentMethodSelect = {
	select: {
		packageTransactions: { select: { ...prismaExclude("PackageTransaction", []), buyer: true } },
		productTransactions: { select: { ...prismaExclude("ProductTransaction", []), buyer: true } },
		...prismaExclude("PaymentMethod", []),
	},
};

export const paymentMethodRouter = createTRPCRouter({
	create: ownerProcedure.input(schema.paymentMethod.create).mutation(async ({ ctx, input }) => {
		const data = await ctx.db.paymentMethod.findFirst({ where: { name: input.name } });
		if (data) return THROW_TRPC_ERROR("CONFLICT", getConflictMessage("payment method", "name"));
		await ctx.db.paymentMethod.create({ data: { name: input.name } });
		return THROW_OK("CREATED", getCreatedMessage("payment method"));
	}),

	list: ownerProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.paymentMethod.findMany({ ...paymentMethodSelect });

		const updatedData = data.map((e) => {
			return {
				...e,
				todayPackageTransactions: e.packageTransactions.filter((txn) => isTxnDateToday(txn.transactionDate)),
				todayProductTransactions: e.productTransactions.filter((txn) => isTxnDateToday(txn.transactionDate)),
			};
		});

		return updatedData;
	}),

	detail: ownerProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		const data = await ctx.db.paymentMethod.findFirst({ where: { id: input.id }, ...paymentMethodSelect });
		if (!data) return THROW_TRPC_ERROR("NOT_FOUND");

		return {
			...data,
			todayPackageTransaction: data.packageTransactions.filter((txn) => isTxnDateToday(txn.transactionDate)),
			todayProductTransaction: data.productTransactions.filter((txn) => isTxnDateToday(txn.transactionDate)),
		};
	}),
});

// outputs
export type PaymentMethodList = RouterOutputs["paymentMethod"]["list"];
export type PaymentMethodDetail = RouterOutputs["paymentMethod"]["detail"];

// inputs
export type PaymentMethodCreateInput = RouterInputs["paymentMethod"]["create"];
