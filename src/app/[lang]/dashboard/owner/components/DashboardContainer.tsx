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
      label: (
        <DashboardNavigator href="/" role="OWNER" lang={lang}>
          Home
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.home} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/visitors",
      label: (
        <DashboardNavigator href="/visitors" role="OWNER" lang={lang}>
          Visitors
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.visitor} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/trainers",
      label: (
        <DashboardNavigator href="/trainers" role="OWNER" lang={lang}>
          Trainers
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.trainer} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/packages",
      label: (
        <DashboardNavigator href="/packages" role="OWNER" lang={lang}>
          Packages
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.package} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/products",
      label: (
        <DashboardNavigator href="/products" role="OWNER" lang={lang}>
          Products
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.product} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/transactions",
      label: <p className="select-none font-medium">Transactions</p>,
      icon: <Iconify icon={ICONS.transaction} width={25} collapsed={collapsed} />,
      children: [
        {
          key: "/transactions/packages",
          label: (
            <DashboardNavigator isChildren href="/transactions/packages" role="OWNER" lang={lang}>
              Packages
            </DashboardNavigator>
          ),
        },
        {
          key: "/transactions/products",
          label: (
            <DashboardNavigator isChildren href="/transactions/products" role="OWNER" lang={lang}>
              Products
            </DashboardNavigator>
          ),
        },
      ],
    },
    {
      title: "",
      key: "/visits",
      label: (
        <DashboardNavigator href="/visits" role="OWNER" lang={lang}>
          Visits
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.visit} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/schedules",
      label: (
        <DashboardNavigator href="/schedules" role="OWNER" lang={lang}>
          Schedules
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.schedule} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/promo-codes",
      label: (
        <DashboardNavigator href="/promo-codes" role="OWNER" lang={lang}>
          Promo Codes
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.promo_codes} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/sport-types",
      label: (
        <DashboardNavigator href="/sport-types" role="OWNER" lang={lang}>
          Sport Types
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.sport} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/places",
      label: (
        <DashboardNavigator href="/places" role="OWNER" lang={lang}>
          Places
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.place} width={25} collapsed={collapsed} />,
    },
    {
      title: "",
      key: "/payment-methods",
      label: (
        <DashboardNavigator href="/payment-methods" role="OWNER" lang={lang}>
          Payment Methods
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.payment_method} width={25} collapsed={collapsed} />,
    },
  ];

  return (
    <DashboardLayout items={items} user={user} lang={lang} collapsed={collapsed} setCollapsed={setCollapsed}>
      {children}
    </DashboardLayout>
  );
}
