import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { signOut } from "next-auth/react";
import { ICONS } from "@/lib/constants";
import Button from "./Button";
import { cn } from "@/lib/utils";
import Img from "./Img";
import Iconify from "./Iconify";
import { type User } from "@/server/api/routers/user";

type Props = {
  user: User;
};

export default function DashboardProfileDropdown({ user }: Props) {
  return (
    <Menu as="section" className="relative">
      <Menu.Button className="w-10 aspect-square bg-cream rounded-full relative shadow border-1 border-dotted border-dark">
        <section>
          {user?.image?.url ? (
            <Img
              src={user.image.url}
              alt="Profile Picture"
              className="absolute centered object-cover w-full h-full rounded-full"
            />
          ) : (
            <Iconify
              icon={user?.gender === "MALE" ? ICONS.male : user ? ICONS.female : ICONS.loading}
              className="absolute centered text-dark"
              width={35}
            />
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
        <Menu.Items className="active:outline-none focus:outline-none outline-none absolute right-0 p-0.5 mt-4 w-36 rounded-md origin-top-right flex flex-col bg-light shadow-lg">
          <Menu.Item>
            <Button
              size="none"
              color="none"
              className={cn("h-9 bg-light hover:bg-orange hover:text-cream text-dark")}
              icon={ICONS.signout}
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
