"use client";

import Logo from "@/components/Logo";
import { type Locale } from "@/i18n.config";
import { USER_REDIRECT } from "@/lib/constants";
import { cn, getDashboardPathname } from "@/lib/utils";
import { type User } from "@/server/api/routers/user";
import { COLORS } from "@/styles/theme";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, type MenuProps } from "antd";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import AddButton from "./AddButton";
import DashboardProfileDropdown from "./DashboardProfileDropdown";

type Props = {
  children: React.ReactNode;
  user: User;
  getDashboardItems: (collapsed: boolean, lang: Locale) => MenuItem[];
  lang: Locale;
};

type MenuItem = Required<MenuProps>["items"][number];

export default function DashboardLayout({ children, getDashboardItems, user, lang }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(getDashboardPathname(pathname, user.role));
  const items = getDashboardItems(collapsed, lang);

  return (
    <Fragment>
      <AddButton role={user.role} setSelectedKeys={setSelectedKeys} lang={lang} />
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
                  const newPathname = USER_REDIRECT[user.role]({ lang, href: e.key });
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

      <nav className="sticky top-0 flex items-center justify-end px-shorter h-14 bg-dark text-cream z-10">
        <DashboardProfileDropdown user={user} />
      </nav>

      <article className="bg-cream pl-12" onClick={() => (!collapsed ? setCollapsed(true) : undefined)}>
        <article className="p-shorter min-h-screen">{children}</article>
      </article>
    </Fragment>
  );
}
