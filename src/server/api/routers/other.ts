import { accumulateValue } from "@/lib/functions";
import { db } from "@/server/db";
import { prismaExclude, THROW_TRPC_ERROR } from "@/trpc/shared";

export const updateTotalSpending = async (userId: string) => {
  const data = await db.user.findFirst({
    where: { id: userId },
    select: { ...prismaExclude("User", ["credential"]), packageTransactions: true, productTransactions: true },
  });

  if (!data) return THROW_TRPC_ERROR("NOT_FOUND");

  const spendingData = {
    totalSpendingPackage: accumulateValue(data.packageTransactions, "totalPrice"),
    totalSpendingProduct: accumulateValue(data.productTransactions, "totalPrice"),
    totalSpending: accumulateValue(data.packageTransactions, "totalPrice") + accumulateValue(data.productTransactions, "totalPrice"),
  };

  return await db.user.update({ where: { id: data.id }, data: spendingData });
};

export const updatePackageTotalTransactions = async (packageId: string) => {
  const data = await db.package.findFirst({
    where: { id: packageId },
    select: { ...prismaExclude("Package", []), transactions: true },
  });
  if (!data) return THROW_TRPC_ERROR("NOT_FOUND");

  if (data.transactions.length !== data.totalTransactions) {
    return await db.package.update({ where: { id: data.id }, data: { totalTransactions: data.transactions.length } });
  }

  return;
};
