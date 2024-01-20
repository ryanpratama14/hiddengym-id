import Logo from "@/components/Logo";
import { useZustand } from "@/global/store";
import { cn, formatDateShort, getNewDate, getSelectedMenu } from "@/lib/functions";
import { type User } from "@/server/api/routers/user";
import { COLORS } from "@/styles/theme";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import DashboardProfileDropdown from "./DashboardProfileDropdown";

type Props = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  handleCollapse: () => void;
  user: User;
  items: ItemType<MenuItemType>[];
};

export default function DashboardLayout({ collapsed, setCollapsed, user, handleCollapse, items }: Props) {
  const { lang } = useZustand();
  const pathname = usePathname();
  const [selectedMenu, setSelectedMenu] = useState(getSelectedMenu({ pathname, role: user.role, lang }));
  useEffect(() => {
    setSelectedMenu(getSelectedMenu({ pathname, role: user.role, lang }));
  }, [pathname]);

  return (
    <Fragment>
      <Layout>
        <Layout.Sider
          style={{ overflow: "auto", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 20 }}
          collapsedWidth={50}
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
        >
          <aside className="h-dvh flex flex-col gap-6 justify-between pb-6">
            <nav className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="gap-2 flex items-center w-full justify-center h-14 text-cream"
              >
                {!collapsed ? <MenuFoldOutlined style={{ fontSize: "30px" }} /> : <MenuUnfoldOutlined style={{ fontSize: "30px" }} />}
              </button>
              <Menu color={COLORS.cream} onClick={handleCollapse} selectedKeys={selectedMenu.keys} mode="inline" items={items} />
            </nav>
            {collapsed ? null : (
              <section className="w-full flex flex-col gap-4 text-cream items-center justify-center">
                <Logo className="w-[70%] aspect-video" />
                <p className={cn("font-semibold")}>HIDDEN GYM</p>
              </section>
            )}
          </aside>
        </Layout.Sider>
      </Layout>

      <nav onClick={handleCollapse} className="fixed flex items-center w-full top-0 h-14 bg-dark text-cream z-10">
        <section className={cn("px-shorter ml-[3.1rem] flex items-center justify-between w-full animate", { "xl:ml-64": !collapsed })}>
          <section className="flex gap-2">
            <Link href={selectedMenu.href} className="font-medium px-3 py-0.5 rounded-md border-2 select-none border-cream shadow-lg">
              {selectedMenu.label}
            </Link>
            {selectedMenu.subName ? (
              <p className="font-medium px-3 py-0.5 rounded-md border-2 select-none bg-light border-light shadow-lg text-dark">
                {selectedMenu.subName}
              </p>
            ) : null}
          </section>
          <section className="flex gap-4 items-center">
            <p className="md:block hidden select-none rounded-md border-2 border-cream py-0.5 px-3 font-medium">
              {formatDateShort({ date: getNewDate(), tz: user.tz })}
            </p>
            <DashboardProfileDropdown user={user} />
          </section>
        </section>
      </nav>
    </Fragment>
  );
}
