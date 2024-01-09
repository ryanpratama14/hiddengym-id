"use client";

import { cn } from "@/lib/functions";
import { type User } from "@/server/api/routers/user";
import { type Lang } from "@/types";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";
import { Fragment, useState } from "react";
import AddButton from "./AddButton";
import DashboardLayout from "./DashboardLayout";

type Props = {
  children: React.ReactNode;
  user: User;
  items: ItemType<MenuItemType>[];
  lang: Lang;
};

export default function DashboardContainer({ children, items, user, lang }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const handleCollapse = () => (collapsed ? undefined : setCollapsed(true));

  return (
    <Fragment>
      <DashboardLayout items={items} user={user} handleCollapse={handleCollapse} collapsed={collapsed} setCollapsed={setCollapsed} />

      <article
        onClick={handleCollapse}
        className={cn("animate min-h-screen p-shorter bg-cream ml-[3.1rem] mt-14", { "xl:ml-64": !collapsed })}
      >
        {children}
      </article>

      <AddButton handleCollapse={handleCollapse} role={user.role} lang={lang} />
    </Fragment>
  );
}
