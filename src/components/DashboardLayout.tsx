"use client";

import Logo from "@/components/Logo";
import { cn, getDashboardPathname } from "@/lib/utils";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, type MenuProps } from "antd";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import DashboardProfileDropdown from "./DashboardProfileDropdown";
import AddButton from "./AddButton";
import { COLORS } from "@/styles/theme";
import { type User } from "@/server/api/routers/user";
import { USER_PATHNAMES } from "@/lib/constants";

type Props = {
  children: React.ReactNode;
  user: User;
  getDashboardItems: (collapsed: boolean) => MenuItem[];
};

type MenuItem = Required<MenuProps>["items"][number];

export default function DashboardLayout({ children, getDashboardItems, user }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(getDashboardPathname(pathname, user.role));
  const items = getDashboardItems(collapsed);

  return (
    <Fragment>
      <AddButton role={user.role} setSelectedKeys={setSelectedKeys} />
      <Layout>
        <Layout.Sider
          style={{ overflow: "auto", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 20 }}
          collapsedWidth={50}
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
        >
          <section className="min-h-screen flex flex-col gap-6 justify-between pb-6">
            <section className="flex flex-col gap-6">
              <section
                onClick={() => setCollapsed(!collapsed)}
                className={cn("cursor-pointer bg-cream gap-2 flex items-center w-full justify-center h-14 text-dark", {
                  "rounded-r-full": collapsed,
                })}
              >
                {!collapsed ? (
                  <MenuFoldOutlined
                    style={{ fontSize: "30px" }}
                    className={cn({
                      "-translate-x-0.5": collapsed,
                    })}
                  />
                ) : (
                  <MenuUnfoldOutlined
                    style={{ fontSize: "30px" }}
                    className={cn({
                      "-translate-x-0.5": collapsed,
                    })}
                  />
                )}
              </section>
              <Menu
                color={COLORS.cream}
                onClick={(e) => {
                  const newPathname = `${USER_PATHNAMES[user.role]}${e.key}`;
                  setSelectedKeys(getDashboardPathname(newPathname, user.role));
                  if (!collapsed) setCollapsed(true);
                }}
                selectedKeys={selectedKeys}
                mode="inline"
                items={items}
              />
            </section>
            {collapsed ? null : (
              <section className="w-full flex flex-col gap-4 text-cream items-center justify-center">
                <Logo className="w-[70%] aspect-video" />
                <p className={cn("font-semibold")}>HIDDEN GYM</p>
              </section>
            )}
          </section>
        </Layout.Sider>
      </Layout>
      <article onClick={() => (!collapsed ? setCollapsed(true) : undefined)}>
        <article className="flex flex-col min-h-screen">
          <header className="sticky w-full top-0 flex items-center justify-end px-shorter h-14 bg-dark text-cream z-10">
            <DashboardProfileDropdown user={user} />
          </header>
          <section className="bg-cream pl-12 min-h-screen">
            <article className="p-shorter">{children}</article>
          </section>
          <footer className="bg-dark text-right font-semibold px-shorter py-4 text-cream">HIDDEN GYM ©2024</footer>
        </article>
      </article>
    </Fragment>
  );
}
