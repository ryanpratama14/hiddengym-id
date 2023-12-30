import { cn } from "@/lib/functions";
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type Props = {
  src: string | StaticImport;
  alt: string;
  className?: string;
};

export default function Img({ className, src, alt }: Props) {
  return <Image priority={true} src={src} className={cn(className)} width={1000} height={1000} alt={`Hidden Gym - ${alt}`} />;
}
