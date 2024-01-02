"use client";

import AddButton from "@/components/AddButton";
import DashboardProfileDropdown from "@/components/DashboardProfileDropdown";
import Logo from "@/components/Logo";
import { USER_REDIRECT } from "@/lib/constants";
import { cn, getSelectedMenu } from "@/lib/functions";
import { type User } from "@/server/api/routers/user";
import { COLORS } from "@/styles/theme";
import { type Lang } from "@/types";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  user: User;
  getDashboardItems: (collapsed: boolean, lang: Lang) => ItemType<MenuItemType>[];
  lang: Lang;
};

export default function DashboardLayout({ children, getDashboardItems, user, lang }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(getSelectedMenu({ pathname, role: user.role, lang }));
  const handleCollapse = () => (collapsed ? undefined : setCollapsed(true));

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
          <aside className="min-h-screen flex flex-col gap-6 justify-between pb-6">
            <nav className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="gap-2 flex items-center w-full justify-center h-14 text-cream"
              >
                {!collapsed ? <MenuFoldOutlined style={{ fontSize: "30px" }} /> : <MenuUnfoldOutlined style={{ fontSize: "30px" }} />}
              </button>
              <Menu
                color={COLORS.cream}
                onClick={(e) => {
                  router.push(USER_REDIRECT[user.role]({ lang, href: e.key }));
                  handleCollapse();
                }}
                selectedKeys={selectedMenu.keys}
                mode="inline"
                items={getDashboardItems(collapsed, lang).map((item) => ({ ...item, title: "" })) as ItemType<MenuItemType>[]}
              />
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
            <Link href={selectedMenu.href} className="font-medium px-3 py-0.5 rounded-md border-2 select-none border-cream shadow-lg">
              {selectedMenu.name}
            </Link>
            {selectedMenu.subName ? (
              <p className="font-medium px-3 py-0.5 rounded-md border-2 select-none bg-light border-light shadow-lg text-dark">
                {selectedMenu.subName}
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
