"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { GENDERS, ICONS } from "@/lib/constants";
import { cn, formatDate, removeFormatPhoneNumber } from "@/lib/utils";
import { schema } from "@/schema";
import { type UserUpdateInput, type User } from "@/server/api/routers/user";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Gender } from "@prisma/client";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

type Props = {
  user: User;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  updateUser: (data: UserUpdateInput) => Promise<TRPC_RESPONSE>;
};

export default function ProfileForm({ user, setIsEdit, updateUser }: Props) {
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState<Gender>(user?.gender);
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
        birthDate: user?.birthDate ? formatDate(user.birthDate) : "",
      },
    },
  });

  const onSubmit: SubmitHandler<UserUpdateInput> = async (data) => {
    setLoading(true);
    const res = await updateUser(data);
    setLoading(false);
    setIsEdit(false);
    // if (!res.status) return toast({ status: "error", title: "An error occurred" });
    // toast({ status: "success", title: "Profile has been updated" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Input label="Full Name" {...register("body.fullName")} error={errors.body?.fullName?.message} />
      <Input icon={ICONS.email} label="Email" {...register("body.email")} error={errors.body?.email?.message} />
      <Input
        label="Phone Number"
        {...register("body.phoneNumber")}
        error={errors.body?.phoneNumber?.message}
        isPhoneNumber
      />
      <section className="flex flex-col">
        <p>Gender</p>
        <section className="grid grid-cols-2 h-10">
          {GENDERS.map((option, index) => {
            const checked = gender === option.value;
            return (
              <section key={option.label} className="items-center flex gap-2">
                <button
                  type="button"
                  className={cn("relative rounded-full w-6 aspect-square border-1 border-dark", {
                    "bg-dark": checked,
                  })}
                  onClick={() => setGender(option.value)}
                >
                  <input
                    value={option.value}
                    className="cursor-pointer absolute w-full h-full opacity-0 z-10 top-0 left-0"
                    id={`gender_option_${index}`}
                    type="radio"
                    {...register("body.gender")}
                  />
                  <div
                    className={`animate absolute centered w-[40%] aspect-square rounded-full bg-cream ${
                      !checked && "scale-0"
                    }`}
                  />
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
        <Button title="Save" disabled={loading} size="l" type="submit" color="success" loading={loading}>
          Save
        </Button>
      </section>
    </form>
  );
}
