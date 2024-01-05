"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { toastError, toastSuccess } from "@/components/Toast";
import { GENDERS, ICONS } from "@/lib/constants";
import { getInputDate, removeFormatPhoneNumber } from "@/lib/functions";
import { schema } from "@/schema";
import { type User, type UserUpdateInput } from "@/server/api/routers/user";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { type Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  user: User;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  updateUser: (data: UserUpdateInput) => Promise<TRPC_RESPONSE>;
  t: Dictionary;
};

export default function ProfileForm({ user, setIsEdit, updateUser, t }: Props) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateInput>({
    resolver: zodResolver(schema.user.update),
    defaultValues: {
      userId: user?.id,
      body: {
        fullName: user?.fullName,
        email: user?.email ?? "",
        gender: user?.gender,
        phoneNumber: user?.phoneNumber && removeFormatPhoneNumber(user.phoneNumber),
        birthDate: user?.birthDate ? getInputDate(user.birthDate) : "",
      },
    },
  });

  const onSubmit: SubmitHandler<UserUpdateInput> = async (data) => {
    setLoading(true);
    const res = await updateUser(data);
    setLoading(false);
    setIsEdit(false);
    if (!res.status) return toastError({ t, description: "An error occurred" });
    toastSuccess({ t, description: res.message });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      <Input icon={ICONS.person} label="Full Name" {...register("body.fullName")} error={errors.body?.fullName?.message} />
      <Input icon={ICONS.email} label="Email" {...register("body.email")} error={errors.body?.email?.message} />
      <Input label="Phone Number" {...register("body.phoneNumber")} error={errors.body?.phoneNumber?.message} isPhoneNumber />
      <section className="flex flex-col">
        <p>Gender</p>
        <section className="grid grid-cols-2 h-10">
          {GENDERS.map((option, index) => {
            return (
              <section key={option.label} className="items-center flex gap-2">
                <button type="button" className="relative rounded-full w-6 aspect-square border-1 border-dark has-[:checked]:bg-dark">
                  <input
                    value={option.value}
                    className="cursor-pointer absolute w-full h-full opacity-0 z-10 top-0 left-0"
                    id={`gender_option_${index}`}
                    type="radio"
                    {...register("body.gender")}
                  />
                  <div className="animate absolute centered w-[40%] aspect-square rounded-full bg-cream has-[:checked]:scale-0" />
                </button>
                <label className="flex items-center" htmlFor={`gender_option_${index}`}>
                  <Iconify color={option.color} width={25} icon={option.icon} />
                  {option.label}
                </label>
              </section>
            );
          })}
        </section>
      </section>
      <Input type="date" label="Date of Birth" {...register("body.birthDate")} error={errors.body?.birthDate?.message} />
      <section className="grid grid-cols-2 gap-2">
        <Button disabled={loading} onClick={() => setIsEdit(false)} size="l" color="expired">
          Cancel
        </Button>
        <Button loading={loading} size="l" type="submit" color="success">
          Save
        </Button>
      </section>
    </form>
  );
}
