"use client";

import { Modal } from "@/components/Modal";
import { schema } from "@/schema";
import { type PackageCreateInput, type PackageDetail } from "@/server/api/routers/package";
import { type PlaceList } from "@/server/api/routers/place";
import { type SportList } from "@/server/api/routers/sport";
import { type UserListData } from "@/server/api/routers/user";
import { type Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  option: { places: PlaceList; sports: SportList; trainers: UserListData };
  t: Dictionary;
  data: PackageDetail | null;
  show: boolean;
  closeModal: () => void;
};

export default function ModalUpdate({ t, data, show, closeModal, option }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm<PackageCreateInput>({
    resolver: zodResolver(schema.package.create),
  });

  console.log(watch());

  useEffect(() => {
    if (show && data) {
      reset({
        type: data.type,
        name: data.name,
        description: data.description,
        price: data.price,
        validityInDays: data.validityInDays,
        placeIDs: data.placeIDs,
        sportIDs: data.sportIDs,
        trainerIDs: data.trainerIDs,
        approvedSessions: data.approvedSessions,
      });
    }
  }, [show, data]);

  return (
    <Modal show={show} closeModal={closeModal}>
      <Modal.Body>dasda</Modal.Body>
    </Modal>
  );
}
