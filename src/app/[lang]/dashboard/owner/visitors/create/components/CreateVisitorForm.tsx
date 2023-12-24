"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { GENDERS, ICONS, USER_PATHNAMES } from "@/lib/constants";
import { cn, openToast } from "@/lib/utils";
import { schema } from "@/schema";
import { type UserCreateVisitorInput } from "@/server/api/routers/user";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Gender } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

type Props = {
  createVisitor: (data: UserCreateVisitorInput) => Promise<TRPC_RESPONSE>;
};

export default function CreateVisitorForm({ createVisitor }: Props) {
  const router = useRouter();
  const [gender, setGender] = useState<Gender>("MALE");
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserCreateVisitorInput>({
    resolver: zodResolver(schema.user.createVisitor),
    defaultValues: { gender: "MALE" },
  });

  const onSubmit: SubmitHandler<UserCreateVisitorInput> = async (data) => {
    setLoading(true);
    const res = await createVisitor(data);
    setLoading(false);
    reset();
    if (!res.status) return openToast({ type: "error", message: "Error has been occurred" });
    openToast({ type: "success", message: "Visitor has been created" });
    router.push(`${USER_PATHNAMES.OWNER}/visitors`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <section className="grid md:grid-cols-2 gap-6">
        <Input error={errors.fullName?.message} icon={ICONS.person} label="Full Name" {...register("fullName")} />
        <Input error={errors.phoneNumber?.message} label="Phone Number" {...register("phoneNumber")} isPhoneNumber />
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        <Input error={errors.email?.message} icon={ICONS.email} label="Email (Optional)" {...register("email")} />
        <section className="flex flex-col gap-6">
          <section className="flex flex-col">
            <p>Gender</p>
            <section className="grid grid-cols-2 h-10">
              {GENDERS.map((option, index) => {
                const checked = gender === option.value;
                return (
                  <section key={option.label} className="items-center flex gap-2">
                    <button
                      type="button"
                      className={cn("relative rounded-full w-6 bg-white aspect-square border-1 border-dark", {
                        "bg-dark": checked,
                      })}
                      onClick={() => setGender(option.value)}
                    >
                      <input
                        value={option.value}
                        className="cursor-pointer absolute w-full h-full opacity-0 z-10 top-0 left-0"
                        id={`gender_option_${index}`}
                        type="radio"
                        {...register("gender")}
                      />
                      <div
                        className={`animate absolute centered w-[40%] aspect-square rounded-full bg-white ${
                          !checked && "scale-0"
                        }`}
                      />
                    </button>
                    <label className="flex items-center" htmlFor={`gender_option_${index}`}>
                      <Iconify
                        className={cn("text-pink-500", {
                          "text-blue": option.value === "MALE",
                        })}
                        width={25}
                        icon={option.icon}
                      />
                      {option.label}
                    </label>
                  </section>
                );
              })}
            </section>
          </section>
          <section className="flex justify-end">
            <Button
              color={isAddingTransaction ? "danger" : "none"}
              size="m"
              onClick={() => setIsAddingTransaction(!isAddingTransaction)}
              className={cn({ "text-dark bg-dark/10": !isAddingTransaction })}
            >
              {`${isAddingTransaction ? "Remove" : "Add"} package transaction`}
            </Button>
          </section>
        </section>
      </section>
      {isAddingTransaction ? (
        <section className="grid grid-cols-2 gap-6">
          <Input
            required={isAddingTransaction}
            error={errors.packageTransactionId?.message}
            {...register("packageTransactionId")}
            label="Package"
          />
          <Input
            error={errors.transactionDate?.message}
            {...register("transactionDate")}
            label="Transaction Date"
            type="date"
          />
        </section>
      ) : null}

      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create User
        </Button>
      </section>
    </form>
  );
}
