import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import { useZustand } from "@/global/store";
import { GENDERS, ICONS, PROFILE_BUTTON_ITEMS_TO_REMOVE, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { type User } from "@/server/api/routers/user";
import { COLORS } from "@/styles/theme";
import type { ProfileButtonKey } from "@/types";
import { Menu, Transition } from "@headlessui/react";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import type { Role } from "@prisma/client";
import { Menu as AntdMenu, ConfigProvider } from "antd";
import type { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment } from "react";
import ModalChangePassword from "./ModalChangePassword";

type Props = { user: User };

export default function DashboardProfileDropdown({ user }: Props) {
  const { lang } = useZustand();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams);

  const redirect = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT({ role: user.role, lang, href: "" }), newParams));
  };

  const PROFILE_BUTTON_ITEMS: { label: string; key: ProfileButtonKey; icon: IconifyIcon | string; onClick: () => void }[] = [
    {
      label: "Sign Out",
      key: "sign-out",
      icon: ICONS.signout,
      onClick: () => {
        signOut().catch((err) => console.error(err));
      },
    },
    {
      label: "Change Password",
      key: "change-password",
      icon: ICONS.change,
      onClick: () => {
        newParams.set("userId", user.id);
        redirect(newParams);
      },
    },
  ];

  const FILTERED_PROFILE_BUTTON_ITEMS = (role: Role) =>
    PROFILE_BUTTON_ITEMS.filter((btn) => !PROFILE_BUTTON_ITEMS_TO_REMOVE[role].includes(btn.key));

  const items: ItemType<MenuItemType>[] = FILTERED_PROFILE_BUTTON_ITEMS(user.role).map((e, index) => ({
    title: "",
    key: index,
    icon: <Iconify icon={e.icon} width={20} />,
    label: (
      <button onClick={e.onClick} type="button" className="font-medium text-sm w-full h-full text-left">
        {e.label}
      </button>
    ),
  }));

  return (
    <Fragment>
      <ModalChangePassword
        show={!!searchParams.get("userId")}
        closeModal={() => {
          newParams.delete("userId");
          redirect(newParams);
        }}
      />
      <ConfigProvider theme={{ components: { Menu: { itemHeight: 30, itemHoverBg: COLORS.orange, itemBorderRadius: 6 } } }}>
        <Menu as="article" className="relative">
          <Menu.Button className="size-10 bg-cream rounded-full relative shadow border-2 border-cream">
            <section>
              {user?.image?.url ? (
                <Img
                  src={user.image.url}
                  alt="Profile Picture"
                  className="absolute centered object-cover w-full h-full rounded-full"
                />
              ) : (
                <Iconify icon={GENDERS[user.gender].picture} className="absolute centered text-dark" width={35} />
              )}
            </section>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition duration-300"
            enterFrom="transform -translate-y-2 opacity-0"
            enterTo="transform opacity-100 scale-100"
            leave="transition duration-300"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform -translate-y-2 opacity-0"
          >
            <Menu.Items className="active:outline-none focus:outline-none outline-none absolute right-0 mt-4 rounded-md origin-top-right bg-dark shadow-lg">
              <Menu.Item>
                <AntdMenu inlineIndent={14} color={COLORS.dark} mode="inline" items={items} style={{ borderRadius: 6 }} />
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </ConfigProvider>
    </Fragment>
  );
}
