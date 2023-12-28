"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import Logo from "@/components/Logo";
import { toast } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { GENDERS, ICONS, USER_REDIRECT } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import {
  cn,
  formatCurrency,
  formatDateShort,
  formatPhoneNumber,
  getExpiryDateFromDate,
  getNewDate,
  getStartDate,
  getTodayDate,
  isDateExpired,
  isDateToday,
  lozalizePhoneNumber,
} from "@/lib/utils";
import { schema } from "@/schema";
import { type PackageList } from "@/server/api/routers/package";
import { type PaymentMethodList } from "@/server/api/routers/paymentMethod";
import { type PromoCodeDetail, type PromoCodeDetailInput } from "@/server/api/routers/promoCode";
import { type UserCreateVisitorInput } from "@/server/api/routers/user";
import { inputVariants } from "@/styles/variants";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Package, type PaymentMethod, type PromoCode } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  createVisitor: (data: UserCreateVisitorInput) => Promise<TRPC_RESPONSE>;
  checkPromoCode: (data: PromoCodeDetailInput) => Promise<PromoCodeDetail>;
  lang: Locale;
  t: Dictionary;
  option: { packages: PackageList; paymentMethods: PaymentMethodList };
};

export default function CreateVisitorForm({ createVisitor, checkPromoCode, lang, t, option }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPromoCode, setLoadingPromoCode] = useState<boolean>(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);

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
    if (!res.status) return toast({ t, type: "error", description: "Visitor with this phone number / email already exists" });
    reset();
    toast({ t, type: "success", description: "Visitor has been created" });
    router.push(USER_REDIRECT.OWNER({ lang, href: "/visitors" }));
  };

  const data = {
    transactionDate: watch("packageData.transactionDate"),
    fullName: watch("visitorData.fullName"),
    phoneNumber: watch("visitorData.phoneNumber"),
    email: watch("visitorData.email"),
    promoCodeCode: watch("packageData.promoCodeCode"),
    packageId: watch("packageData.packageId"),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
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
                setIsAddingTransaction(!isAddingTransaction);
                if (isAddingTransaction) unregister("packageData");
                if (!isAddingTransaction) setValue("packageData.transactionDate", getTodayDate());
                if (selectedPackage) setSelectedPackage(null);
                if (selectedPaymentMethod) setSelectedPaymentMethod(null);
                if (selectedPromoCode) setSelectedPromoCode(null);
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
          <section className="grid md:grid-cols-2 gap-6">
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
          <section className="grid md:grid-cols-2 gap-6">
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
                    setSelectedPaymentMethod(item as PaymentMethod);
                    setValue("packageData.paymentMethodId", value as string);
                  }}
                />
              )}
            />

            {/* PROMO_CODES */}
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
                    disabled={loadingPromoCode}
                    onClick={async () => {
                      if (!data.packageId) return toast({ type: "warning", t, description: "Pick package first" });
                      if (!data.promoCodeCode) return toast({ type: "warning", t, description: "Fill out the Promo Code first" });
                      setLoadingPromoCode(true);
                      const res = await checkPromoCode({ code: data.promoCodeCode });
                      setLoadingPromoCode(false);
                      if (!res.data) return toast({ type: "error", t, description: "Promo Code is expired or doesn't exist" });
                      setSelectedPromoCode(res.data);
                      toast({ type: "success", t, description: "Promo Code applied" });
                    }}
                    size="m"
                    className="h-full"
                  >
                    {selectedPromoCode?.code ? "Applied" : "Apply"}
                  </Button>
                </section>
              </section>
            </section>
          </section>
        </Fragment>
      ) : null}

      {/* TRANSACTION_INVOICE */}
      {selectedPackage ? (
        <section className="flex justify-center items-center">
          <section className="md:w-[30rem] w-full flex flex-col gap-4 p-3 lg:p-6 shadow bg-light text-dark">
            <section className="flex justify-between w-full">
              <section className="flex flex-col">
                <h6>Package TXN</h6>
                <p className="font-medium">Date: {data.transactionDate ? formatDateShort(getNewDate(data.transactionDate)) : null}</p>
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

            <section className="flex flex-col">
              <p className="font-medium underline">{data.fullName}</p>
              <small>{lozalizePhoneNumber(formatPhoneNumber(data.phoneNumber))}</small>
              <small>{data.email}</small>
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

            <section className="flex flex-col">
              {selectedPackage.validityInDays && data.transactionDate ? (
                <section className="flex flex-col">
                  <section className="flex justify-between">
                    <small>Start</small>
                    <small>Expiry</small>
                  </section>
                  <section className="flex justify-between items-center gap-6">
                    <section className="flex flex-col w-fit">
                      <p className="font-semibold">{formatDateShort(getStartDate(data.transactionDate))}</p>
                    </section>
                    <div className="w-[50%] h-0.5 bg-dark" />
                    <section className="flex flex-col text-right w-fit">
                      <p className="font-semibold">
                        {isDateToday(
                          getExpiryDateFromDate({
                            days: selectedPackage.validityInDays,
                            dateString: data.transactionDate,
                            isVisit: selectedPackage.type === "VISIT",
                          }),
                        )
                          ? "Today"
                          : isDateExpired(
                                getExpiryDateFromDate({
                                  days: selectedPackage.validityInDays,
                                  dateString: data.transactionDate,
                                  isVisit: selectedPackage.type === "VISIT",
                                }),
                              )
                            ? "Expired"
                            : formatDateShort(
                                getExpiryDateFromDate({
                                  days: selectedPackage.validityInDays,
                                  dateString: data.transactionDate,
                                  isVisit: selectedPackage.type === "VISIT",
                                }),
                              )}
                      </p>
                    </section>
                  </section>
                </section>
              ) : null}

              {selectedPackage.totalPermittedSessions ? (
                <small>Permitted sessions: {`${selectedPackage.totalPermittedSessions} session(s)`}</small>
              ) : null}
            </section>

            {selectedPaymentMethod ? (
              <section className="flex w-full bg-blue text-light justify-center text-lg py-1 font-medium shadow-lg">
                PAID BY {selectedPaymentMethod.name.toUpperCase()}
              </section>
            ) : null}

            <section className="flex flex-col justify-center items-center gap-6 mt-6">
              <Logo className="aspect-video w-full md:w-[70%]" />
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
