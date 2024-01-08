"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import InputTextArea from "@/components/InputTextArea";
import { toastError, toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { ICONS, USER_REDIRECT } from "@/lib/constants";
import { cn } from "@/lib/functions";
import { schema } from "@/schema";
import { type PackageCreateInput, type PackageDetail } from "@/server/api/routers/package";
import { type PlaceList } from "@/server/api/routers/place";
import { type SportList } from "@/server/api/routers/sport";
import { type UserListTrainer } from "@/server/api/routers/user";
import { api } from "@/trpc/react";
import { type Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  option: { places: PlaceList; sports: SportList; trainers: UserListTrainer };
  t: Dictionary;

  data: PackageDetail;
};

export default function UpdatePackageForm({ option, t, data }: Props) {
  const { lang } = useZustand();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<PackageCreateInput>({
    resolver: zodResolver(schema.package.create),
    defaultValues: {
      type: data.type,
      name: data.name,
      description: data.description,
      price: data.price,
      validityInDays: data.validityInDays,
      placeIDs: data.placeIDs,
      sportIDs: data.sportIDs,
      trainerIDs: data.trainerIDs,
      approvedSessions: data.approvedSessions,
    },
  });

  const onSubmit: SubmitHandler<PackageCreateInput> = async (updatedData) => updateData({ body: updatedData, id: data.id });

  const { mutate: updateData, isLoading: loading } = api.package.update.useMutation({
    onSuccess: (res) => {
      toastSuccess({ t, description: res.message });
      router.push(USER_REDIRECT.OWNER({ lang, href: "/packages" }));
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  const watchedData = { type: watch("type") };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      <h6 className="px-2 border-1 border-dark w-fit">{watchedData.type}</h6>

      <section className="grid md:grid-cols-2 gap-4 md:gap-6">
        <Input error={errors.name?.message} {...register("name")} icon={ICONS.name} label="Name" />
        <Input
          error={errors.price?.message}
          {...register("price", { setValueAs: (v: string) => (!v ? 0 : parseInt(v)) })}
          type="number"
          icon={ICONS.payment_method}
          label="Price"
        />
      </section>
      <section className="grid md:grid-cols-2 gap-4 md:gap-6">
        <section className={cn("grid gap-6", { "grid-cols-2": watchedData.type === "SESSIONS" })}>
          {watchedData.type === "SESSIONS" ? (
            <Input
              disabled={watchedData.type !== "SESSIONS"}
              error={errors.approvedSessions?.message}
              {...register("approvedSessions", { setValueAs: (v: string) => (!v ? null : parseInt(v)) })}
              type="number"
              icon={ICONS.session}
              label="Approved Sessions"
            />
          ) : null}
          <Input
            error={errors.validityInDays?.message}
            icon={ICONS.validity}
            type="number"
            label="Validity In Days"
            {...register("validityInDays", { setValueAs: (v: string) => (!v ? null : parseInt(v)) })}
          />
        </section>

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

      {watchedData.type === "SESSIONS" ? (
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
          Update Package
        </Button>
      </section>
    </form>
  );
}
