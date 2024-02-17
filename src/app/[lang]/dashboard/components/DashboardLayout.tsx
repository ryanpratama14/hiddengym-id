import Logo from "@/components/Logo";
import { useZustand } from "@/global/store";
import { cn, formatDateShort, getNewDate, getSelectedMenu } from "@/lib/functions";
import { COLORS } from "@/styles/theme";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { UserDetail } from "@router/user";
import { ConfigProvider, Drawer, Layout, Menu } from "antd";
import type { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import DashboardProfileDropdown from "./DashboardProfileDropdown";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  handleCollapse: () => void;
  user: UserDetail;
  items: ItemType<MenuItemType>[];
};

export default function DashboardLayout({ collapsed, setCollapsed, user, handleCollapse, items, open, setOpen }: Props) {
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
          className="max-lg:hidden"
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
                <span className="sr-only">Collapse</span>
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

      <ConfigProvider theme={{ components: { Drawer: { padding: 0, paddingLG: 0 } } }}>
        <Drawer
          width={225}
          closeIcon={
            <section className="gap-2 flex items-center w-[225px] justify-center h-14 text-cream">
              <MenuFoldOutlined style={{ fontSize: "30px" }} />
            </section>
          }
          closable={true}
          placement="left"
          onClose={() => setOpen(false)}
          open={open}
        >
          <aside className="h-full flex flex-col gap-6 justify-between pb-6">
            <Menu color={COLORS.cream} selectedKeys={selectedMenu.keys} mode="inline" items={items} />
            <section className="w-full flex flex-col gap-4 text-cream items-center justify-center">
              <Logo className="w-[70%] aspect-video" />
              <p className={cn("font-semibold")}>HIDDEN GYM</p>
            </section>
          </aside>
        </Drawer>
      </ConfigProvider>

      <nav onClick={handleCollapse} className="fixed flex items-center w-full top-0 h-14 bg-dark text-cream z-10">
        <section
          className={cn("px-shorter flex items-center justify-between w-full animate lg:ml-[3.1rem]", { "xl:ml-64": !collapsed })}
        >
          <section className="flex gap-4 items-center">
            <button type="button" onClick={() => setOpen(true)} className="lg:hidden h-14 text-cream flex items-center">
              <MenuUnfoldOutlined style={{ fontSize: "30px" }} />
              <span className="sr-only">Collapse</span>
            </button>
            <section className="flex gap-2 items-center w-full">
              {selectedMenu.menus.map((e) => (
                <Link
                  key={e.href}
                  href={e.href}
                  className="font-medium px-3 py-0.5 rounded-md border-2 select-none border-cream shadow-lg w-full"
                >
                  {e.label}
                </Link>
              ))}
              {selectedMenu.subName ? (
                <p className="font-medium px-3 py-0.5 rounded-md border-2 select-none bg-light border-light shadow-lg text-dark">
                  {selectedMenu.subName}
                </p>
              ) : null}
            </section>
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
