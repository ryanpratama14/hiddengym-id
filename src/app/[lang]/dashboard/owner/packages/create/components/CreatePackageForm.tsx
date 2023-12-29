"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import InputTextArea from "@/components/InputTextArea";
import { toastError, toastSuccess } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { ICONS, PACKAGE_TYPES, USER_REDIRECT } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { schema } from "@/schema";
import { type PackageCreateInput } from "@/server/api/routers/package";
import { type PlaceList } from "@/server/api/routers/place";
import { type SportList } from "@/server/api/routers/sport";
import { type UserListTrainer } from "@/server/api/routers/user";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type PackageType } from "@prisma/client";
import { useRouter } from "next/navigation";
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
  option: { places: PlaceList; sports: SportList; trainers: UserListTrainer };
  t: Dictionary;
  lang: Locale;
};

export default function CreatePackageForm({ option, t, lang }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,

    control,
    resetField,
    setValue,
  } = useForm<PackageCreateInput>({
    resolver: zodResolver(schema.package.create),
    defaultValues: initialData,
  });

  const onSubmit: SubmitHandler<PackageCreateInput> = async (data) => createData(data);

  const { mutate: createData, isLoading: loading } = api.package.create.useMutation({
    onSuccess: (res) => {
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT.OWNER({ lang, href: "/packages" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  const data = {
    type: watch("type"),
    isUnlimitedSessions: watch("isUnlimitedSessions"),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <InputSelect
            icon={ICONS.package}
            {...field}
            options={PACKAGE_TYPES}
            label="Package Type"
            onChange={(e) => {
              const value = e as PackageType;
              setValue("type", value);
              if (value !== "SESSIONS") {
                resetField("totalPermittedSessions");
                resetField("trainerIDs");
              } else resetField("validityInDays");
            }}
          />
        )}
      />

      <section className="grid md:grid-cols-2 gap-6">
        <Input error={errors.name?.message} {...register("name")} icon={ICONS.name} label="Name" />
        <Input
          error={errors.price?.message}
          {...register("price", { setValueAs: (v: string) => (!v ? 0 : parseInt(v)) })}
          type="number"
          icon={ICONS.payment_method}
          label="Price"
        />
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        {data.type === "SESSIONS" ? (
          <Input
            disabled={data.isUnlimitedSessions && data.type !== "SESSIONS"}
            error={errors.totalPermittedSessions?.message}
            {...register("totalPermittedSessions", { setValueAs: (v: string) => (!v ? null : parseInt(v)) })}
            type="number"
            icon={ICONS.session}
            label="Total Sessions"
          />
        ) : (
          <Input
            error={errors.validityInDays?.message}
            icon={ICONS.validity}
            type="number"
            label="Validity In Days"
            min={1}
            {...register("validityInDays", { setValueAs: (v: string) => (!v ? null : parseInt(v)) })}
          />
        )}

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
      </section>
      {/* dropdowns */}

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

      {data.type === "SESSIONS" ? (
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
        <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
          Create Package
        </Button>
      </section>
    </form>
  );
}
