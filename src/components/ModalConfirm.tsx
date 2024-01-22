import type { MouseEvent } from "@/types";
import Button from "./Button";
import { Modal } from "./Modal";

type Props = { show: boolean; onConfirm: MouseEvent; closeModal: () => void; action: string; loading?: boolean };

export default function ModalConfirm({ show, closeModal, onConfirm, action, loading }: Props) {
  return (
    <Modal show={show} closeModal={closeModal}>
      <Modal.Body>
        <section className="flex flex-col gap-4 mt-2">
          <p className="text-lg">
            Are you sure want to <b>{action}</b>?
          </p>
          <section className="flex justify-between gap-4">
            <Button className="w-full" size="xl" color="danger" onClick={closeModal}>
              Cancel
            </Button>
            <Button color="active" disabled={loading} loading={loading} className="w-full" size="xl" onClick={onConfirm}>
              Confirm
            </Button>
          </section>
        </section>
      </Modal.Body>
    </Modal>
  );
}
