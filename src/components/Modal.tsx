import { ICONS } from "@/lib/constants";
import { cn } from "@/lib/functions";
import { Dialog, Transition } from "@headlessui/react";
import { Skeleton } from "antd";
import { type ElementRef, Fragment, useRef } from "react";
import Iconify from "./Iconify";

type Props = {
  closeModal: () => void;
  show: boolean;
  children: React.ReactNode;
  classNameDiv?: string;
  loading?: boolean;
};

export const Modal = ({ show, closeModal, children, classNameDiv, loading }: Props) => {
  const closeButtonRef = useRef<ElementRef<"button">>(null);

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
          <div className="fixed inset-0 bg-black/50" />
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
              <Dialog.Panel className={cn("max-md:w-full px-shorter", classNameDiv)}>
                <section className="w-full p-6 rounded-md bg-cream relative">
                  <button
                    onClick={closeModal}
                    ref={closeButtonRef}
                    type="button"
                    className=" hover:bg-dark/10 rounded-md absolute top-2 right-2 flex items-center justify-center"
                  >
                    <span className="sr-only">Close</span>
                    <Iconify icon={ICONS.close} className="text-dark" width={22} />
                  </button>
                  {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : children}
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
  return children;
};
