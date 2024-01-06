import Iconify from "@/components/Iconify";
import { DASHBOARD_MENUS_TO_REMOVE, ICONS, MENU_ICON_SIZE } from "@/lib/constants";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type DashboardMenuKey, type Lang } from "@/types";
import { redirect } from "next/navigation";
import DashboardMenu from "./components/DashboardMenu";
import DashboardNavigator from "./components/DashboardNavigator";

type MenuItem = {
  title: string;
  key: DashboardMenuKey;
  label: React.JSX.Element;
  icon?: React.JSX.Element;
  children?: MenuItem[];
};

type Props = { children: React.ReactNode; params: { lang: Lang } };

export default async function DashboardOwnerLayout({ children, params }: Props) {
  const { lang } = params;
  const session = await getServerAuthSession();
  if (!session || !session.user) redirect(`/${params.lang}/signin`);
  const user = await api.user.detailMe.query();
  const role = session.user.role;

  const items: MenuItem[] = [
    {
      title: "",
      key: "/",
      label: (
        <DashboardNavigator href="/" role={role} lang={lang}>
          Home
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.home} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/transactions",
      label: <p className="select-none font-medium">Transactions</p>,
      icon: <Iconify icon={ICONS.transaction} width={MENU_ICON_SIZE} />,
      children: [
        {
          title: "",
          key: "/transactions/packages",
          label: (
            <DashboardNavigator isChildren href="/transactions/packages" role={role} lang={lang}>
              Packages
            </DashboardNavigator>
          ),
        },
        {
          title: "",
          key: "/transactions/products",
          label: (
            <DashboardNavigator isChildren href="/transactions/products" role={role} lang={lang}>
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
        <DashboardNavigator href="/visitors" role={role} lang={lang}>
          Visitors
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.visitor} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/trainers",
      label: (
        <DashboardNavigator href="/trainers" role={role} lang={lang}>
          Trainers
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.trainer} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/packages",
      label: (
        <DashboardNavigator href="/packages" role={role} lang={lang}>
          Packages
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.package} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/products",
      label: (
        <DashboardNavigator href="/products" role={role} lang={lang}>
          Products
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.product} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/visits",
      label: (
        <DashboardNavigator href="/visits" role={role} lang={lang}>
          Visits
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.visit} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/schedules",
      label: (
        <DashboardNavigator href="/schedules" role={role} lang={lang}>
          Schedules
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.schedule} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/promo-codes",
      label: (
        <DashboardNavigator href="/promo-codes" role={role} lang={lang}>
          Promo Codes
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.promo_codes} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/sport-types",
      label: (
        <DashboardNavigator href="/sport-types" role={role} lang={lang}>
          Sport Types
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.sport} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/places",
      label: (
        <DashboardNavigator href="/places" role={role} lang={lang}>
          Places
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.place} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/payment-methods",
      label: (
        <DashboardNavigator href="/payment-methods" role={role} lang={lang}>
          Payment Methods
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.payment_method} width={MENU_ICON_SIZE} />,
    },
  ];

  const filteredItems = items.filter((item) => !DASHBOARD_MENUS_TO_REMOVE[role].includes(item.key));

  return (
    <DashboardMenu items={filteredItems} lang={lang} user={user}>
      {children}
    </DashboardMenu>
  );
}
