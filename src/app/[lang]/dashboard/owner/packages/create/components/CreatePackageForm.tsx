"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input, { inputIconSize } from "@/components/Input";
import InputCheckbox from "@/components/InputCheckbox";
import InputTextArea from "@/components/InputTextArea";
import { toast } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { cn } from "@/lib/utils";
import { schema } from "@/schema";
import { type PackageCreateInput } from "@/server/api/routers/package";
import { type PlaceList } from "@/server/api/routers/place";
import { type SportList } from "@/server/api/routers/sport";
import { type UserListTrainer } from "@/server/api/routers/user";
import { inputVariants } from "@/styles/variants";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

const initialData: PackageCreateInput = {
  type: "MEMBER",
  name: "",
  description: null,
  price: 0,
  placeIDs: [],
  sportIDs: [],
  validityInDays: null,
  totalPermittedSessions: null,
  isUnlimitedSessions: true,
};

type Props = {
  createPackage: (data: PackageCreateInput) => Promise<TRPC_RESPONSE>;
  option: { places: PlaceList; sports: SportList; trainers: UserListTrainer };
  t: Dictionary;
  lang: Locale;
};

export default function CreatePackageForm({ option, createPackage, t, lang }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
    resetField,
  } = useForm<PackageCreateInput>({
    resolver: zodResolver(schema.package.create),
    defaultValues: initialData,
  });

  const onSubmit: SubmitHandler<PackageCreateInput> = async (data) => {
    setLoading(true);
    const res = await createPackage(data);
    setLoading(false);
    reset();
    if (!res.status) return toast({ t, type: "error", description: "Package with this name is already exists" });
    toast({ t, type: "success", description: "Package has been created" });
    router.push(USER_REDIRECT.OWNER({ lang, href: "/packages" }));
  };

  const data = {
    type: watch("type"),
    isUnlimitedSessions: watch("isUnlimitedSessions"),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <section className="flex flex-col gap-0.5">
        <label htmlFor="type">Package Type</label>
        <select className={inputVariants()} {...register("type")} id="type">
          <option
            onClick={() => {
              resetField("totalPermittedSessions");
              resetField("trainerIDs");
            }}
            value="MEMBER"
          >
            MEMBER
          </option>
          <option
            onClick={() => {
              resetField("totalPermittedSessions");
              resetField("trainerIDs");
            }}
            value="VISIT"
          >
            VISIT
          </option>
          <option onClick={() => resetField("validityInDays")} value="TRAINER">
            TRAINER
          </option>
        </select>
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        <Input error={errors.name?.message} {...register("name")} icon={ICONS.package} label="Name" />
        <Input
          error={errors.price?.message}
          {...register("price", { setValueAs: (v: string) => (!v ? 0 : parseInt(v)) })}
          type="number"
          icon={ICONS.payment_method}
          label="Price"
        />
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        {data.type === "TRAINER" ? null : (
          <Input
            error={errors.validityInDays?.message}
            icon={ICONS.validity}
            type="number"
            label="Validity In Days"
            min={1}
            {...register("validityInDays", { setValueAs: (v: string) => (!v ? null : parseInt(v)) })}
          />
        )}

        {data.type === "VISIT" ? null : (
          <section className="flex flex-col gap-2">
            <Input
              disabled={data.isUnlimitedSessions && data.type !== "TRAINER"}
              error={errors.totalPermittedSessions?.message}
              {...register("totalPermittedSessions", { setValueAs: (v: string) => (!v ? null : parseInt(v)) })}
              type="number"
              icon={ICONS.session}
              label="Total Permitted Sessions"
            />
            {data.type === "TRAINER" ? null : (
              <InputCheckbox
                onClickButton={() => resetField("totalPermittedSessions")}
                selectedValue={data.isUnlimitedSessions}
                label="Unlimited"
                {...register("isUnlimitedSessions")}
              />
            )}
          </section>
        )}
      </section>
      {/* dropdowns */}

      <Controller
        control={control}
        name="placeIDs"
        render={({ field }) => (
          <section className="flex flex-col gap-0.5">
            <label>Places</label>
            <section className="relative">
              <Select
                options={option.places.map((e) => ({ value: e.id, label: e.name }))}
                {...field}
                mode="multiple"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                style={{ width: "100%" }}
                showSearch
              />
              <Iconify width={inputIconSize} icon={ICONS.place} className="absolute centered-left translate-x-3 text-dark" />
            </section>
            {errors.placeIDs ? <small className={cn("text-red text-xs mt-0.5")}>{errors.placeIDs.message}</small> : null}
          </section>
        )}
      />

      <Controller
        control={control}
        name="sportIDs"
        render={({ field }) => (
          <section className="flex flex-col gap-0.5">
            <label>Sport Type</label>
            <section className="relative">
              <Select
                options={option.sports.map((e) => ({ value: e.id, label: e.name }))}
                {...field}
                mode="multiple"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                style={{ width: "100%" }}
                showSearch
                className="pl-12!"
              />
              <Iconify width={inputIconSize} icon={ICONS.sport} className="absolute centered-left translate-x-3 text-dark" />
            </section>
            {errors.sportIDs ? <small className={cn("text-red text-xs mt-0.5")}>{errors.sportIDs.message}</small> : null}
          </section>
        )}
      />

      {data.type === "TRAINER" ? (
        <Controller
          control={control}
          name="trainerIDs"
          render={({ field }) => (
            <section className="flex flex-col gap-0.5">
              <label>Trainers</label>
              <section className="relative">
                <Select
                  options={option.trainers.map((e) => ({ value: e.id, label: e.fullName }))}
                  {...field}
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  style={{ width: "100%" }}
                  showSearch
                />
                <Iconify width={inputIconSize} icon={ICONS.trainer} className="absolute centered-left translate-x-3 text-dark" />
              </section>
              {errors.trainerIDs ? <small className={cn("text-red text-xs mt-0.5")}>{errors.trainerIDs.message}</small> : null}
            </section>
          )}
        />
      ) : null}

      <InputTextArea error={errors.description?.message} label="Description (optional)" {...register("description")} />
      <section className="flex justify-center items-center">
        <Button
          onClick={() => {
            console.log(watch());
            const val = schema.package.create.safeParse(watch());
            if (!val.success) console.log(val.error);
          }}
          className="md:w-fit w-full"
          loading={loading}
          type="submit"
          color="success"
          size="xl"
        >
          Create Package
        </Button>
      </section>
    </form>
  );
}
