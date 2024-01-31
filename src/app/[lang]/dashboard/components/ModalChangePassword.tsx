import Button from "@/components/Button";
import Input from "@/components/Input";
import { Modal } from "@/components/Modal";
import { toastError, toastSuccess } from "@/components/Toast";
import { useZustand } from "@/global/store";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserChangePasswordInput } from "@router/user";
import { schema } from "@schema";
import { type SubmitHandler, useForm } from "react-hook-form";

type Props = { show: boolean; closeModal: () => void };

export default function ModalChangePassword({ show, closeModal }: Props) {
  const { t } = useZustand();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserChangePasswordInput>({
    resolver: zodResolver(schema.user.changePassword),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit: SubmitHandler<UserChangePasswordInput> = async (data) => changePassword(data);

  const { mutate: changePassword, isPending: loading } = api.user.changePassword.useMutation({
    onSuccess: async (res) => {
      t && toastSuccess({ t, description: res.message });
      closeModal();
      reset();
    },
    onError: (res) => t && toastError({ t, description: res.message }),
  });

  return (
    <Modal show={show} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
          <Input
            label="Old Password"
            error={errors.oldPassword?.message}
            {...register("oldPassword")}
            type="password"
            withPasswordIcon
          />
          <Input
            label="New Password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
            type="password"
            withPasswordIcon
          />
          <Input
            label="Confirm New Password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
            type="password"
            withPasswordIcon
          />
          <section className="flex justify-center items-center">
            <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
              Change Password
            </Button>
          </section>
        </form>
      </Modal.Body>
    </Modal>
  );
}
