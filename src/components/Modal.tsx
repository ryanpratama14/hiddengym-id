import { ICONS } from "@/lib/constants";
import { cn } from "@/lib/functions";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import Iconify from "./Iconify";

type Props = {
  closeModal: () => void;
  show: boolean;
  children: React.ReactNode;
  classNameDiv?: string;
};

export const Modal = ({ show, closeModal, children, classNameDiv }: Props) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="article" className="relative z-[100]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center w-full">
            <Transition.Child
              as={Fragment}
              enter="transition duration-300"
              enterFrom="transform translate-y-2 opacity-0"
              enterTo="transform opacity-100 scale-100"
              leave="transition duration-300"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform translate-y-2 opacity-0"
            >
              <Dialog.Panel className="max-md:w-full px-shorter">
                <section className={cn("w-full p-6 rounded-md bg-cream relative", classNameDiv)}>
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
