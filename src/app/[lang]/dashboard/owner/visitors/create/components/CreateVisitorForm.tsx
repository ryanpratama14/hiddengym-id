"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { toastError, toastSuccess, toastWarning } from "@/components/Toast";
import TransactionInvoice from "@/components/TransactionInvoice";
import { GENDER_OPTIONS, ICONS, USER_REDIRECT } from "@/lib/constants";
import { cn, getInputDate, getNewDate } from "@/lib/functions";
import { schema } from "@/schema";
import { type PackageList } from "@/server/api/routers/package";
import { type PackageTransactionCreateInput } from "@/server/api/routers/packageTransaction";
import { type PaymentMethodList } from "@/server/api/routers/paymentMethod";
import { type UserCreateVisitorInput } from "@/server/api/routers/user";
import { inputVariants } from "@/styles/variants";
import { api } from "@/trpc/react";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { type Dictionary, type Lang } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Package, type PromoCode } from "@prisma/client";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  createPackageTransaction: (data: PackageTransactionCreateInput) => Promise<TRPC_RESPONSE>;
  lang: Lang;
  t: Dictionary;
  option: { packages: PackageList; paymentMethods: PaymentMethodList };
  session: Session;
};

export default function CreateVisitorForm({ lang, t, option, createPackageTransaction, session }: Props) {
  const router = useRouter();
  const [isAddingTransaction, setIsAddingTransaction] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);

  const {
    register,
    unregister,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    resetField,
    getValues,
  } = useForm<UserCreateVisitorInput>({
    resolver: zodResolver(schema.user.createVisitor),
    defaultValues: { visitorData: { gender: "MALE" } },
  });

  const data = {
    transactionDate: watch("packageData.transactionDate"),
    startDate: watch("packageData.startDate"),
    fullName: watch("visitorData.fullName"),
    phoneNumber: watch("visitorData.phoneNumber"),
    email: watch("visitorData.email"),
    gender: watch("visitorData.gender"),
    promoCodeCode: watch("packageData.promoCodeCode"),
    packageId: watch("packageData.packageId"),
    birthDate: watch("visitorData.birthDate"),
    promoCodeId: watch("packageData.promoCodeId"),
    unitPrice: watch("packageData.unitPrice"),
  };

  const onSubmit: SubmitHandler<UserCreateVisitorInput> = async (data) => createVisitor(data);

  const { mutate: createVisitor, isPending: loading } = api.user.createVisitor.useMutation({
    onSuccess: async (res) => {
      const packageTransaction: PackageTransactionCreateInput = {
        packageId: getValues("packageData.packageId"),
        paymentMethodId: getValues("packageData.paymentMethodId"),
        transactionDate: getValues("packageData.transactionDate"),
        promoCodeId: getValues("packageData.promoCodeId"),
        startDate: getValues("packageData.startDate"),
        unitPrice: getValues("packageData.unitPrice"),
        buyerId: res.visitorId,
      };
      await createPackageTransaction(packageTransaction);
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT({ lang, href: "/visitors", role: "OWNER" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  const { mutate: checkPromoCode, isPending: loadingPromoCode } = api.promoCode.checkPromoCode.useMutation({
    onSuccess: (res) => {
      setSelectedPromoCode(res.data);
      setValue("packageData.promoCodeId", res.data.id);
      toastSuccess({ t, description: res.message });
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <section className="grid md:grid-cols-2 gap-4">
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
      <section className="grid md:grid-cols-2 gap-4">
        <Input
          error={errors.visitorData?.email?.message}
          icon={ICONS.email}
          label="Email (Optional)"
          {...register("visitorData.email")}
        />
        <section className="flex flex-col gap-6">
          <section className="grid md:grid-cols-2 gap-4">
            <Input
              error={errors.visitorData?.birthDate?.message}
              label="Date of Birth (Optional)"
              type="date"
              onChange={(e) => {
                if (selectedPromoCode) setSelectedPromoCode(null);
                if (data.promoCodeId) resetField("packageData.promoCodeId");
                if (data.promoCodeCode) resetField("packageData.promoCodeCode");
                setValue("visitorData.birthDate", e.target.value);
              }}
            />
            <section className="flex flex-col">
              <p>Gender</p>
              <section className="grid grid-cols-2 h-10">
                {GENDER_OPTIONS.map((option, index) => {
                  return (
                    <section key={option.label} className="items-center flex gap-2">
                      <button
                        type="button"
                        className="relative rounded-full size-6 bg-white border-1 border-dark has-[:checked]:bg-dark"
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
                        <Iconify color={option.color} width={25} icon={option.icon} />
                        {option.label}
                      </label>
                    </section>
                  );
                })}
              </section>
            </section>
          </section>
          <section className="flex justify-end">
            <Button
              color={isAddingTransaction ? "danger" : "none"}
              size="m"
              onClick={() => {
                setIsAddingTransaction(!isAddingTransaction);
                if (isAddingTransaction) unregister("packageData");
                if (!isAddingTransaction) setValue("packageData.transactionDate", getInputDate({}));
                if (!isAddingTransaction) setValue("packageData.startDate", getInputDate({}));
                if (!isAddingTransaction) setValue("packageData.packageId", "");
                if (!isAddingTransaction) setValue("packageData.paymentMethodId", "");
                if (selectedPackage) setSelectedPackage(null);
                if (selectedPromoCode) setSelectedPromoCode(null);
                if (selectedPaymentMethod) setSelectedPaymentMethod("");
              }}
              className={cn({ "text-dark bg-dark/10": !isAddingTransaction })}
            >
              {`${isAddingTransaction ? "Remove" : "Add"} package transaction`}
            </Button>
          </section>
        </section>
      </section>
      {isAddingTransaction ? (
        <Fragment>
          <section className="grid md:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="packageData.packageId"
              render={({ field }) => (
                <InputSelect
                  {...field}
                  icon={ICONS.package}
                  error={errors.packageData?.packageId?.message}
                  options={option.packages.map((e) => ({ ...e, value: e.id, label: `${e.type} - ${e.name}` }))}
                  label="Package"
                  onChange={(value, item) => {
                    const data = structuredClone(item) as Package;
                    setSelectedPackage(data);
                    setValue("packageData.packageId", value as string);
                    setValue("packageData.unitPrice", data.price);
                    clearErrors("packageData.packageId");
                  }}
                />
              )}
            />

            <section className="grid grid-cols-2 gap-4">
              <Input
                {...register("packageData.transactionDate")}
                error={errors.packageData?.transactionDate?.message}
                label="Transaction Date"
                type="date"
              />
              <Input
                {...register("packageData.startDate")}
                error={errors.packageData?.startDate?.message}
                label="Start Date"
                type="date"
              />
            </section>
          </section>
          <section className="grid md:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="packageData.paymentMethodId"
              render={({ field }) => (
                <InputSelect
                  {...field}
                  icon={ICONS.payment_method}
                  error={errors.packageData?.paymentMethodId?.message}
                  options={option.paymentMethods.map((e) => ({ ...e, value: e.id, label: e.name }))}
                  label="Payment Method"
                  onChange={(value, item) => {
                    const data = structuredClone(item) as { label: string };
                    setSelectedPaymentMethod(data.label);
                    setValue("packageData.paymentMethodId", value as string);
                    clearErrors("packageData.paymentMethodId");
                  }}
                />
              )}
            />

            {/* PROMO_CODES */}
            <section className="grid md:grid-cols-2 gap-4">
              <Input disabled={!data.packageId} {...register("packageData.unitPrice")} type="number" label="Unit Price" />
              <section className="flex flex-col gap-0.5">
                <label htmlFor="promoCodeCode">Promo Code (Optional)</label>
                <section className="flex flex-col">
                  <section className="grid grid-cols-3 items-end gap-2">
                    <input
                      disabled={loadingPromoCode || !!selectedPromoCode?.code || !selectedPackage?.id}
                      id="promoCodeCode"
                      {...register("packageData.promoCodeCode")}
                      className={cn("col-span-2 font-mono", inputVariants(), {
                        "border-dark/30": loadingPromoCode || !!selectedPromoCode?.code || !selectedPackage?.id,
                      })}
                    />
                    <Button
                      icon={selectedPromoCode?.code && ICONS.check}
                      color={selectedPromoCode ? "active" : "primary"}
                      loading={loadingPromoCode}
                      disabled={loadingPromoCode || !!selectedPromoCode?.id}
                      onClick={async () => {
                        if (!data.birthDate) return toastWarning({ t, description: "Pick date of birth first" });
                        if (!data.packageId) return toastWarning({ t, description: "Pick package first" });
                        if (!data.promoCodeCode) return toastWarning({ t, description: "Fill out the Promo Code first" });
                        checkPromoCode({ code: data.promoCodeCode, birthDate: getNewDate(data.birthDate) });
                      }}
                      size="m"
                      className="h-10"
                    >
                      {selectedPromoCode?.code ? "Applied" : "Apply"}
                    </Button>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </Fragment>
      ) : null}

      {/* TRANSACTION_INVOICE */}

      {selectedPackage && data.unitPrice ? (
        <TransactionInvoice>
          <TransactionInvoice.Header
            tz={session.user.tz}
            title="Package"
            totalPrice={selectedPromoCode?.discountPrice ? data.unitPrice - selectedPromoCode?.discountPrice : data.unitPrice}
            transactionDate={data.transactionDate}
          />
          <TransactionInvoice.Buyer fullName={data.fullName} email={data.email} phoneNumber={data.phoneNumber} gender={data.gender} />
          <TransactionInvoice.Package unitPrice={data.unitPrice} package={selectedPackage} promoCode={selectedPromoCode} />
          <TransactionInvoice.Validity
            validityInDays={selectedPackage.validityInDays}
            startDate={data.startDate}
            tz={session.user.tz}
          />
          <TransactionInvoice.ApprovedSessions approvedSessions={selectedPackage.approvedSessions} />
          <TransactionInvoice.PaymentMethod paymentMethod={selectedPaymentMethod} />
        </TransactionInvoice>
      ) : null}

      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create User
        </Button>
      </section>
    </form>
  );
}
