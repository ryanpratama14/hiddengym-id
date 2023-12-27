"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputCheckbox from "@/components/InputCheckbox";
import InputSelect from "@/components/InputSelect";
import InputTextArea from "@/components/InputTextArea";
import { toast } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { schema } from "@/schema";
import { type PackageCreateInput } from "@/server/api/routers/package";
import { type PlaceList } from "@/server/api/routers/place";
import { type SportList } from "@/server/api/routers/sport";
import { type UserListTrainer } from "@/server/api/routers/user";
import { inputVariants } from "@/styles/variants";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
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
          <InputSelect
            {...field}
            mode="multiple"
            showSearch={false}
            options={option.places.map((e) => ({ value: e.id, label: e.name }))}
            icon={ICONS.place}
            error={errors.placeIDs?.message}
            label="Places"
          />
        )}
      />

      <Controller
        control={control}
        name="sportIDs"
        render={({ field }) => (
          <InputSelect
            {...field}
            showSearch={false}
            mode="multiple"
            options={option.sports.map((e) => ({ value: e.id, label: e.name }))}
            icon={ICONS.sport}
            error={errors.sportIDs?.message}
            label="Sport Types"
          />
        )}
      />

      {data.type === "TRAINER" ? (
        <Controller
          control={control}
          name="trainerIDs"
          render={({ field }) => (
            <InputSelect
              showSearch={false}
              {...field}
              mode="multiple"
              options={option.trainers.map((e) => ({ value: e.id, label: e.fullName }))}
              icon={ICONS.trainer}
              error={errors.trainerIDs?.message}
              label="Trainers"
            />
          )}
        />
      ) : null}

      <InputTextArea
        error={errors.description?.message}
        label="Description (optional)"
        {...register("description", { setValueAs: (v: string) => (v ? v : null) })}
      />
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
