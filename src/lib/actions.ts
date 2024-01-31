"use server";

import { api } from "@/trpc/server";
import type { UserUpdateInput } from "@router/user";
import { revalidatePath } from "next/cache";

export const revalidateCache = async () => revalidatePath("/");

export const actionUserUpdate = async (data: UserUpdateInput) => {
  const res = await api.user.update.mutate(data);
  await revalidateCache();
  return res;
};
