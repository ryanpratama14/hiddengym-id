import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { Modal } from "@/components/Modal";
import { toastError, toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { GENDER_OPTIONS } from "@/lib/constants";
import { cn, getInputDate } from "@/lib/functions";
import type { UserUpdateInput } from "@/server/api/routers/user";
import { schema } from "@/server/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

type Props = { closeModal: () => void; show: boolean };

export default function ModalUpdate({ closeModal, show }: Props) {
  const searchParams = useSearchParams();

  const { data, isFetching: loading } = api.user.detail.useQuery(
    { id: searchParams.get("id") ?? "" },
    { enabled: !!searchParams.get("id") },
  );

  const { t } = useZustand();
  const utils = api.useUtils();
  const [isUpdatePassword, setIsUpdatePassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    unregister,
    formState: { errors },
    reset,
  } = useForm<UserUpdateInput>({
    mode: "onBlur",
    resolver: zodResolver(schema.user.update),
  });

  const onSubmit: SubmitHandler<UserUpdateInput> = async (data) => updateData(data);

  const { mutate: updateData, isPending: pending } = api.user.update.useMutation({
    onSuccess: async (res) => {
      t && toastSuccess({ t, description: res.message });
      closeModal();
      await utils.user.list.invalidate();
      setIsUpdatePassword(false);
    },
    onError: (res) => t && toastError({ t, description: res.message }),
  });

  useEffect(() => {
    if (show && data) {
      reset({
        id: data.id,
        body: {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          birthDate: data.birthDate ? getInputDate({ date: data.birthDate }) : undefined,
          gender: data.gender,
          email: data?.email,
        },
      });
    }
  }, [show, data]);

  return (
    <Modal loading={loading} show={show} closeModal={closeModal} classNameDiv="xl:w-[60%]">
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
          <section className="grid md:grid-cols-2 gap-4">
            <Input label="Full Name" {...register("body.fullName")} error={errors.body?.fullName?.message} />
            <Input label="Phone Number" {...register("body.phoneNumber")} error={errors.body?.phoneNumber?.message} isPhoneNumber />
          </section>

          <section className="grid md:grid-cols-2 gap-4">
            <Input label="Email" {...register("body.email")} error={errors.body?.email?.message} />
            <Input label="Date of Birth" {...register("body.birthDate")} error={errors.body?.birthDate?.message} type="date" />
          </section>

          <section className="grid md:grid-cols-2 gap-4">
            <section className="flex flex-col">
              <p className="font-medium text-left">Gender</p>
              <section className="grid grid-cols-2 h-10">
                {GENDER_OPTIONS.map((option) => {
                  return (
                    <section key={option.label} className="items-center flex gap-2">
                      <button
                        type="button"
                        className="relative rounded-full size-6 bg-white border-1 border-dark has-[:checked]:bg-dark"
                      >
                        <input
                          value={option.value}
                          className="cursor-pointer absolute w-full h-full opacity-0 z-10 top-0 left-0"
                          id={`gender_option_${option.label}`}
                          type="radio"
                          {...register("body.gender")}
                        />
                        <div className="animate absolute centered w-[40%] aspect-square rounded-full bg-white has-[:checked]:scale-0" />
                      </button>
                      <label className="flex items-center" htmlFor={`gender_option_${option.label}`}>
                        <Iconify color={option.color} width={25} icon={option.icon} />
                        {option.label}
                      </label>
                    </section>
                  );
                })}
              </section>
            </section>

            <section className="flex justify-end items-end">
              <Button
                className={cn({ "text-dark bg-dark/10": isUpdatePassword })}
                color={isUpdatePassword ? "none" : "danger"}
                onClick={() => {
                  setIsUpdatePassword(!isUpdatePassword);
                  if (isUpdatePassword) unregister("body.updatePassword");
                }}
              >
                {isUpdatePassword ? "Cancel update" : "Update"} password
              </Button>
            </section>
          </section>

          {isUpdatePassword ? (
            <section className="grid md:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                {...register("body.updatePassword.credential")}
                error={errors.body?.updatePassword?.credential?.message}
              />
              <Input
                label="Confirm Password"
                type="password"
                {...register("body.updatePassword.confirmCredential")}
                error={errors.body?.updatePassword?.confirmCredential?.message}
              />
            </section>
          ) : null}

          <section className="flex justify-center items-center">
            <Button className="md:w-fit w-full" loading={pending} type="submit" color="success" size="xl">
              Update Trainer
            </Button>
          </section>
        </form>
      </Modal.Body>
    </Modal>
  );
}
