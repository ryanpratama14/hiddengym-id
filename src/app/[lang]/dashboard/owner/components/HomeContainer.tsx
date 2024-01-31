"use client";

import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import Logo from "@/components/Logo";
import { toastError, toastSuccess, toastWarning } from "@/components/Toast";
import { GENDERS } from "@/lib/constants";
import { isFileSizeAllowed } from "@/lib/functions";
import { uploadFiles } from "@/lib/uploadthing";
import type { TRPC_RESPONSE } from "@/trpc/shared";
import type { ChangeEvent, Dictionary, Lang } from "@/types";
import { CloudUploadOutlined } from "@ant-design/icons";
import type { UserDetail, UserUpdateInput } from "@router/user";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Profile from "./Profile";
import ProfileUpdate from "./ProfileUpdate";

type Props = {
  lang: Lang;
  user: UserDetail;
  actionUserUpdate: (data: UserUpdateInput) => Promise<TRPC_RESPONSE>;
  revalidateCache: () => Promise<void>;
  t: Dictionary;
};

export default function HomeContainer({ lang, user, actionUserUpdate, revalidateCache, t }: Props) {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { mutate: uploadImage, isPending: loading } = useMutation({
    mutationFn: async (file: File) => {
      await uploadFiles("uploadUserImage", { files: [file] });
      await revalidateCache();
    },
    onSuccess: () => toastSuccess({ t, description: "Uploaded successfully, your profile picture should be changed in seconds." }),
    onError: (error) => {
      toastError({ t, description: "Can't upload image, try again later." });
      console.error(error);
    },
  });

  const handleFileChange = (e: ChangeEvent) => {
    const file = e.target.files?.[0];
    if (file && isFileSizeAllowed("1MB", file.size)) {
      uploadImage(file);
    } else toastWarning({ t, description: "Please pick a picture that under 1MB." });
  };

  return (
    <section className="grid lg:grid-cols-3 gap-6 2xl:px-longer">
      <section className="flex flex-col md:flex-row lg:flex-col lg:gap-6 md:gap-8 gap-6">
        <section className="relative w-full md:w-[40%] lg:w-full aspect-square">
          {loading ? null : (
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
          <section className="absolute centered flex items-center justify-center w-full aspect-square rounded-full bg-light shadow-lg">
            {user?.image?.url && !loading ? (
              <Img
                src={user.image.url}
                alt="Profile Picture"
                className="absolute centered w-full aspect-square object-cover rounded-full"
              />
            ) : loading ? (
              <section className="flex flex-col gap-4">
                <Logo className="animate-pulse w-[60%] aspect-video" />
                <p>uploading...</p>
              </section>
            ) : (
              <Iconify icon={GENDERS[user.gender].picture} width={220} className="text-dark" />
            )}
          </section>
        </section>

        <section className="flex flex-col gap-4 md:w-[60%] lg:w-full">
          <section className="flex flex-col gap-0.5">
            <h5>User's information</h5>
            <div className="w-full h-0.5 bg-dark" />
          </section>
          <section className="flex flex-col gap-4">
            {isEdit ? (
              <ProfileUpdate t={t} user={user} setIsEdit={setIsEdit} actionUserUpdate={actionUserUpdate} />
            ) : (
              <Profile user={user} setIsEdit={setIsEdit} lang={lang} />
            )}
          </section>
        </section>
      </section>
      <section className="lg:col-span-2 bg-light h-fit shadow p-3">das</section>
    </section>
  );
}
