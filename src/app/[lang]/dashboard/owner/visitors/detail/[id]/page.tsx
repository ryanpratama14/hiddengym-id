import { api } from "@/trpc/server";

type Props = {
  params: { id: string };
};

export default async function VisitorByIdPage({ params }: Props) {
  // const data = await api.user.detail.query({ id: params.id });

  const data = await api.user.detail.query({ id: params.id });

  return <div>{params.id}</div>;
}
