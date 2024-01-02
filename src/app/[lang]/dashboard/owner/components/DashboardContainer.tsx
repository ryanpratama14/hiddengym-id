"use client";

import DashboardLayout from "@/components/DashboardLayout";
import DashboardNavigator from "@/components/DashboardNavigator";
import Iconify from "@/components/Iconify";
import { ICONS } from "@/lib/constants";
import { type User } from "@/server/api/routers/user";
import { type Lang } from "@/types";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";

type Props = {
  children: React.ReactNode;
  user: User;
  lang: Lang;
};

const getDashboardItems = (collapsed: boolean, lang: Lang): ItemType<MenuItemType>[] => [
  {
    key: "/",
    label: <DashboardNavigator>Home</DashboardNavigator>,
    icon: <Iconify icon={ICONS.home} width={25} collapsed={collapsed} />,
  },
  {
    key: "/visitors",
    label: <DashboardNavigator>Visitors</DashboardNavigator>,
    icon: <Iconify icon={ICONS.visitor} width={25} collapsed={collapsed} />,
  },
  {
    key: "/trainers",
    label: <DashboardNavigator>Trainers</DashboardNavigator>,
    icon: <Iconify icon={ICONS.trainer} width={25} collapsed={collapsed} />,
  },
  {
    key: "/packages",
    label: <DashboardNavigator>Packages</DashboardNavigator>,
    icon: <Iconify icon={ICONS.package} width={25} collapsed={collapsed} />,
  },
  {
    key: "/products",
    label: <DashboardNavigator>Products</DashboardNavigator>,
    icon: <Iconify icon={ICONS.product} width={25} collapsed={collapsed} />,
  },
  {
    key: "/transactions",
    label: <DashboardNavigator className="select-none font-medium">Transactions</DashboardNavigator>,
    icon: <Iconify icon={ICONS.transaction} width={25} collapsed={collapsed} />,
    children: [
      {
        key: "/transactions/packages",
        label: <DashboardNavigator isChildren>Packages</DashboardNavigator>,
      },
      {
        key: "/transactions/products",
        label: <DashboardNavigator isChildren>Products</DashboardNavigator>,
      },
    ],
  },
  {
    key: "/visits",
    label: <DashboardNavigator>Visits</DashboardNavigator>,
    icon: <Iconify icon={ICONS.visit} width={25} collapsed={collapsed} />,
  },
  {
    key: "/schedules",
    label: <DashboardNavigator>Schedules</DashboardNavigator>,
    icon: <Iconify icon={ICONS.schedule} width={25} collapsed={collapsed} />,
  },
  {
    key: "/promo-codes",
    label: <DashboardNavigator>Promo Codes</DashboardNavigator>,
    icon: <Iconify icon={ICONS.promo_codes} width={25} collapsed={collapsed} />,
  },
  {
    key: "/sport-types",
    label: <DashboardNavigator>Sport Types</DashboardNavigator>,
    icon: <Iconify icon={ICONS.sport} width={25} collapsed={collapsed} />,
  },
  {
    key: "/places",
    label: <DashboardNavigator>Places</DashboardNavigator>,
    icon: <Iconify icon={ICONS.place} width={25} collapsed={collapsed} />,
  },
  {
    key: "/payment-methods",
    label: <DashboardNavigator>Payment Methods</DashboardNavigator>,
    icon: <Iconify icon={ICONS.payment_method} width={25} collapsed={collapsed} />,
  },
];

export default function DashboardContainer({ children, user, lang }: Props) {
  return (
    <DashboardLayout getDashboardItems={getDashboardItems} user={user} lang={lang}>
      {children}
    </DashboardLayout>
  );
}
