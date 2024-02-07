import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { Modal } from "@/components/Modal";
import { toastError, toastSuccess, toastWarning } from "@/components/Toast";
import { GENDERS, ICONS } from "@/lib/constants";
import { cn, formatCurrency, getInputDate, localizePhoneNumber } from "@/lib/functions";
import { api } from "@/trpc/react";
import type { Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductTransactionDetail, ProductTransactionUpdateInput } from "@router/productTransaction";
import { schema } from "@schema";
import { Skeleton } from "antd";
import { useEffect } from "react";
import { Controller, type SubmitHandler, useFieldArray, useForm } from "react-hook-form";

type Props = {
  show: boolean;
  closeModal: () => void;
  data?: ProductTransactionDetail;
  t: Dictionary;
};

const productInitialData = { unitPrice: 0, quantity: 1, productId: "" };

export default function ModalUpdate({ show, closeModal, data, t }: Props) {
  const utils = api.useUtils();
  const { data: paymentMethods } = api.paymentMethod.list.useQuery();
  const { data: products } = api.product.list.useQuery({});

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
    watch,
  } = useForm<ProductTransactionUpdateInput>({ mode: "onBlur", resolver: zodResolver(schema.productTransaction.update) });
  const { fields, insert, remove } = useFieldArray({ control, name: "body.products" });

  const onSubmit: SubmitHandler<ProductTransactionUpdateInput> = (data) => updateData(data);

  const { mutate: updateData, isPending: loading } = api.productTransaction.update.useMutation({
    onSuccess: async (res) => {
      toastSuccess({ t, description: res.message });
      closeModal();
      await utils.productTransaction.list.invalidate();
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  const watchedData = { products: watch("body.products") };

  useEffect(() => {
    if (data && show) {
      reset({
        id: data.id,
        body: {
          transactionDate: getInputDate({ date: data.transactionDate }),
          paymentMethodId: data.paymentMethodId,
          buyerId: data.buyerId,
          products: data.products.map((e) => ({ productId: e.productId, quantity: e.quantity, unitPrice: e.unitPrice })),
        },
      });
    }
  }, [data, show]);

  return (
    <Modal classNameDiv="xl:w-[50%]" show={show} closeModal={closeModal}>
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
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <section className="grid md:grid-cols-2 gap-4">
              <Input
                max={getInputDate({})}
                label="Transaction Date"
                {...register("body.transactionDate")}
                error={errors.body?.transactionDate?.message}
                type="date"
              />
              <Controller
                control={control}
                name="body.paymentMethodId"
                render={({ field }) => (
                  <InputSelect
                    showSearch={false}
                    {...field}
                    icon={ICONS.payment_method}
                    error={errors.body?.paymentMethodId?.message}
                    options={paymentMethods?.map((e) => ({ value: e.id, label: e.name }))}
                    label="Payment Method"
                  />
                )}
              />
            </section>
            <section className="flex flex-col gap-0.5">
              <section className="grid grid-cols-3 gap-4 text-left">
                <p className="font-medium col-span-2">Products</p>
                <p className="font-medium">Quantity</p>
              </section>
              <section className="flex flex-col gap-2">
                {fields.map((field, index) => (
                  <section key={field.id} className="grid grid-cols-3 gap-4">
                    <Controller
                      control={control}
                      name={`body.products.${index}.productId`}
                      key={field.id}
                      render={({ field }) => (
                        <InputSelect
                          className="col-span-2"
                          showSearch={true}
                          icon={ICONS.product}
                          error={errors.body?.products?.[index]?.productId?.message}
                          {...field}
                          options={products?.map((e) => ({
                            unitPrice: e.price,
                            value: e.id,
                            label: `${e.name} - ${formatCurrency(e.price)}`,
                            disabled: watchedData.products.map((e) => e.productId).includes(e.id),
                          }))}
                          onChange={(e, item) => {
                            const data = structuredClone(item) as { unitPrice: number };
                            setValue(`body.products.${index}.unitPrice`, data.unitPrice);
                            setValue(`body.products.${index}.productId`, e as string);
                            clearErrors(`body.products.${index}.productId`);
                          }}
                        />
                      )}
                    />
                    <section className="flex justify-between text-left">
                      <Input
                        classNameDiv={cn("w-[70%]", { "w-full": fields.length === 1 })}
                        {...register(`body.products.${index}.quantity`, { setValueAs: (v) => +v })}
                        type="number"
                        error={errors.body?.products?.[index]?.quantity?.message}
                      />

                      {fields.length === 1 ? null : (
                        <section className="w-[30%] justify-end flex items-center">
                          <Iconify onClick={() => remove(index)} icon={ICONS.delete} className="text-red" width={30} />
                        </section>
                      )}
                    </section>
                  </section>
                ))}
              </section>
              <section className="flex justify-end mt-2 pr-[0.15rem]">
                <section
                  onClick={() => {
                    if (products?.length === watchedData?.products.length) {
                      return toastWarning({ t, description: "All available products are already selected or can be selected." });
                    }
                    insert(fields.length, productInitialData);
                  }}
                  className="relative size-6 bg-dark text-light cursor-pointer"
                >
                  <Iconify className="absolute centered" icon={ICONS.add} width={25} />
                </section>
              </section>
            </section>

            <section className="flex justify-center items-center">
              <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
                Update Product Transaction
              </Button>
            </section>
          </form>
        </section>
      </Modal.Body>
    </Modal>
  );
}
