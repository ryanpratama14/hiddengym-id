import DashboardMenu from "@/components/DashboardMenu";
import DashboardNavigator from "@/components/DashboardNavigator";
import Iconify from "@/components/Iconify";
import { ICONS, USER_PATHNAMES } from "@/lib/constants";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type Lang } from "@/types";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";
import { redirect } from "next/navigation";

const items: ItemType<MenuItemType>[] = [
  {
    title: "",
    key: "/",
    label: (
      <DashboardNavigator href="/" role="OWNER">
        Home
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.home} width={25} />,
  },
  {
    title: "",
    key: "/transactions",
    label: <p className="select-none font-medium">Transactions</p>,
    icon: <Iconify icon={ICONS.transaction} width={25} />,
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
    title: "",
    key: "/visitors",
    label: (
      <DashboardNavigator href="/visitors" role="OWNER">
        Visitors
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.visitor} width={25} />,
  },
  {
    title: "",
    key: "/trainers",
    label: (
      <DashboardNavigator href="/trainers" role="OWNER">
        Trainers
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.trainer} width={25} />,
  },
  {
    title: "",
    key: "/packages",
    label: (
      <DashboardNavigator href="/packages" role="OWNER">
        Packages
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.package} width={25} />,
  },
  {
    title: "",
    key: "/products",
    label: (
      <DashboardNavigator href="/products" role="OWNER">
        Products
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.product} width={25} />,
  },
  {
    title: "",
    key: "/visits",
    label: (
      <DashboardNavigator href="/visits" role="OWNER">
        Visits
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.visit} width={25} />,
  },
  {
    title: "",
    key: "/schedules",
    label: (
      <DashboardNavigator href="/schedules" role="OWNER">
        Schedules
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.schedule} width={25} />,
  },
  {
    title: "",
    key: "/promo-codes",
    label: (
      <DashboardNavigator href="/promo-codes" role="OWNER">
        Promo Codes
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.promo_codes} width={25} />,
  },
  {
    title: "",
    key: "/sport-types",
    label: (
      <DashboardNavigator href="/sport-types" role="OWNER">
        Sport Types
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.sport} width={25} />,
  },
  {
    title: "",
    key: "/places",
    label: (
      <DashboardNavigator href="/places" role="OWNER">
        Places
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.place} width={25} />,
  },
  {
    title: "",
    key: "/payment-methods",
    label: (
      <DashboardNavigator href="/payment-methods" role="OWNER">
        Payment Methods
      </DashboardNavigator>
    ),
    icon: <Iconify icon={ICONS.payment_method} width={25} />,
  },
];

console.log("HITTED");

type Props = { children: React.ReactNode; params: { lang: Lang } };

export default async function DashboardOwnerLayout({ children, params }: Props) {
  const session = await getServerAuthSession();
  const role = "OWNER";
  if (!session || !session.user || session.user.role !== role) redirect(`/${params.lang}/signin/?callbackUrl=${USER_PATHNAMES[role]}`);
  const user = await api.user.detailMe.query();

  return (
    <DashboardMenu items={items} lang={params.lang} user={user}>
      {children}
    </DashboardMenu>
  );
}
