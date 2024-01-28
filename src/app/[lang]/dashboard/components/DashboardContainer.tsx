"use client";

import { cn } from "@/lib/functions";
import type { User } from "@/server/api/routers/user";
import type { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { Fragment, useState } from "react";
import AddButton from "./AddButton";
import DashboardLayout from "./DashboardLayout";

type Props = {
  children: React.ReactNode;
  user: User;
  items: ItemType<MenuItemType>[];
  addButtonItems: ItemType<MenuItemType>[];
};

export default function DashboardContainer({ children, items, user, addButtonItems }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const [open, setOpen] = useState(false);
  const handleCollapse = () => (collapsed ? undefined : setCollapsed(true));

  return (
    <Fragment>
      <DashboardLayout
        open={open}
        setOpen={setOpen}
        items={items}
        user={user}
        handleCollapse={handleCollapse}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <article
        onClick={handleCollapse}
        className={cn("animate h-dvh p-shorter bg-cream mt-14 md:ml-[3.1rem]", { "xl:ml-64": !collapsed })}
      >
        {children}
      </article>

      <AddButton addButtonItems={addButtonItems} handleCollapse={handleCollapse} />
    </Fragment>
  );
}
