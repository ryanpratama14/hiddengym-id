"use client";

import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import Logo from "@/components/Logo";
import { toast } from "@/components/Toast";
import { type Locale } from "@/i18n.config";
import { GENDERS, ICONS } from "@/lib/constants";
import { type Dictionary } from "@/lib/dictionary";
import { uploadFiles } from "@/lib/uploadthing";
import { formatDateLong, formatName, isFileSizeAllowed, lozalizePhoneNumber } from "@/lib/utils";
import { type User, type UserUpdateInput } from "@/server/api/routers/user";
import { type TRPC_RESPONSE } from "@/trpc/shared";
import { type ChangeEvent } from "@/types";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Fragment, useState } from "react";
import ProfileForm from "./ProfileForm";

type Props = {
  lang: Locale;
  user: User;
  updateUser: (data: UserUpdateInput) => Promise<TRPC_RESPONSE>;
  refreshUser: () => Promise<void>;
  t: Dictionary;
};

export default function HomeContainer({ lang, user, updateUser, refreshUser, t }: Props) {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { mutate: uploadImage, isLoading } = useMutation({
    mutationFn: async (file: File) => {
      await uploadFiles("uploadUserImage", { files: [file] });
      await refreshUser();
    },
    onSuccess: () =>
      toast({ t, type: "success", description: "Uploaded successfully, your profile picture should be changed in seconds..." }),
    onError: (error) => {
      toast({ t, type: "error", description: "Can't upload image, try again later" });
      console.error(error);
    },
  });

  const handleFileChange = (e: ChangeEvent) => {
    const file = e.target.files?.[0];
    if (file && isFileSizeAllowed("1MB", file.size)) {
      uploadImage(file);
    } else toast({ t, type: "error", description: "Please pick a picture that under 1MB" });
  };

  return (
    <section className="grid md:grid-cols-3 gap-y-6 md:gap-16 2xl:px-longer">
      <section className="flex flex-col p-6 gap-6">
        <section className="flex flex-col gap-6 pb-2">
          <section className="relative bg-light rounded-full w-full aspect-square shadow">
            {isLoading ? null : (
              <section className="shadow-lg flex items-center justify-center px-1 py-0.5 bg-green text-light absolute bottom-0 right-0 rounded-md z-10 overflow-hidden">
                <input
                  accept="image/*"
                  type="file"
                  className="cursor-pointer absolute w-full h-full opacity-0 top-0 z-10"
                  onChange={handleFileChange}
                />
                <CloudUploadOutlined className="text-3xl text-light" />
              </section>
            )}
            {user?.image?.url && !isLoading ? (
              <Img
                src={user.image.url}
                alt="Profile Picture"
                className="absolute centered w-full aspect-square object-cover rounded-full"
              />
            ) : isLoading ? (
              <section className="flex flex-col gap-4 absolute centered items-center justify-center w-full">
                <Logo className="animate-pulse w-[60%] aspect-video" />
                <p>uploading...</p>
              </section>
            ) : (
              <Iconify
                icon={user?.gender === "MALE" ? ICONS.male : ICONS.female}
                className="absolute text-dark centered"
                width={220}
              />
            )}
          </section>
        </section>
        <section className="flex flex-col gap-0.5">
          <h5>User's information</h5>
          <div className="w-full h-0.5 bg-dark" />
        </section>
        <section className="flex flex-col gap-6">
          <section className="flex flex-col gap-6">
            {isEdit ? (
              <ProfileForm t={t} user={user} setIsEdit={setIsEdit} updateUser={updateUser} />
            ) : (
              <Fragment>
                <section className="flex flex-col gap-2">
                  <section className="flex justify-between items-center gap-2">
                    <h6>{user?.fullName}</h6>
                    <Button onClick={() => setIsEdit(true)} color="expired" size="l">
                      Edit
                    </Button>
                  </section>
                  <p>
                    <span className="bg-orange font-semibold py-0.5 px-2 text-cream rounded-md w-fit shadow">
                      {formatName(user.role)}
                    </span>{" "}
                    of Hidden Gym
                  </p>
                </section>
                {/* information after name and role */}
                <section className="flex flex-col gap-3">
                  <section className="flex flex-col">
                    <p className="label">Email</p>
                    {user?.email ? (
                      <Link target="_blank" href={`mailto:${user?.email}`} className="hover:underline">
                        {user?.email}
                      </Link>
                    ) : (
                      <p>-</p>
                    )}
                  </section>
                  <section className="flex flex-col">
                    <p className="label">Phone Number</p>
                    <Link target="_blank" href={`tel:${user.phoneNumber}`} className="hover:underline">
                      {lozalizePhoneNumber(user?.phoneNumber)}
                    </Link>
                  </section>
                  <section className="flex flex-col">
                    <p className="label">Gender</p>
                    <section className="flex gap-1 items-center">
                      <Iconify
                        width={25}
                        icon={GENDERS.find((item) => item.value === user.gender)!.icon}
                        color={GENDERS.find((item) => item.value === user.gender)!.color}
                      />
                      <p>{formatName(user?.gender)}</p>
                    </section>
                  </section>
                  <section className="flex flex-col">
                    <p className="label">Date of Birth</p>
                    <p>{user?.birthDate ? formatDateLong(user?.birthDate, lang) : "-"}</p>
                  </section>
                </section>
              </Fragment>
            )}
          </section>
        </section>
      </section>
      <section className="md:col-span-2 bg-light h-fit p-6 shadow"></section>
    </section>
  );
}
