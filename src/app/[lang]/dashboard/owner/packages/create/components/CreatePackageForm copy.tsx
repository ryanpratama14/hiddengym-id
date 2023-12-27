"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { schema } from "@/schema";
import { type PackageCreateInput } from "@/server/api/routers/package";
import { inputVariants } from "@/styles/variants";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

const initialData: PackageCreateInput = {
  type: "MEMBER",
  name: "",
  description: "",
  price: 0,
  placeIDs: [],
  sportIDs: [],
  validityInDays: null,
  totalPermittedSessions: null,
};

type Props = {
  createPackage: (data: PackageCreateInput) => Promise<TRPC_RESPONSE>;
};

export default function CreatePackageForm({ createPackage }: Props) {
  const [isUnlimitedSessions, setIsUnlimitedSession] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
    watch,
    resetField,
  } = useForm<PackageCreateInput>({
    resolver: zodResolver(schema.package.create),
    defaultValues: initialData,
  });

  const onSubmit: SubmitHandler<PackageCreateInput> = async (data) => {
    console.log(data);
  };

  const watchedData = {
    type: watch("type"),
  };

  useEffect(() => {
    if (watchedData.type === "TRAINER") {
      unregister("validityInDays");
      setIsUnlimitedSession(false);
    }
    if (watchedData.type === "VISIT") unregister("totalPermittedSessions");
  }, [watchedData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <section className="flex flex-col">
        <label htmlFor="type">Package Type</label>
        <select className={inputVariants()} {...register("type")} id="type">
          <option value="MEMBER">MEMBER</option>
          <option value="VISIT">VISIT</option>
          <option value="TRAINER">TRAINER</option>
        </select>
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        <Input error={errors.name?.message} {...register("name")} icon={ICONS.package} label="Name" />
        <Input error={errors.price?.message} {...register("price")} type="number" icon={ICONS.payment_method} label="Price" />
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        {watchedData.type === "TRAINER" ? null : (
          <Input
            error={errors.validityInDays?.message}
            icon={ICONS.validity}
            type="number"
            label="Validity In Days"
            min={1}
            {...register("validityInDays", { setValueAs: (v: string) => (!v ? null : parseInt(v)) })}
          />
        )}
        <section className="flex flex-col gap-2">
          {watchedData.type === "VISIT" ? null : (
            <Input
              error={errors.totalPermittedSessions?.message}
              {...register("totalPermittedSessions", { setValueAs: (v: string) => (!v ? null : parseInt(v)) })}
              type="number"
              disabled={isUnlimitedSessions}
              icon={ICONS.session}
              label="Total Permitted Sessions"
            />
          )}
          <section className="flex gap-2 items-center justify-end">
            <button
              type="button"
              className={cn("relative rounded-md size-5 border-1.5 border-dark bg-light", {
                "bg-orange border-orange": isUnlimitedSessions,
              })}
            >
              <div />
              <Iconify
                icon={ICONS.check}
                width={20}
                className={cn("text-cream absolute centered", {
                  "scale-0": !isUnlimitedSessions,
                })}
              />
              <input
                className="cursor-pointer absolute centered opacity-0 size-full"
                type="checkbox"
                checked={isUnlimitedSessions}
                onChange={(e) => {
                  setIsUnlimitedSession(e.target.checked);
                  resetField("totalPermittedSessions");
                }}
              />
            </button>
            <label>Unlimited</label>
          </section>
        </section>
      </section>
      <section className="flex justify-center items-center">
        <Button
          onClick={() => console.log(watch())}
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
