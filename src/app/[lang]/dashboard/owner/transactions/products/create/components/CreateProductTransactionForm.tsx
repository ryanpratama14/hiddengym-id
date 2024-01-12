"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { toastError, toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { cn, formatCurrency, getInputDate } from "@/lib/functions";
import { schema } from "@/schema";
import { type PaymentMethodList } from "@/server/api/routers/paymentMethod";
import { type ProductList } from "@/server/api/routers/product";
import { type ProductTransactionInput } from "@/server/api/routers/productTransaction";
import { type UserListVisitor } from "@/server/api/routers/user";
import { api } from "@/trpc/react";
import { type Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm, type SubmitHandler } from "react-hook-form";

const productInitialData = { unitPrice: 0, quantity: 1, productId: "" };

type Props = { t: Dictionary; option: { paymentMethods: PaymentMethodList; products: ProductList; visitors: UserListVisitor } };

export default function CreateProductTransactionForm({ t, option }: Props) {
  const [selectedBuyer, setSelectedBuyer] = useState({ fullName: "", email: "", phoneNumber: "" });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const { lang } = useZustand();
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    clearErrors,
  } = useForm<ProductTransactionInput>({
    resolver: zodResolver(schema.productTransaction.create),
    defaultValues: { transactionDate: getInputDate(), buyerId: "", paymentMethodId: "", products: [productInitialData] },
  });

  const { fields, insert, remove } = useFieldArray({ control, name: "products" });

  const onSubmit: SubmitHandler<ProductTransactionInput> = (data) => createData(data);

  const { mutate: createData, isPending: loading } = api.productTransaction.create.useMutation({
    onSuccess: (res) => {
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT.OWNER({ lang, href: "/transactions/products" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  const data = {
    products: watch("products"),
  };

  console.log(fields);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      <section className="grid md:grid-cols-2 gap-4 md:gap-6">
        <Controller
          control={control}
          name="buyerId"
          render={({ field }) => (
            <InputSelect
              error={errors?.buyerId?.message}
              showSearch={true}
              {...field}
              icon={ICONS.person}
              options={option.visitors.map((e) => ({ ...e, value: e.id, label: e.fullName }))}
              label="Buyer"
              onChange={(value, item) => {
                const data = structuredClone(item) as User;
                setSelectedBuyer({ fullName: data.fullName, email: data.email ?? "", phoneNumber: data.phoneNumber });
                setValue("buyerId", value as string);
                clearErrors("buyerId");
              }}
            />
          )}
        />
        <Input label="Transaction Date" {...register("transactionDate")} type="date" />
      </section>
      <section className="grid md:grid-cols-2 gap-4 md:gap-6">
        <section className="flex flex-col gap-0.5">
          <section className="grid grid-cols-3 gap-4">
            <p className="font-medium col-span-2">Products</p>
            <p className="font-medium">Quantity</p>
          </section>
          <section className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <section key={field.id} className="grid grid-cols-3 gap-4">
                <Controller
                  control={control}
                  name={`products.${index}.productId`}
                  key={field.id}
                  render={({ field }) => (
                    <InputSelect
                      className="col-span-2"
                      showSearch={true}
                      icon={ICONS.product}
                      error={errors.products?.[index]?.productId?.message}
                      {...field}
                      options={option.products.map((e) => ({
                        unitPrice: e.price,
                        value: e.id,
                        label: `${e.name} - ${formatCurrency(e.price)}`,
                      }))}
                      onChange={(e, item) => {
                        const data = structuredClone(item) as { unitPrice: number };
                        setValue(`products.${index}.unitPrice`, data.unitPrice);
                        setValue(`products.${index}.productId`, e as string);
                        clearErrors(`products.${index}.productId`);
                      }}
                    />
                  )}
                />
                <section className="flex justify-between">
                  <Input
                    classNameDiv={cn("w-[70%]", { "w-full": fields.length === 1 })}
                    {...register(`products.${index}.quantity`, { setValueAs: (v) => +v })}
                    type="number"
                    error={errors.products?.[index]?.quantity?.message}
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
              onClick={() => insert(fields.length, productInitialData)}
              className="relative size-6 bg-dark text-light cursor-pointer"
            >
              <Iconify className="absolute centered" icon={ICONS.add} width={25} />
            </section>
          </section>
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
                const data = structuredClone(item) as { value: string; label: string };
                setSelectedPaymentMethod(data.label);
                setValue("paymentMethodId", value as string);
                clearErrors("paymentMethodId");
              }}
            />
          )}
        />
      </section>

      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Product Transaction
        </Button>
      </section>
    </form>
  );
}
