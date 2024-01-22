import Button from "./Button";
import { Modal } from "./Modal";

type Props = { show: boolean; onConfirm: () => Promise<void>; closeModal: () => void; action: string; loading: boolean };

export default function ModalConfirm({ show, closeModal, onConfirm, action, loading }: Props) {
  return (
    <Modal show={show} closeModal={closeModal}>
      <Modal.Body>
        <section className="flex flex-col gap-4">
          <p>
            Are you sure want to <b>{action}</b>?
          </p>
          <section className="flex justify-between gap-4">
            <Button className="w-full" size="xl" color="danger" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              color="active"
              disabled={loading}
              loading={loading}
              className="w-full"
              size="xl"
              onClick={async () => {
                await onConfirm();
                closeModal();
              }}
            >
              Confirm
            </Button>
          </section>
        </section>
      </Modal.Body>
    </Modal>
  );
}
