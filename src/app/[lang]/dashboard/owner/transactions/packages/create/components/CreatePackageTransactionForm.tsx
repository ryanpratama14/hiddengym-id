"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import Logo from "@/components/Logo";
import { toastError, toastSuccess, toastWarning } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import {
  cn,
  formatCurrency,
  formatDateShort,
  getExpiryDate,
  getInputDate,
  getNewDate,
  getStartDate,
  isDateExpired,
  isDateToday,
  localizePhoneNumber,
} from "@/lib/functions";
import { schema } from "@/schema";
import { type PackageList } from "@/server/api/routers/package";
import { type PackageTransactionCreateInput } from "@/server/api/routers/packageTransaction";
import { type PaymentMethodList } from "@/server/api/routers/paymentMethod";
import { type UserListVisitor } from "@/server/api/routers/user";
import { inputVariants } from "@/styles/variants";
import { api } from "@/trpc/react";
import { type Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Package, type PaymentMethod, type PromoCode, type User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  t: Dictionary;
  option: { packages: PackageList; paymentMethods: PaymentMethodList; visitors: UserListVisitor };
};

export default function CreatePackageTransactionForm({ t, option }: Props) {
  const { lang } = useZustand();
  const router = useRouter();
  const [selectedBuyer, setSelectedBuyer] = useState<User | null>();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    resetField,
  } = useForm<PackageTransactionCreateInput>({
    resolver: zodResolver(schema.packageTransaction.create),
    defaultValues: { transactionDate: getInputDate(), paymentMethodId: "", buyerId: "", packageId: "" },
  });

  const onSubmit: SubmitHandler<PackageTransactionCreateInput> = (data) => createData(data);

  const data = {
    transactionDate: watch("transactionDate"),
    promoCodeCode: watch("promoCodeCode"),
    packageId: watch("packageId"),
    promoCodeId: watch("promoCodeId"),
  };

  const { mutate: createData, isLoading: loading } = api.packageTransaction.create.useMutation({
    onSuccess: (res) => {
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT.OWNER({ lang, href: "/transactions/packages" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  const { mutate: checkPromoCode, isLoading: loadingPromoCode } = api.promoCode.checkPromoCode.useMutation({
    onSuccess: (res) => {
      setSelectedPromoCode(res.data);
      setValue("promoCodeId", res.data.id);
      toastSuccess({ t, description: res.message });
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      <section className="grid md:grid-cols-2 gap-4 md:gap-6">
        <Controller
          control={control}
          name="buyerId"
          render={({ field }) => (
            <InputSelect
              showSearch={true}
              {...field}
              icon={ICONS.person}
              error={errors.buyerId?.message}
              options={option.visitors.map((e) => ({ ...e, value: e.id, label: e.fullName }))}
              label="Buyer"
              onChange={(value, item) => {
                setSelectedBuyer(item as User);
                setValue("buyerId", value as string);
                clearErrors("buyerId");
                if (selectedPromoCode && selectedPromoCode.type === "STUDENT") setSelectedPromoCode(null);
                if (data.promoCodeCode) resetField("promoCodeCode");
                if (data.promoCodeId) resetField("promoCodeId");
              }}
            />
          )}
        />
        <Input label="Transaction Date" {...register("transactionDate")} type="date" />
      </section>

      <section className="grid md:grid-cols-2 gap-4 md:gap-6">
        <Controller
          control={control}
          name="packageId"
          render={({ field }) => (
            <InputSelect
              showSearch={false}
              {...field}
              icon={ICONS.package}
              error={errors.packageId?.message}
              options={option.packages.map((e) => ({ ...e, value: e.id, label: `${e.type} - ${e.name}` }))}
              label="Package"
              onChange={(value, item) => {
                setSelectedPackage(item as Package);
                setValue("packageId", value as string);
                clearErrors("packageId");
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="paymentMethodId"
          render={({ field }) => (
            <InputSelect
              showSearch={false}
              {...field}
              icon={ICONS.payment_method}
              error={errors.paymentMethodId?.message}
              options={option.paymentMethods.map((e) => ({ ...e, value: e.id, label: e.name }))}
              label="Payment Method"
              onChange={(value, item) => {
                setSelectedPaymentMethod(item as PaymentMethod);
                setValue("paymentMethodId", value as string);
                clearErrors("paymentMethodId");
              }}
            />
          )}
        />
      </section>
      <section className="flex flex-col gap-0.5">
        <label htmlFor="promoCodeCode">Promo Code (Optional)</label>
        <section className="flex flex-col">
          <section className="grid grid-cols-3 items-end gap-2">
            <input
              disabled={loadingPromoCode || !!selectedPromoCode?.code || !selectedPackage?.id}
              id="promoCodeCode"
              {...register("promoCodeCode")}
              className={cn("col-span-2 font-mono", inputVariants(), {
                "border-dark/30": loadingPromoCode || !!selectedPromoCode?.code || !selectedPackage?.id,
              })}
            />
            <Button
              icon={selectedPromoCode?.code && ICONS.check}
              color={selectedPromoCode ? "active" : "primary"}
              loading={loadingPromoCode}
              disabled={loadingPromoCode || !!selectedPromoCode?.id}
              onClick={() => {
                if (!selectedBuyer) return toastWarning({ t, description: "Pick buyer first" });
                if (!data.packageId) return toastWarning({ t, description: "Pick package first" });
                if (!data.promoCodeCode) return toastWarning({ t, description: "Fill out the Promo Code first" });
                checkPromoCode({ code: data.promoCodeCode, birthDate: selectedBuyer.birthDate });
              }}
              size="m"
              className="h-full"
            >
              {selectedPromoCode?.code ? "Applied" : "Apply"}
            </Button>
          </section>
        </section>
      </section>

      {selectedPackage && selectedBuyer ? (
        <section className="flex justify-center items-center">
          <section className="md:w-[30rem] w-full flex flex-col gap-4 p-3 lg:p-6 shadow bg-light text-dark">
            <section className="flex justify-between w-full">
              <section className="flex flex-col">
                <h6>Package TXN</h6>
                <p className="font-medium">
                  Date: {data.transactionDate ? formatDateShort({ date: getNewDate(data.transactionDate) }) : null}
                </p>
              </section>
              <section className="flex flex-col items-end">
                <p className="font-semibold">TOTAL AMOUNT</p>
                <h6 className="w-fit px-2 text-light bg-orange">
                  {formatCurrency(
                    selectedPromoCode?.discountPrice
                      ? selectedPackage.price - selectedPromoCode?.discountPrice
                      : selectedPackage.price,
                  )}
                </h6>
              </section>
            </section>

            <section className="flex flex-col text-center">
              <p className="font-medium underline">{selectedBuyer.fullName}</p>
              <small>{localizePhoneNumber(selectedBuyer.phoneNumber)}</small>
              <small>{selectedBuyer.email}</small>
            </section>

            <section className="flex flex-col gap-1">
              <section className="flex justify-between items-center">
                <section className="flex gap-2 items-center">
                  <small className="font-semibold border-1 border-dark px-1">{selectedPackage.type}</small>
                  <small>{selectedPackage.name}</small>
                </section>
                <small>{formatCurrency(selectedPackage.price)}</small>
              </section>
              {selectedPromoCode ? (
                <section className="flex justify-between items-center">
                  <section className="flex gap-1 items-center">
                    <small>PROMO CODE</small>
                    <code className="text-sm italic underline">{selectedPromoCode.code}</code>
                  </section>

                  <small>{formatCurrency(-selectedPromoCode.discountPrice)}</small>
                </section>
              ) : null}
            </section>

            {selectedPackage.validityInDays && data.transactionDate ? (
              <section className="flex flex-col">
                <section className="flex justify-between">
                  <small>Start</small>
                  <small>Expiry</small>
                </section>
                <section className="flex justify-between items-center gap-6 relative">
                  <section className="flex flex-col w-fit">
                    <p className="font-semibold">{formatDateShort({ date: getStartDate(data.transactionDate) })}</p>
                  </section>
                  <div className="absolute centered w-[25%] h-0.5 bg-dark" />
                  <section className="flex flex-col text-right w-fit">
                    <p className="font-semibold">
                      {isDateToday(getExpiryDate({ days: selectedPackage.validityInDays, dateString: data.transactionDate }))
                        ? "Today"
                        : isDateExpired(getExpiryDate({ days: selectedPackage.validityInDays, dateString: data.transactionDate }))
                          ? "Expired"
                          : formatDateShort({
                              date: getExpiryDate({ days: selectedPackage.validityInDays, dateString: data.transactionDate }),
                            })}
                    </p>
                  </section>
                </section>
              </section>
            ) : null}

            {selectedPackage.approvedSessions ? (
              <small className="text-left">Approved sessions: {`${selectedPackage.approvedSessions} session(s)`}</small>
            ) : null}

            {selectedPaymentMethod ? (
              <section className="flex w-full bg-blue text-light justify-center text-lg py-1 font-medium shadow-lg">
                PAID BY {selectedPaymentMethod.name.toUpperCase()}
              </section>
            ) : null}

            <section className="flex flex-col justify-center items-center gap-6 mt-6">
              <Logo className="aspect-video w-[50%]" />
              <section className="flex justify-center flex-col gap-1 text-center">
                <h6>HIDDEN GYM</h6>
                <small className="text-balance">
                  Jl. Cengkir No.9 10, RT.10/RW.12, Utan Kayu Sel., Kec. Matraman, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta
                  13120
                </small>
              </section>
            </section>
          </section>
        </section>
      ) : null}

      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Package Transaction
        </Button>
      </section>
    </form>
  );
}
