"use client";
import Image, { StaticImageData } from "next/image";

interface ImageSectionProps {
	src: string | StaticImageData;
	alt: string;
}

export const ImageSection = ({ src, alt }: ImageSectionProps) => {
	return (
		<div className="relative w-48 h-48 rounded-lg overflow-hidden border border-[var(--color-primary-light)]/20">
			<Image
				src={typeof src === "string" ? src : (src as StaticImageData).src}
				alt={alt}
				className="object-cover w-full h-full"
				width={192}
				height={192}
			/>
		</div>
	);
};
