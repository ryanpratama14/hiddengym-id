import { ICONS } from "@/lib/constants";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import Iconify from "./Iconify";

type Props = {
  closeModal: () => void;
  show: boolean;
  children: React.ReactNode;
};

export const Modal = ({ show, closeModal, children }: Props) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel>
                <section className="w-fit p-6 rounded-md bg-white">
                  <button
                    type="submit"
                    onClick={closeModal}
                    className="size-8 flex items-center justify-center rounded-full absolute -right-3 -top-3 bg-dark"
                  >
                    <Iconify icon={ICONS.close} className="text-light" width={25} />
                  </button>
                  {children}
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.Body = function ModalBody({ children }: { children: React.ReactNode }) {
  return <Fragment>{children}</Fragment>;
};
