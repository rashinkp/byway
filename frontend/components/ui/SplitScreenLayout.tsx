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
		<div className="flex flex-col bg-[var(--color-surface)] text-[var(--color-foreground)] lg:flex-row min-h-screen">
			{/* Left: Form Section */}
			<div className="w-full lg:w-1/2 flex items-center justify-center mt-12 lg:mt-0">
				{children}
			</div>

			{/* Right: Image Section */}
			<div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-r from-primary to-primary/80">
				<div className="absolute inset-0" />
				<div className="absolute inset-0 flex flex-col justify-center items-center p-8 md:p-12 text-center z-10">
					<div className="bg-[var(--color-primary-light)]/50  rounded-xl p-6 md:p-10 w-full max-w-xl mx-auto">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-surface)] mb-4">
							{title}
						</h2>
						<p className="text-[var(--color-surface)] text-base md:text-lg max-w-md mx-auto">
							{description}
						</p>
					</div>
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
