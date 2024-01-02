"use client";

import DashboardLayout from "@/components/DashboardLayout";
import DashboardNavigator from "@/components/DashboardNavigator";
import Iconify from "@/components/Iconify";
import { ICONS } from "@/lib/constants";
import { type User } from "@/server/api/routers/user";
import { type Lang } from "@/types";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  user: User;
  lang: Lang;
};

export default function DashboardContainer({ children, user, lang }: Props) {
  const [collapsed, setCollapsed] = useState(true);

  const items: ItemType<MenuItemType>[] = [
    {
      title: "",
      key: "/",
      label: <DashboardNavigator>Home</DashboardNavigator>,
      icon: <Iconify icon={ICONS.home} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/visitors",
      label: <DashboardNavigator>Visitors</DashboardNavigator>,
      icon: <Iconify icon={ICONS.visitor} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/trainers",
      label: <DashboardNavigator>Trainers</DashboardNavigator>,
      icon: <Iconify icon={ICONS.trainer} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/packages",
      label: <DashboardNavigator>Packages</DashboardNavigator>,
      icon: <Iconify icon={ICONS.package} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/products",
      label: <DashboardNavigator>Products</DashboardNavigator>,
      icon: <Iconify icon={ICONS.product} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/transactions",
      label: <DashboardNavigator>Transactions</DashboardNavigator>,
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
      title: "",
      key: "/visits",
      label: <DashboardNavigator>Visits</DashboardNavigator>,
      icon: <Iconify icon={ICONS.visit} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/schedules",
      label: <DashboardNavigator>Schedules</DashboardNavigator>,
      icon: <Iconify icon={ICONS.schedule} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/promo-codes",
      label: <DashboardNavigator>Promo Codes</DashboardNavigator>,
      icon: <Iconify icon={ICONS.promo_codes} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/sport-types",
      label: <DashboardNavigator>Sport Types</DashboardNavigator>,
      icon: <Iconify icon={ICONS.sport} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/places",
      label: <DashboardNavigator>Places</DashboardNavigator>,
      icon: <Iconify icon={ICONS.place} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/payment-methods",
      label: <DashboardNavigator>Payment Methods</DashboardNavigator>,
      icon: <Iconify icon={ICONS.payment_method} width={25} collapsed={collapsed} />,
    },
  ];

  return (
    <DashboardLayout items={items} user={user} lang={lang} collapsed={collapsed} setCollapsed={setCollapsed}>
      {children}
    </DashboardLayout>
  );
}
