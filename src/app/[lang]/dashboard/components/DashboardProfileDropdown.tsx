import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import ModalConfirm from "@/components/ModalConfirm";
import { GENDERS, ICONS, PROFILE_BUTTON_ITEMS_TO_REMOVE } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { type User } from "@/server/api/routers/user";
import type { NewParamsAction, ProfileButtonKey } from "@/types";
import { Menu, Transition } from "@headlessui/react";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import type { Role } from "@prisma/client";
import { signOut } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment } from "react";
import ModalChangePassword from "./ModalChangePassword";

type Props = { user: User };

export default function DashboardProfileDropdown({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams);

  const redirect = (name: ProfileButtonKey, action: NewParamsAction) => {
    action === "set" ? newParams.set(name, "true") : newParams.delete(name);
    router.push(createUrl(pathname, newParams));
  };

  const PROFILE_BUTTON_ITEMS: { label: string; key: ProfileButtonKey; icon: IconifyIcon | string; onClick: () => void }[] = [
    {
      label: "Sign Out",
      key: "signOut",
      icon: ICONS.signout,
      onClick: () => redirect("signOut", "set"),
    },
    {
      label: "Change Password",
      key: "changePassword",
      icon: ICONS.change,
      onClick: () => redirect("changePassword", "set"),
    },
  ];

  const FILTERED_PROFILE_BUTTON_ITEMS = (role: Role) =>
    PROFILE_BUTTON_ITEMS.filter((btn) => !PROFILE_BUTTON_ITEMS_TO_REMOVE[role].includes(btn.key));

  return (
    <Fragment>
      <ModalChangePassword show={!!searchParams.get("changePassword")} closeModal={() => redirect("changePassword", "delete")} />
      <ModalConfirm
        onConfirm={() => signOut()}
        action="sign out"
        closeModal={() => redirect("signOut", "delete")}
        show={!!searchParams.get("signOut")}
      />

      <Menu as="article" className="relative">
        <Menu.Button className="size-10 bg-cream rounded-full relative shadow border-2 border-cream">
          <section>
            {user?.image?.url ? (
              <Img src={user.image.url} alt="Profile Picture" className="absolute centered object-cover w-full h-full rounded-full" />
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
          <Menu.Items className="flex flex-col w-48 gap-1 active:outline-none focus:outline-none outline-none absolute p-1 right-0 mt-4 rounded-md origin-top-right bg-dark shadow-lg">
            {FILTERED_PROFILE_BUTTON_ITEMS(user.role).map((e) => (
              <Menu.Item key={e.key}>
                <button
                  type="button"
                  onClick={e.onClick}
                  className="flex font-medium gap-2 items-center px-2 bg-dark text-cream hover:bg-orange rounded-md text-sm py-1"
                >
                  <Iconify icon={e.icon} width={20} />
                  {e.label}
                </button>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </Fragment>
  );
}
