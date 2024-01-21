import Iconify from "@/components/Iconify";
import Img from "@/components/Img";
import { useZustand } from "@/global/store";
import { GENDERS, ICONS, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { type User } from "@/server/api/routers/user";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment } from "react";
import ModalChangePassword from "./ModalChangePassword";

type Props = {
  user: User;
};

export default function DashboardProfileDropdown({ user }: Props) {
  const { lang } = useZustand();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams);

  const redirect = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT({ role: user.role, lang, href: "" }), newParams));
  };

  const DROPDOWN_OPTIONS = [
    { label: "Sign Out", icon: ICONS.signout, onClick: () => signOut() },
    {
      label: "Change Password",
      icon: ICONS.change,
      onClick: () => {
        newParams.set("userId", user.id);
        redirect(newParams);
      },
    },
  ];

  return (
    <Fragment>
      <ModalChangePassword
        show={!!searchParams.get("userId")}
        closeModal={() => {
          newParams.delete("userId");
          redirect(newParams);
        }}
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
          <Menu.Items className="active:outline-none focus:outline-none outline-none absolute right-0 w-48 p-1 mt-4 rounded-md origin-top-right bg-dark shadow-lg">
            {DROPDOWN_OPTIONS.map((e) => {
              return (
                <Menu.Item key={e.icon}>
                  <button
                    onClick={e.onClick}
                    type="button"
                    className="flex justify-end items-center px-2 font-medium gap-2 py-1 w-full text-sm rounded-md hover:bg-orange text-cream"
                  >
                    {e.label}
                    <Iconify width={22} icon={e.icon} />
                  </button>
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Transition>
      </Menu>
    </Fragment>
  );
}
