"use client";

import { type MenuProps } from "antd";
import { type User } from "@/server/api/routers/user";

import DashboardLayout from "@/components/DashboardLayout";
import Iconify from "@/components/Iconify";
import DashboardNavigator from "@/components/DashboardNavigator";
import { ICONS } from "@/lib/constants";

type MenuItem = Required<MenuProps>["items"][number];

type Props = {
  children: React.ReactNode;
  user: User;
};

const getDashboardItems = (collapsed: boolean): MenuItem[] => [
  {
    key: "/",
    label: (
      <DashboardNavigator href="/" role="OWNER">
        Home
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.home} width={25} collapsed={collapsed} />,
  },
  {
    key: "/visitors",
    label: (
      <DashboardNavigator href="/visitors" role="OWNER">
        Visitors
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.visitor} width={25} collapsed={collapsed} />,
  },
  {
    key: "/trainers",
    label: (
      <DashboardNavigator href="/trainers" role="OWNER">
        Trainers
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.trainer} width={25} collapsed={collapsed} />,
  },
  {
    key: "/packages",
    label: (
      <DashboardNavigator href="/packages" role="OWNER">
        Packages
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.package} width={25} collapsed={collapsed} />,
  },
  {
    key: "/products",
    label: (
      <DashboardNavigator href="/products" role="OWNER">
        Products
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.product} width={25} collapsed={collapsed} />,
  },
  {
    key: "/transactions",
    label: <p className="select-none font-medium">Transactions</p>,
    icon: <Iconify icon={ICONS.transaction} width={25} collapsed={collapsed} />,
    children: [
      {
        key: "/transactions/packages",
        label: (
          <DashboardNavigator isChildren href="/transactions/packages" role="OWNER">
            Packages
          </DashboardNavigator>
        ),
      },
      {
        key: "/transactions/products",
        label: (
          <DashboardNavigator isChildren href="/transactions/products" role="OWNER">
            Products
          </DashboardNavigator>
        ),
      },
    ],
  },
  {
    key: "/visits",
    label: (
      <DashboardNavigator href="/visits" role="OWNER">
        Visits
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.visit} width={25} collapsed={collapsed} />,
  },
  {
    key: "/schedules",
    label: (
      <DashboardNavigator href="/schedules" role="OWNER">
        Schedules
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.schedule} width={25} collapsed={collapsed} />,
  },
  {
    key: "/promo-codes",
    label: (
      <DashboardNavigator href="/promo-codes" role="OWNER">
        Promo Codes
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.promo_codes} width={25} collapsed={collapsed} />,
  },
  {
    key: "/sport-types",
    label: (
      <DashboardNavigator href="/sport-types" role="OWNER">
        Sport Types
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.sport} width={25} collapsed={collapsed} />,
  },
  {
    key: "/places",
    label: (
      <DashboardNavigator href="/places" role="OWNER">
        Places
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.place} width={25} collapsed={collapsed} />,
  },
  {
    key: "/payment-methods",
    label: (
      <DashboardNavigator href="/payment-methods" role="OWNER">
        Payment Methods
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.payment_method} width={25} collapsed={collapsed} />,
  },
];

export default function DashboardOwnerContainer({ children, user }: Props) {
  return (
    <DashboardLayout getDashboardItems={getDashboardItems} user={user}>
      {children}
    </DashboardLayout>
  );
}
