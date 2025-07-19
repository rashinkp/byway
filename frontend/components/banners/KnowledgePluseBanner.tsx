import React from "react";
import Image from "next/image";

export default function LearningBanner() {
	return (
		<section className="fixed inset-0 w-screen h-screen z-0 p-0 m-0">
			<Image
				src="/learningBanner1.png"
				alt="Learning Banner"
				fill
				className="object-cover w-full h-full absolute inset-0 z-0 p-0 m-0"
				priority
			/>
			<div className="absolute inset-0 dark:bg-black/80 bg-white/60 z-5" />
		</section>
	);
}
