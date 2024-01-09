"use client";

import Iconify from "@/components/Iconify";
import { ICONS } from "@/lib/constants";
import { COLORS } from "@/styles/theme";
import { Menu, Transition } from "@headlessui/react";
import { Menu as AntdMenu, ConfigProvider } from "antd";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";
import { Fragment } from "react";

type Props = {
  handleCollapse: React.MouseEventHandler<HTMLElement>;
  addButtonItems: ItemType<MenuItemType>[];
};

export default function AddButton({ handleCollapse, addButtonItems }: Props) {
  return (
    <ConfigProvider theme={{ components: { Menu: { itemHeight: 30, itemHoverBg: COLORS.orange, itemBorderRadius: 6 } } }}>
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
            <Menu.Items className="active:outline-none focus:outline-none outline-none absolute bottom-14 right-0 origin-top-right mt-4 flex flex-col shadow-lg">
              <Menu.Item>
                <AntdMenu inlineIndent={14} color={COLORS.dark} mode="inline" items={addButtonItems} style={{ borderRadius: 6 }} />
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </aside>
    </ConfigProvider>
  );
}
