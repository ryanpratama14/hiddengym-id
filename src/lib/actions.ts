"use server";

import { type UserUpdateInput } from "@/server/api/routers/user";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

export const revalidateCache = async () => revalidatePath("/");

export const actionUserUpdate = async (data: UserUpdateInput) => {
  const res = await api.user.update.mutate(data);
  await revalidateCache();
  return res;
};
