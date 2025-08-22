"use client";
import Image, { StaticImageData } from "next/image";
import { useSignedUrl } from "@/hooks/file/useSignedUrl";

interface ImageSectionProps {
  src: string | StaticImageData;
  alt: string;
}

export const ImageSection = ({
  src,
  alt,
}: ImageSectionProps) => {
  // If src is a string and not a URL or local path, treat it as an S3 key and get a signed URL
  const isStringSrc = typeof src === "string";
  const isHttpUrl = (value?: string) => !!value && /^(https?:)?\/\//.test(value);
  const isLocalPath = (value?: string) => !!value && value.startsWith("/");
  const shouldSign = isStringSrc && !isHttpUrl(src as string) && !isLocalPath(src as string);
  const { url: signedUrl } = useSignedUrl(shouldSign ? (src as string) : null);

  // Pick best display source in order: signed URL → direct URL/static image → placeholder
  const displaySrc =
    signedUrl ||
    (!isStringSrc ? (src as StaticImageData).src : (isHttpUrl(src) || isLocalPath(src) ? (src as string) : "/placeHolder.jpg"));

  return (
    <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-[var(--color-primary-light)]/20">
      <Image src={displaySrc} alt={alt} width={400} height={300} className="object-cover w-full h-full" />
    </div>
  );
};
