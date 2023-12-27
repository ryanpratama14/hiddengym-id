"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import { ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { schema } from "@/schema";
import { type PackageCreateInput } from "@/server/api/routers/package";
import { inputVariants } from "@/styles/variants";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

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
};

export default function CreatePackageForm({}: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    resetField,
  } = useForm<PackageCreateInput>({
    resolver: zodResolver(schema.package.create),
    defaultValues: initialData,
  });

  const onSubmit: SubmitHandler<PackageCreateInput> = async (data) => {
    setLoading(true);
    console.log(data);
    setLoading(false);
  };

  const data = {
    type: watch("type"),
    isUnlimitedSessions: watch("isUnlimitedSessions"),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <section className="flex flex-col">
        <label htmlFor="type">Package Type</label>
        <select className={inputVariants()} {...register("type")} id="type">
          <option onClick={() => resetField("totalPermittedSessions")} value="MEMBER">
            MEMBER
          </option>
          <option onClick={() => resetField("totalPermittedSessions")} value="VISIT">
            VISIT
          </option>
          <option value="TRAINER">TRAINER</option>
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
              <data className="flex gap-2 items-center justify-end">
                <button
                  onClick={() => resetField("totalPermittedSessions")}
                  type="button"
                  className={cn("relative rounded-md size-5 border-1.5 border-dark bg-light", {
                    "bg-orange border-orange": data.isUnlimitedSessions,
                  })}
                >
                  <div />
                  <Iconify
                    icon={ICONS.check}
                    width={20}
                    className={cn("text-cream absolute centered", {
                      "scale-0": !data.isUnlimitedSessions,
                    })}
                  />
                  <input
                    className="cursor-pointer absolute centered opacity-0 size-full"
                    type="checkbox"
                    {...register("isUnlimitedSessions")}
                  />
                </button>
                <label>Unlimited</label>
              </data>
            )}
          </section>
        )}
      </section>
      {/* dropdowns */}

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
