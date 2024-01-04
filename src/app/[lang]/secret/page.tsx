import { api } from "@/trpc/server";

export default async function page() {
  await api.user.create.mutate({
    email: "owner@hiddengym-id.com",
    fullName: "Ryan Pratama",
    credential: "hiddengym-id@2023",
    phoneNumber: "81210425333",
    birthDate: "2000-07-14",
    gender: "MALE",
  });

  return <div>page</div>;
}
