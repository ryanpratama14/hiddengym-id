"use client";

import Logo from "@/components/Logo";
import { type Locale } from "@/i18n.config";
import { DASHBOARD_SUB_MENUS, USER_REDIRECT } from "@/lib/constants";
import { cn, getDashboardPathname, getSelectedMenu } from "@/lib/utils";
import { type User } from "@/server/api/routers/user";
import { COLORS } from "@/styles/theme";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import AddButton from "./AddButton";
import DashboardProfileDropdown from "./DashboardProfileDropdown";
import NavigatorX from "./NavigatorX";

type Props = {
  children: React.ReactNode;
  user: User;
  getDashboardItems: (collapsed: boolean, lang: Locale) => ItemType<MenuItemType>[];
  lang: Locale;
};

export default function DashboardLayout({ children, getDashboardItems, user, lang }: Props) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedMenu, setSelectedMenu] = useState(getSelectedMenu({ pathname, role: user.role }));
  const items = getDashboardItems(collapsed, lang);
  const dashboardSubMenu = DASHBOARD_SUB_MENUS.find((value) => pathname.includes(value.toLowerCase()));
  const handleCollapse = () => (collapsed ? undefined : setCollapsed(true));

  useEffect(() => {
    setSelectedMenu(getSelectedMenu({ pathname, role: user.role }));
    setSelectedKeys(getDashboardPathname(pathname, user.role));
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
          <aside className="min-h-screen flex flex-col gap-6 justify-between pb-6">
            <nav className="flex flex-col gap-6">
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="bg-cream gap-2 flex items-center w-full justify-center h-14 text-dark"
              >
                {!collapsed ? <MenuFoldOutlined style={{ fontSize: "28px" }} /> : <MenuUnfoldOutlined style={{ fontSize: "28px" }} />}
              </button>
              <Menu color={COLORS.cream} onClick={handleCollapse} selectedKeys={selectedKeys} mode="inline" items={items} />
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
        <section className="px-shorter ml-[3.1rem] flex items-center justify-between w-full">
          <section className="flex gap-2">
            <NavigatorX
              href={USER_REDIRECT[user.role]({ lang, href: selectedMenu.href })}
              className="font-medium px-2 py-0.5 rounded-md border-2 select-none border-cream shadow-lg"
            >
              {selectedMenu.title}
            </NavigatorX>
            {dashboardSubMenu ? (
              <p className="font-medium px-2 py-0.5 rounded-md border-2 select-none bg-orange border-orange shadow-lg">
                {dashboardSubMenu}
              </p>
            ) : null}
          </section>
          <DashboardProfileDropdown user={user} />
        </section>
      </nav>

      <article onClick={handleCollapse} className="min-h-screen p-shorter bg-cream ml-[3.1rem] mt-14">
        {children}
      </article>

      <AddButton handleCollapse={handleCollapse} role={user.role} lang={lang} />
    </Fragment>
  );
}
