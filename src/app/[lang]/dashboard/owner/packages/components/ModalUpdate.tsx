"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import InputTextArea from "@/components/InputTextArea";
import { Modal } from "@/components/Modal";
import { toastError, toastSuccess } from "@/components/Toast";
import { ICONS } from "@/lib/constants";
import { cn } from "@/lib/functions";
import { schema } from "@/schema";
import { type PackageDetail, type PackageUpdateInput } from "@/server/api/routers/package";
import { api } from "@/trpc/react";
import { type Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  t: Dictionary;
  data: PackageDetail | null;
  show: boolean;
  closeModal: () => void;
};

export default function ModalUpdate({ t, data, show, closeModal }: Props) {
  const utils = api.useUtils();
  const { data: places } = api.place.list.useQuery();
  const { data: sports } = api.sport.list.useQuery();
  const { data: trainers } = api.user.list.useQuery({ role: "TRAINER", pagination: false, sort: "fullName-asc" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm<PackageUpdateInput>({
    resolver: zodResolver(schema.package.update),
  });

  const onSubmit: SubmitHandler<PackageUpdateInput> = async (data) => updateData(data);

  const { mutate: updateData, isPending: loading } = api.package.update.useMutation({
    onSuccess: async (res) => {
      toastSuccess({ t, description: res.message });
      closeModal();
      await utils.package.list.invalidate();
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  const watchedData = { type: watch("body.type") };

  useEffect(() => {
    if (show && data) {
      reset({
        id: data.id,
        body: {
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
    }
  }, [show, data]);

  return (
    <Modal show={show} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
          <h6 className="px-2 border-1 border-dark w-fit">{watchedData.type}</h6>
          <section className="grid md:grid-cols-2 gap-4">
            <Input error={errors.body?.name?.message} {...register("body.name")} icon={ICONS.name} label="Name" />
            <Input
              error={errors.body?.price?.message}
              {...register("body.price", { setValueAs: (v: string) => parseInt(v) })}
              type="number"
              icon={ICONS.payment_method}
              label="Price"
            />
          </section>
          <section className="grid md:grid-cols-2 gap-4">
            <section className={cn("grid gap-4", { "grid-cols-2": watchedData.type === "SESSIONS" })}>
              {watchedData.type === "SESSIONS" ? (
                <Input
                  disabled={watchedData.type !== "SESSIONS"}
                  error={errors.body?.approvedSessions?.message}
                  {...register("body.approvedSessions", { setValueAs: (v: string) => (!v ? null : parseInt(v)) })}
                  type="number"
                  icon={ICONS.session}
                  label="Approved Sessions"
                />
              ) : null}
              <Input
                error={errors.body?.validityInDays?.message}
                icon={ICONS.validity}
                type="number"
                label="Validity In Days"
                {...register("body.validityInDays", { setValueAs: (v: string) => (!v ? null : parseInt(v)) })}
              />
            </section>

            <Controller
              control={control}
              name="body.placeIDs"
              render={({ field }) => (
                <InputSelect
                  {...field}
                  mode="multiple"
                  showSearch={false}
                  options={places?.map((e) => ({ value: e.id, label: e.name }))}
                  icon={ICONS.place}
                  error={errors.body?.placeIDs?.message}
                  label="Places"
                />
              )}
            />
          </section>

          <Controller
            control={control}
            name="body.sportIDs"
            render={({ field }) => (
              <InputSelect
                {...field}
                showSearch={false}
                mode="multiple"
                options={sports?.map((e) => ({ value: e.id, label: e.name }))}
                icon={ICONS.sport}
                error={errors.body?.sportIDs?.message}
                label="Sport Types"
              />
            )}
          />

          {watchedData.type === "SESSIONS" ? (
            <Controller
              control={control}
              name="body.trainerIDs"
              render={({ field }) => (
                <InputSelect
                  showSearch={false}
                  {...field}
                  mode="multiple"
                  options={trainers?.data?.map((e) => ({ value: e.id, label: e.fullName }))}
                  icon={ICONS.trainer}
                  error={errors.body?.trainerIDs?.message}
                  label="Trainers"
                />
              )}
            />
          ) : null}

          <InputTextArea
            error={errors.body?.description?.message}
            label="Description (optional)"
            {...register("body.description", { setValueAs: (v: string) => (v ? v : null) })}
          />
          <section className="flex justify-center items-center">
            <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
              Update Package
            </Button>
          </section>
        </form>
      </Modal.Body>
    </Modal>
  );
}
