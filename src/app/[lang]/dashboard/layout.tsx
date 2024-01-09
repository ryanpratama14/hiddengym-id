import Iconify from "@/components/Iconify";
import { FILTERED_ADD_BUTTONS_ITEMS, FILTERED_DASHBOARD_MENU_ITEMS, MENU_ICON_SIZE } from "@/lib/constants";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type Lang } from "@/types";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";
import { redirect } from "next/navigation";
import DashboardContainer from "./components/DashboardContainer";
import DashboardNavigator from "./components/DashboardNavigator";

// type MenuItem = {
//   title: string;
//   key: DashboardMenuKey;
//   label: React.JSX.Element;
//   icon?: React.JSX.Element;
//   children?: MenuItem[];
// };

type Props = { children: React.ReactNode; params: { lang: Lang } };

export default async function DashboardLayout({ children, params }: Props) {
  const { lang } = params;
  const session = await getServerAuthSession();
  if (!session || !session.user) redirect(`/${params.lang}/signin`);
  const user = await api.user.detailMe.query();
  const role = session.user.role;

  const items: ItemType<MenuItemType>[] = FILTERED_DASHBOARD_MENU_ITEMS(role).map((e) => {
    const hasChildren = e.children;
    return {
      key: e.key,
      icon: <Iconify icon={e.icon} width={MENU_ICON_SIZE} />,
      label: hasChildren ? (
        <p className="text-sm select-none font-medium">{e.label}</p>
      ) : (
        <DashboardNavigator className="" href={e.key} lang={lang} role={role}>
          {e.label}
        </DashboardNavigator>
      ),

      children: hasChildren
        ? e.children.map((sub) => ({
            label: (
              <DashboardNavigator isChildren href={sub.key} lang={lang} role={role}>
                {sub.label}
              </DashboardNavigator>
            ),
            key: sub.key,
          }))
        : undefined,
    };
  });

  const addButtonItems: ItemType<MenuItemType>[] = FILTERED_ADD_BUTTONS_ITEMS(role).map((e) => {
    const hasChildren = e.children;
    return {
      key: e.key,
      icon: <Iconify icon={e.icon} width={20} />,
      label: hasChildren ? (
        <p className="text-sm select-none font-medium">{e.label}</p>
      ) : (
        <DashboardNavigator smallText className="" href={e.key} lang={lang} role={role}>
          {e.label}
        </DashboardNavigator>
      ),

      children: hasChildren
        ? e.children.map((sub) => ({
            label: (
              <DashboardNavigator smallText href={sub.key} lang={lang} role={role}>
                {sub.label}
              </DashboardNavigator>
            ),
            key: sub.key,
            icon: <Iconify icon={sub.icon} width={20} />,
          }))
        : undefined,
    };
  });

  return (
    <DashboardContainer addButtonItems={addButtonItems} items={items} user={user}>
      {children}
    </DashboardContainer>
  );
}
