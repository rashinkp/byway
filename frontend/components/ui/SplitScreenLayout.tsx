"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface SplitScreenLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function SplitScreenLayout({
  children,
  title,
  description,
  imageSrc = "/AuthBanner1.jpg",
  imageAlt = "Illustration",
}: SplitScreenLayoutProps) {
  return (
    <div className="flex flex-col bg-[var(--background)] text-[var(--foreground)] lg:flex-row min-h-screen">
      {/* Left: Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">{children}</div>

      {/* Right: Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col justify-center items-center p-8 md:p-12 text-center z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            {title}
          </h2>
          <p className="text-primary-foreground text-base md:text-lg max-w-md">
            {description}
          </p>
        </div>
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
