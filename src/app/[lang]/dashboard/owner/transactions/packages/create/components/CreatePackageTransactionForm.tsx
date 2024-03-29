"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { toastError, toastSuccess, toastWarning } from "@/components/Toast";
import TransactionInvoice from "@/components/TransactionInvoice";
import { useZustand } from "@/global/store";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { cn, getInputDate, localizePhoneNumber } from "@/lib/functions";
import { inputVariants } from "@/styles/variants";
import { api } from "@/trpc/react";
import type { Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Gender, Package, PromoCode } from "@prisma/client";
import type { PackageList } from "@router/package";
import type { PackageTransactionCreateInput } from "@router/packageTransaction";
import type { PaymentMethodList } from "@router/paymentMethod";
import { schema } from "@schema";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

type Props = {
  t: Dictionary;
  option: { packages: PackageList; paymentMethods: PaymentMethodList };
};

type SelectedUser = {
  fullName: string;
  email: null | string;
  phoneNumber: string;
  birthDate: null | Date;
  tz: string;
  gender: Gender;
};

export default function CreatePackageTransactionForm({ t, option }: Props) {
  const { lang } = useZustand();
  const router = useRouter();
  const [selectedBuyer, setSelectedBuyer] = useState<SelectedUser>({
    fullName: "",
    email: null,
    phoneNumber: "",
    birthDate: null,
    tz: "",
    gender: "MALE",
  });
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: visitors, isFetching: loadingSearch } = api.user.list.useQuery(
    { search: debouncedSearch, role: "VISITOR", pagination: false, sort: "fullName-asc" },
    { enabled: !!debouncedSearch },
  );

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
    mode: "onBlur",
    resolver: zodResolver(schema.packageTransaction.create),
    defaultValues: {
      transactionDate: getInputDate({}),
      startDate: getInputDate({}),
      paymentMethodId: "",
      buyerId: "",
      packageId: "",
      promoCodeId: null,
    },
  });

  const onSubmit: SubmitHandler<PackageTransactionCreateInput> = (data) => createData(data);

  const data = {
    transactionDate: watch("transactionDate"),
    startDate: watch("startDate"),
    promoCodeCode: watch("promoCodeCode"),
    packageId: watch("packageId"),
    promoCodeId: watch("promoCodeId"),
    unitPrice: watch("unitPrice"),
  };

  const { mutate: createData, isPending: loading } = api.packageTransaction.create.useMutation({
    onSuccess: (res) => {
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT({ lang, href: "/transactions/packages", role: "OWNER" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  const { mutate: checkPromoCode, isPending: loadingPromoCode } = api.promoCode.checkPromoCode.useMutation({
    onSuccess: (res) => {
      setSelectedPromoCode(res.data);
      setValue("promoCodeId", res.data.id);
      toastSuccess({ t, description: res.message });
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <section className="grid md:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="buyerId"
          render={({ field }) => (
            <InputSelect
              loading={loadingSearch}
              onSearch={(e) => setSearch(e)}
              showSearch={true}
              {...field}
              icon={ICONS.person}
              error={errors.buyerId?.message}
              options={visitors?.data?.map((e) => ({
                email: e.email,
                phoneNumber: e.phoneNumber,
                value: e.id,
                label: `${e.fullName}, ${localizePhoneNumber(e.phoneNumber)}`,
                fullName: e.fullName,
                birthDate: e.birthDate,
                tz: e.tz,
                gender: e.gender,
              }))}
              label="Buyer"
              onChange={(value, item) => {
                const user = structuredClone(item) as SelectedUser;
                setSelectedBuyer({
                  fullName: user.fullName,
                  email: user.email,
                  phoneNumber: user.phoneNumber,
                  birthDate: user.birthDate,
                  tz: user.tz,
                  gender: user.gender,
                });
                setValue("buyerId", value as string);
                clearErrors("buyerId");
                if (selectedPromoCode && selectedPromoCode.type === "STUDENT") setSelectedPromoCode(null);
                if (data.promoCodeCode) resetField("promoCodeCode");
                if (data.promoCodeId) resetField("promoCodeId");
              }}
            />
          )}
        />
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
                const data = structuredClone(item) as Package;
                setSelectedPackage(data);
                setValue("packageId", value as string);
                setValue("unitPrice", data.price);
                clearErrors("packageId");
              }}
            />
          )}
        />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <section className="grid grid-cols-2 gap-4">
          <Input
            max={getInputDate({})}
            error={errors.transactionDate?.message}
            label="Transaction Date"
            {...register("transactionDate")}
            type="date"
          />
          <Input error={errors.startDate?.message} label="Start Date" {...register("startDate")} type="date" />
        </section>
        <Controller
          control={control}
          name="paymentMethodId"
          render={({ field }) => (
            <InputSelect
              showSearch={false}
              {...field}
              icon={ICONS.payment_method}
              error={errors.paymentMethodId?.message}
              options={option.paymentMethods.map((e) => ({ value: e.id, label: e.name }))}
              label="Payment Method"
              onChange={(value, item) => {
                const option = structuredClone(item) as { value: string; label: string };
                setSelectedPaymentMethod(option.label);
                setValue("paymentMethodId", value as string);
                clearErrors("paymentMethodId");
              }}
            />
          )}
        />
      </section>

      {/* PROMO_CODES */}
      <section className="grid md:grid-cols-2 gap-4">
        <Input
          {...register("unitPrice", { setValueAs: (v: string) => parseInt(v) })}
          label="Unit Price"
          disabled={!data.packageId}
          type="number"
        />
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
                className="h-10"
              >
                {selectedPromoCode?.code ? "Applied" : "Apply"}
              </Button>
            </section>
          </section>
        </section>
      </section>

      {selectedBuyer.tz && selectedPackage && data.unitPrice ? (
        <TransactionInvoice>
          <TransactionInvoice.Header
            tz={selectedBuyer.tz}
            title="Package"
            totalPrice={selectedPromoCode?.discountPrice ? data.unitPrice - selectedPromoCode?.discountPrice : data.unitPrice}
            transactionDate={data.transactionDate}
          />
          <TransactionInvoice.Buyer
            gender={selectedBuyer.gender}
            fullName={selectedBuyer.fullName}
            email={selectedBuyer.email}
            phoneNumber={selectedBuyer.phoneNumber}
          />
          <TransactionInvoice.Package unitPrice={data.unitPrice} package={selectedPackage} promoCode={selectedPromoCode} />
          <TransactionInvoice.Validity
            validityInDays={selectedPackage.validityInDays}
            startDate={data.startDate}
            tz={selectedBuyer.tz}
          />
          <TransactionInvoice.ApprovedSessions approvedSessions={selectedPackage.approvedSessions} />
          <TransactionInvoice.PaymentMethod paymentMethod={selectedPaymentMethod} />
        </TransactionInvoice>
      ) : null}

      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Package Transaction
        </Button>
      </section>
    </form>
  );
}
