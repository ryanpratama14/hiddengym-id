"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { toast } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { GENDERS, ICONS, USER_REDIRECT } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { cn } from "@/lib/utils";
import { schema } from "@/schema";
import { type UserCreateVisitorInput } from "@/server/api/routers/user";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  createVisitor: (data: UserCreateVisitorInput) => Promise<TRPC_RESPONSE>;
  lang: Locale;
  t: Dictionary;
};

export default function CreateVisitorForm({ createVisitor, lang, t }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState<boolean>(false);

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserCreateVisitorInput>({
    resolver: zodResolver(schema.user.createVisitor),
    defaultValues: {
      visitorData: { gender: "MALE" },
    },
  });

  const onSubmit: SubmitHandler<UserCreateVisitorInput> = async (data) => {
    setLoading(true);
    const res = await createVisitor(data);
    setLoading(false);
    reset();
    if (!res.status) return toast({ t, type: "error", description: "Visitor with this phone number already exists" });
    toast({ t, type: "success", description: "Visitor has been created" });
    router.push(USER_REDIRECT.OWNER({ lang, href: "/visitors" }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <section className="grid md:grid-cols-2 gap-6">
        <Input
          error={errors.visitorData?.fullName?.message}
          icon={ICONS.person}
          label="Full Name"
          {...register("visitorData.fullName")}
        />
        <Input
          error={errors.visitorData?.phoneNumber?.message}
          label="Phone Number"
          {...register("visitorData.phoneNumber")}
          isPhoneNumber
        />
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        <Input
          error={errors.visitorData?.email?.message}
          icon={ICONS.email}
          label="Email (Optional)"
          {...register("visitorData.email")}
        />
        <section className="flex flex-col gap-6">
          <section className="flex flex-col">
            <p>Gender</p>
            <section className="grid grid-cols-2 h-10">
              {GENDERS.map((option, index) => {
                return (
                  <section key={option.label} className="items-center flex gap-2">
                    <button
                      type="button"
                      className="relative rounded-full w-6 bg-white aspect-square border-1 border-dark has-[:checked]:bg-dark"
                    >
                      <input
                        value={option.value}
                        className="cursor-pointer absolute w-full h-full opacity-0 z-10 top-0 left-0"
                        id={`gender_option_${index}`}
                        type="radio"
                        {...register("visitorData.gender")}
                      />
                      <div className="animate absolute centered w-[40%] aspect-square rounded-full bg-white has-[:checked]:scale-0" />
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
              onClick={() => {
                unregister(["packageData.packageId", "packageData.transactionDate"]);
                setIsAddingTransaction(!isAddingTransaction);
              }}
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
            error={errors.packageData?.packageId?.message}
            {...register("packageData.packageId")}
            label="Package"
          />
          <Input
            error={errors.packageData?.transactionDate?.message}
            {...register("packageData.transactionDate")}
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
