"use client";

import Iconify from "@/components/Iconify";
import { type Locale } from "@/i18n.config";
import { ADD_BUTTON_ITEMS, ADD_BUTTON_ITEMS_TO_REMOVE, ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import { type Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

type Props = {
  role: Role;
  lang: Locale;
  handleCollapse: React.MouseEventHandler<HTMLElement>;
};

export default function AddButton({ role, lang, handleCollapse }: Props) {
  const router = useRouter();
  return (
    <aside onClick={handleCollapse} className="fixed right-0 bottom-0 pr-shorter pb-shorter z-50">
      <Menu as="section" className="relative">
        <Menu.Button className="w-10 aspect-square bg-green text-cream rounded-full relative shadow">
          <Iconify icon={ICONS.add} className="absolute centered" width={35} />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition duration-300"
          enterFrom="transform translate-y-2 opacity-0"
          enterTo="transform opacity-100 scale-100"
          leave="transition duration-300"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform translate-y-2 opacity-0"
        >
          <Menu.Items className="active:outline-none w-44 focus:outline-none outline-none absolute bottom-14 right-0 origin-top-right p-0.5 mt-4 rounded-md  flex flex-col bg-light shadow-lg">
            {ADD_BUTTON_ITEMS(role, lang)
              .filter((obj) => !ADD_BUTTON_ITEMS_TO_REMOVE[role].includes(obj.label))
              .map((item) => {
                return (
                  <Menu.Item key={item.icon}>
                    <button
                      type="button"
                      onClick={() => router.push(item.href)}
                      className={cn(
                        "rounded-md font-medium flex gap-2 items-center justify-end px-4 h-8 bg-light hover:bg-orange hover:text-cream text-dark",
                      )}
                    >
                      {item.label}
                      <Iconify icon={item.icon} width={25} />
                    </button>
                  </Menu.Item>
                );
              })}
          </Menu.Items>
        </Transition>
      </Menu>
    </aside>
  );
}
