"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { toastError, toastSuccess, toastWarning } from "@/components/Toast";
import TransactionInvoice from "@/components/TransactionInvoice";
import { useZustand } from "@/global/store";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { cn, formatCurrency, getInputDate, localizePhoneNumber } from "@/lib/functions";
import { api } from "@/trpc/react";
import type { Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Gender } from "@prisma/client";
import type { ProductTransactionCreateInput } from "@router/productTransaction";
import { schema } from "@schema";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, type SubmitHandler, useFieldArray, useForm } from "react-hook-form";

const productInitialData = { unitPrice: 0, quantity: 1, productId: "", name: "" };

type SelectedUser = { fullName: string; email: null | string; phoneNumber: string; tz: string; gender: Gender };

type Props = { t: Dictionary };

export default function CreateProductTransactionForm({ t }: Props) {
  const { data: paymentMethods } = api.paymentMethod.list.useQuery();
  const { data: products } = api.product.list.useQuery({});

  const { lang } = useZustand();
  const router = useRouter();
  const [selectedBuyer, setSelectedBuyer] = useState<SelectedUser>({
    fullName: "",
    email: null,
    phoneNumber: "",
    tz: "",
    gender: "MALE",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: visitors, isFetching: loadingSearch } = api.user.list.useQuery(
    { search: debouncedSearch, role: "VISITOR", pagination: false, sort: "fullName-asc" },
    { enabled: !!debouncedSearch },
  );

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    clearErrors,
  } = useForm<ProductTransactionCreateInput>({
    resolver: zodResolver(schema.productTransaction.create),
    defaultValues: {
      transactionDate: getInputDate({}),
      buyerId: "",
      paymentMethodId: "",
      products: [productInitialData],
    },
  });

  const { fields, insert, remove } = useFieldArray({ control, name: "products" });

  const onSubmit: SubmitHandler<ProductTransactionCreateInput> = (data) => createData(data);

  const { mutate: createData, isPending: loading } = api.productTransaction.create.useMutation({
    onSuccess: (res) => {
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT({ lang, href: "/transactions/products", role: "OWNER" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  const data = { products: watch("products"), transactionDate: watch("transactionDate") };

  console.log(watch());

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
              error={errors?.buyerId?.message}
              showSearch={true}
              {...field}
              icon={ICONS.person}
              options={visitors?.data?.map((e) => ({
                email: e.email,
                phoneNumber: e.phoneNumber,
                value: e.id,
                label: `${e.fullName} ${localizePhoneNumber(e.phoneNumber)}`,
                fullName: e.fullName,
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
                  tz: user.tz,
                  gender: user.gender,
                });
                setValue("buyerId", value as string);
                clearErrors("buyerId");
              }}
            />
          )}
        />
        <Input
          max={getInputDate({})}
          error={errors?.transactionDate?.message}
          label="Transaction Date"
          {...register("transactionDate")}
          type="date"
        />
      </section>
      <section className="grid md:grid-cols-2 gap-4">
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
                      options={products?.map((e) => ({
                        name: e.name,
                        unitPrice: e.price,
                        value: e.id,
                        label: `${e.name} - ${formatCurrency(e.price)}`,
                        disabled: data.products.map((e) => e.productId).includes(e.id),
                      }))}
                      onChange={(e, item) => {
                        const data = structuredClone(item) as { unitPrice: number; name: string };
                        setValue(`products.${index}.unitPrice`, data.unitPrice);
                        setValue(`products.${index}.name`, data.name);
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
              onClick={() => {
                if (products?.length === data?.products.length) {
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
        <Controller
          control={control}
          name="paymentMethodId"
          render={({ field }) => (
            <InputSelect
              showSearch={false}
              {...field}
              icon={ICONS.payment_method}
              error={errors.paymentMethodId?.message}
              options={paymentMethods?.map((e) => ({ value: e.id, label: e.name }))}
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

      {selectedBuyer.tz && data.products.length ? (
        <TransactionInvoice>
          <TransactionInvoice.Header
            tz={selectedBuyer.tz}
            title="Product"
            transactionDate={data.transactionDate}
            totalPrice={data.products.reduce((sum, product) => {
              const productTotalPrice = product.quantity * product.unitPrice;
              return sum + productTotalPrice;
            }, 0)}
          />
          <TransactionInvoice.Buyer
            gender={selectedBuyer.gender}
            fullName={selectedBuyer.fullName}
            phoneNumber={selectedBuyer.phoneNumber}
            email={selectedBuyer.email}
          />
          <TransactionInvoice.Products products={data.products} />
          <TransactionInvoice.PaymentMethod paymentMethod={selectedPaymentMethod} />
        </TransactionInvoice>
      ) : null}

      <section className="flex justify-center items-center">
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Product Transaction
        </Button>
      </section>
    </form>
  );
}
