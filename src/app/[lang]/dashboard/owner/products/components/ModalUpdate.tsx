import Button from "@/components/Button";
import Input from "@/components/Input";
import { Modal } from "@/components/Modal";
import { toastError, toastSuccess } from "@/components/Toast";
import { ICONS } from "@/lib/constants";
import type { ProductDetail, ProductUpdateInput } from "@/server/api/routers/product";
import { api } from "@/trpc/react";
import type { Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@schema";
import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

type Props = {
  show: boolean;
  closeModal: () => void;
  data?: ProductDetail | null;
  t: Dictionary;
};

export default function ModalUpdate({ show, closeModal, t, data }: Props) {
  const utils = api.useUtils();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductUpdateInput>({
    resolver: zodResolver(schema.product.update),
  });

  const onSubmit: SubmitHandler<ProductUpdateInput> = async (data) => updateData(data);

  const { mutate: updateData, isPending: loading } = api.product.update.useMutation({
    onSuccess: async (res) => {
      toastSuccess({ t, description: res.message });
      closeModal();
      await utils.product.list.invalidate();
    },
    onError: (res) => toastError({ t, description: res.message }),
  });

  useEffect(() => {
    if (show && data) reset({ id: data.id, body: { name: data.name, price: data.price } });
  }, [show, data]);

  return (
    <Modal show={show} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
          <section className="grid md:grid-cols-2 gap-4">
            <Input icon={ICONS.name} error={errors.body?.name?.message} label="Product Name" {...register("body.name")} />
            <Input
              type="number"
              icon={ICONS.payment_method}
              error={errors.body?.price?.message}
              label="Unit Price"
              {...register("body.price", { setValueAs: (v: string) => (!v ? 0 : parseInt(v)) })}
            />
          </section>
          <section className="flex justify-center items-center">
            <Button className="md:w-fit w-full" loading={loading} type="submit" color="success" size="xl">
              Update Product
            </Button>
          </section>
        </form>
      </Modal.Body>
    </Modal>
  );
}
