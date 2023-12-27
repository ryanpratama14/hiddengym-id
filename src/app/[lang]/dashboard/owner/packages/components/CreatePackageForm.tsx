"use client";

import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { type PackageCreateInput } from "@/server/api/routers/package";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { type ChangeEvent, type FormEvent } from "@/types";
import { PackageType } from "@prisma/client";
import { useState } from "react";

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
  const [data, setData] = useState<PackageCreateInput>(initialData);
  const [isUnlimitedSessions, setIsUnlimitedSession] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(data);
  };

  const handleChange = (name: keyof PackageCreateInput) => (e: ChangeEvent) => {
    setData({ ...data, [name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section className="flex flex-col">
        <label htmlFor="type">Package Type</label>
        <select
          id="type"
          value={data.type}
          onChange={(e) => {
            const type = e.target.value as PackageType;
            setData((prev) => ({
              ...prev,
              type,
              validityInDays: type === "TRAINER" ? null : prev.validityInDays,
            }));
          }}
        >
          <option value="MEMBER">MEMBER</option>
          <option value="VISIT">VISIT</option>
          <option value="TRAINER">TRAINER</option>
        </select>
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        <Input value={data.name} icon={ICONS.package} label="Name" onChange={handleChange("name")} />
        <Input value={data.price} type="number" icon={ICONS.payment_method} label="Price" onChange={handleChange("price")} />
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        {data.type === "TRAINER" ? null : (
          <Input
            icon={ICONS.validity}
            type="number"
            value={data.validityInDays ?? 0}
            label="Validity In Days"
            onChange={handleChange("validityInDays")}
          />
        )}
        <section className="flex flex-col gap-2">
          <Input
            type={isUnlimitedSessions ? "text" : "number"}
            value={isUnlimitedSessions ? "∞" : data.totalPermittedSessions ?? 0}
            disabled={isUnlimitedSessions}
            icon={ICONS.session}
            label="Total Permitted Sessions"
            onChange={handleChange("totalPermittedSessions")}
          />
          <section className="flex gap-2 items-center justify-end">
            <button
              type="button"
              className={cn("relative rounded-md size-5 border-1.5 border-dark bg-light", {
                "bg-orange border-orange": isUnlimitedSessions,
              })}
              onClick={() => {
                setIsUnlimitedSession(!isUnlimitedSessions);
                setData({ ...data, totalPermittedSessions: null });
              }}
            >
              <div />
              <Iconify
                icon={ICONS.check}
                width={20}
                className={cn("text-cream absolute centered", {
                  "scale-0": !isUnlimitedSessions,
                })}
              />
              <input className="cursor-pointer absolute centered opacity-0 size-full" type="checkbox" checked={isUnlimitedSessions} />
            </button>
            <label>Unlimited</label>
          </section>
        </section>
      </section>
    </form>
  );
}
