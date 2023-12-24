"use client";

import Iconify from "@/components/Iconify";
import { ICONS, USER_PATHNAMES } from "@/lib/constants";
import { cn, getDashboardPathname } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import { type Role } from "@prisma/client";
import React, { Fragment } from "react";
import { useRouter } from "next/navigation";

type Props = {
  role: Role;
  setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>;
};

const ITEMS_TO_REMOVE: Record<Role, string[]> = {
  VISITOR: ["Package", "Product", "Schedule", "Transaction", "Consumer"],
  TRAINER: ["Package", "Product", "Transaction"],
  OWNER: [],
  ADMIN: [],
};

const ADD_BUTTON_ITEMS = (role: Role) => [
  {
    label: "Package",
    icon: ICONS.package,
    href: `${USER_PATHNAMES[role]}/package/create`,
  },
  {
    label: "Product",
    icon: ICONS.product,
    href: `${USER_PATHNAMES[role]}/product/create`,
  },
  {
    label: "Visit",
    icon: ICONS.visit,
    href: `${USER_PATHNAMES[role]}/visits/create`,
  },
  {
    label: "Schedule",
    icon: ICONS.schedule,
    href: `${USER_PATHNAMES[role]}/schedules/create`,
  },
  {
    label: "Transaction",
    icon: ICONS.transaction,
    href: `${USER_PATHNAMES[role]}/transactions/create`,
  },
  {
    label: "Visitor",
    icon: ICONS.visitor,
    href: `${USER_PATHNAMES[role]}/visitors/create`,
  },
];

export default function AddButton({ role, setSelectedKeys }: Props) {
  const router = useRouter();
  return (
    <section className="fixed right-0 bottom-0 pr-shorter pb-shorter">
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
          <Menu.Items className="active:outline-none focus:outline-none outline-none absolute bottom-14 right-0 origin-top-right p-0.5 mt-4 w-fit rounded-md  flex flex-col bg-light shadow-lg">
            {ADD_BUTTON_ITEMS(role)
              .filter((obj) => !ITEMS_TO_REMOVE[role].includes(obj.label))
              .map((item) => {
                return (
                  <Menu.Item key={item.icon}>
                    <button
                      className={cn(
                        "rounded-md font-semibold flex gap-2 items-center justify-end px-4 h-8 bg-light hover:bg-orange hover:text-cream text-dark"
                      )}
                      onClick={() => {
                        setSelectedKeys(getDashboardPathname(item.href, role));
                        router.push(item.href);
                      }}
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
    </section>
  );
}
