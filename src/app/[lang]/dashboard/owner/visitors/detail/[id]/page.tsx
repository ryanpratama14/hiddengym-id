type Props = {
  params: { id: string };
};

export default function VisitorByIdPage({ params }: Props) {
  return <div>{params.id}</div>;
}
