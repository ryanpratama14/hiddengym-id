import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { Modal } from "@/components/Modal";
import { toastError, toastSuccess, toastWarning } from "@/components/Toast";
import { GENDERS, ICONS } from "@/lib/constants";
import { cn, getInputDate, localizePhoneNumber } from "@/lib/functions";
import { schema } from "@/schema";
import { type PackageList } from "@/server/api/routers/package";
import { type PackageTransactionDetail, type PackageTransactionUpdateInput } from "@/server/api/routers/packageTransaction";
import { type PaymentMethodList } from "@/server/api/routers/paymentMethod";
import { inputVariants } from "@/styles/variants";
import { api } from "@/trpc/react";
import type { Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Package, PromoCode } from "@prisma/client";
import { Skeleton } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  show: boolean;
  closeModal: () => void;
  data?: PackageTransactionDetail;
  option: { packages: PackageList; paymentMethods: PaymentMethodList };
  t: Dictionary;
};

export default function ModalUpdate({ show, closeModal, data, option, t }: Props) {
  const utils = api.useUtils();
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<PackageTransactionUpdateInput>({ resolver: zodResolver(schema.packageTransaction.update) });

  const onSubmit: SubmitHandler<PackageTransactionUpdateInput> = (data) => updateData(data);

  const { mutate: updateData, isPending: loading } = api.packageTransaction.update.useMutation({
    onSuccess: async (res) => {
      t && toastSuccess({ t, description: res.message });
      closeModal();
      await utils.packageTransaction.list.invalidate();
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  const { mutate: checkPromoCode, isPending: loadingPromoCode } = api.promoCode.checkPromoCode.useMutation({
    onSuccess: (res) => {
      setValue("body.promoCodeId", res.data.id);
      t && toastSuccess({ t, description: res.message });
    },
    onError: (res) => t && toastError({ t, description: res.message }),
  });

  const watchedData = {
    packageId: watch("body.packageId"),
    promoCodeCode: watch("body.promoCodeCode"),
  };

  useEffect(() => {
    if (data && show) {
      if (data.promoCode) {
        setSelectedPromoCode(data.promoCode);
      } else setSelectedPromoCode(null);
      reset({
        id: data.id,
        body: {
          buyerId: data.buyerId,
          packageId: data.packageId,
          transactionDate: getInputDate({ date: data.transactionDate }),
          startDate: data.startDate ? getInputDate({ date: data.startDate }) : null,
          promoCodeCode: data.promoCode?.code,
          promoCodeId: data.promoCodeId,
          unitPrice: data.unitPrice,
          paymentMethodId: data.paymentMethodId,
        },
      });
    }
  }, [data, show]);

  return (
    <Modal show={show} closeModal={closeModal}>
      <Modal.Body>
        <section className="flex flex-col gap-4">
          {data ? (
            <section className="flex flex-col">
              <section className="flex gap-1 items-center justify-center">
                <Iconify icon={GENDERS[data.buyer.gender].icon} color={GENDERS[data.buyer.gender].color} width={25} />
                <h6>{data.buyer.fullName}</h6>
              </section>
              <small>{localizePhoneNumber(data.buyer.phoneNumber)}</small>
              <small>{data.buyer.email}</small>
            </section>
          ) : (
            <Skeleton />
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
            <Controller
              control={control}
              name="body.packageId"
              render={({ field }) => (
                <InputSelect
                  showSearch={false}
                  {...field}
                  icon={ICONS.package}
                  error={errors.body?.packageId?.message}
                  options={option.packages.map((e) => ({ ...e, value: e.id, label: `${e.type} - ${e.name}` }))}
                  label="Package"
                  onChange={(value, item) => {
                    const data = structuredClone(item) as Package;
                    setValue("body.packageId", value as string);
                    setValue("body.unitPrice", data.price);
                  }}
                />
              )}
            />
            <section className="grid grid-cols-2 gap-4">
              <Input label="Transaction Date" {...register("body.transactionDate")} type="date" />
              <Input label="Start Date" {...register("body.startDate")} type="date" />
            </section>

            <Controller
              control={control}
              name="body.paymentMethodId"
              render={({ field }) => (
                <InputSelect
                  showSearch={false}
                  {...field}
                  icon={ICONS.payment_method}
                  error={errors.body?.paymentMethodId?.message}
                  options={option.paymentMethods.map((e) => ({ value: e.id, label: e.name }))}
                  label="Payment Method"
                />
              )}
            />

            <section className="grid md:grid-cols-2 gap-4">
              <Input
                {...register("body.unitPrice", { setValueAs: (v: string) => parseInt(v) })}
                label="Unit Price"
                disabled={!watchedData.packageId}
                type="number"
              />

              <section className="flex flex-col gap-0.5">
                <label htmlFor="promoCodeCode" className="text-left">
                  Promo Code (Optional)
                </label>
                <section className="flex flex-col">
                  <section className="grid grid-cols-3 items-end gap-2">
                    <input
                      disabled={loadingPromoCode || !!selectedPromoCode?.code}
                      id="promoCodeCode"
                      {...register("body.promoCodeCode")}
                      className={cn("col-span-2 font-mono", inputVariants(), {
                        "border-dark/30": loadingPromoCode || !!selectedPromoCode?.code,
                      })}
                    />
                    <Button
                      icon={selectedPromoCode?.code && ICONS.check}
                      color={selectedPromoCode ? "active" : "primary"}
                      loading={loadingPromoCode}
                      disabled={loadingPromoCode || !!selectedPromoCode?.id}
                      onClick={() => {
                        if (!watchedData.promoCodeCode) return toastWarning({ t, description: "Fill out the Promo Code first" });
                        if (data) checkPromoCode({ code: watchedData.promoCodeCode, birthDate: data.buyer.birthDate });
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

            <section className="flex justify-center items-center">
              <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
                Update Package Transaction
              </Button>
            </section>
          </form>
        </section>
      </Modal.Body>
    </Modal>
  );
}
