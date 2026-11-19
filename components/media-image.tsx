import Image from "next/image";

export function MediaImage({ src, alt, sizes = "100vw", eager = false }: {
  src: string; alt: string; sizes?: string; eager?: boolean;
}) {
  return <Image src={src} alt={alt} fill unoptimized sizes={sizes} loading={eager ? "eager" : "lazy"}
    fetchPriority={eager ? "high" : "auto"} />;
}
