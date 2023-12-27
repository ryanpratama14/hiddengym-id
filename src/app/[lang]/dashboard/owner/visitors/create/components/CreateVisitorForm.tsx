"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { toast } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { GENDERS, ICONS, USER_REDIRECT } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { cn, formatCurrency, formatDateLong, getNewDate } from "@/lib/utils";
import { schema } from "@/schema";
import { type PackageList } from "@/server/api/routers/package";
import { type UserCreateVisitorInput } from "@/server/api/routers/user";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Package } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  createVisitor: (data: UserCreateVisitorInput) => Promise<TRPC_RESPONSE>;
  lang: Locale;
  t: Dictionary;
  option: { packages: PackageList };
};

export default function CreateVisitorForm({ createVisitor, lang, t, option }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const {
    register,
    unregister,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
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

  const data = {
    transactionDate: watch("packageData.transactionDate"),
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
                unregister("packageData");
                setIsAddingTransaction(!isAddingTransaction);
                setSelectedPackage(null);
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
          <Controller
            control={control}
            name="packageData.packageId"
            render={({ field }) => (
              <InputSelect
                {...field}
                icon={ICONS.package}
                error={errors.packageData?.packageId?.message}
                options={option.packages.map((e) => ({ ...e, value: e.id, label: e.name }))}
                label="Package"
                onChange={(value, item) => {
                  setSelectedPackage(item as Package);
                  setValue("packageData.packageId", value as string);
                }}
              />
            )}
          />

          <Input
            error={errors.packageData?.transactionDate?.message}
            {...register("packageData.transactionDate")}
            label="Transaction Date"
            type="date"
          />
        </section>
      ) : null}

      {selectedPackage ? (
        <section className="p-6 bg-orange text-cream">
          <p>Package Detail</p>
          <p>{formatCurrency(selectedPackage.price)}</p>
          <p>Transaction Date: {data.transactionDate ? formatDateLong(getNewDate(data.transactionDate), lang) : "-"}</p>
        </section>
      ) : null}

      <section className="flex justify-center items-center">
        <Button
          onClick={() => console.log(watch())}
          className="md:w-fit w-full"
          loading={loading}
          type="submit"
          color="success"
          size="xl"
        >
          Create User
        </Button>
      </section>
    </form>
  );
}
