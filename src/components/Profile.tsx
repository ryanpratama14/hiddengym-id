import { COUNTRY_CODE, GENDERS } from "@/lib/constants";
import { cn, localizePhoneNumber } from "@/lib/functions";
import type { Gender } from "@prisma/client";
import { Skeleton } from "antd";
import Iconify from "./Iconify";
import Img from "./Img";
import NavigatorX from "./NavigatorX";

type Props = {
  fullName: string;
  imageUrl?: string | null;
  gender: Gender;
  email: string | null;
  loading?: boolean;
  phoneNumber: string;
};

export default function Profile({ loading, fullName, imageUrl, gender, email, phoneNumber }: Props) {
  if (loading) return <Skeleton active />;

  return (
    <section className={cn("flex gap-2 items-center", { "gap-3": email })}>
      <section
        className={cn(
          "size-10 bg-cream rounded-full relative shadow border-1 border-dotted border-dark flex items-center justify-center",
          { "size-16": email },
        )}
      >
        {imageUrl ? (
          <Img src={imageUrl} alt={fullName} className="object-cover w-full h-full rounded-full" />
        ) : (
          <Iconify icon={GENDERS[gender]?.picture} className="text-dark" width={email ? 45 : 30} />
        )}
      </section>
      <section className="flex flex-col text-left">
        <p className="font-medium -mb-0.5">{fullName}</p>
        <NavigatorX newTab href={`tel:${COUNTRY_CODE}${phoneNumber}`}>
          <small className="hover:text-blue">{localizePhoneNumber(phoneNumber)}</small>
        </NavigatorX>
        <small>{email}</small>
      </section>
    </section>
  );
}
