import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import NavigatorX from "@/components/NavigatorX";
import { COUNTRY_CODE, GENDERS } from "@/lib/constants";
import { formatDateLong, formatName, localizePhoneNumber } from "@/lib/functions";
import type { Lang } from "@/types";
import type { UserDetail } from "@router/user";
import { Fragment } from "react";

type Props = { user: UserDetail; setIsEdit: React.Dispatch<React.SetStateAction<boolean>>; lang: Lang };

export default function Profile({ user, setIsEdit, lang }: Props) {
  return (
    <Fragment>
      <section className="flex flex-col gap-1">
        <section className="flex justify-between items-center gap-2">
          <h6>{user?.fullName}</h6>
          <Button onClick={() => setIsEdit(true)} color="expired" size="l">
            Edit
          </Button>
        </section>
        <p>
          <span className="bg-orange font-semibold py-0.5 px-2 text-cream w-fit shadow mr-1">{formatName(user.role)}</span> of Hidden
          Gym
        </p>
      </section>
      {/* information after name and role */}
      <section className="flex flex-col gap-3">
        <section className="flex flex-col">
          <p className="label">Email</p>
          {user?.email ? (
            <NavigatorX newTab href={`mailto:${user?.email}`} className="hover:underline">
              {user?.email}
            </NavigatorX>
          ) : (
            <p>-</p>
          )}
        </section>
        <section className="flex flex-col">
          <p className="label">Phone Number</p>
          <NavigatorX newTab href={`tel:${COUNTRY_CODE}${user.phoneNumber}`} className="hover:underline">
            {localizePhoneNumber(user?.phoneNumber)}
          </NavigatorX>
        </section>

        <section className="flex flex-col">
          <p className="label">Gender</p>
          <section className="flex gap-1 items-center">
            <Iconify width={25} icon={GENDERS[user.gender].icon} color={GENDERS[user.gender].color} />
            <p>{formatName(user?.gender)}</p>
          </section>
        </section>
        <section className="flex flex-col">
          <p className="label">Date of Birth</p>
          <p>{user?.birthDate ? formatDateLong({ date: user?.birthDate, lang }) : "-"}</p>
        </section>
      </section>
    </Fragment>
  );
}
