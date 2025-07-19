import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const steps = [
	{
		title: "Create your profile",
		description:
			"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
		illustration: (
			<div className="w-full h-36 flex items-center justify-center mb-4">
				<Image
					src="/maponmobile.webp"
					alt="Create profile on mobile"
					width={128}
					height={128}
					className="h-32 w-auto rounded-xl object-contain"
				/>
			</div>
		),
	},
	{
		title: "Search Courses",
		description:
			"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
		illustration: (
			<div className="w-full h-36 flex items-center justify-center mb-4">
				<Image
					src="/searching.webp"
					alt="Searching courses"
					width={128}
					height={128}
					className="h-32 w-auto rounded-xl object-contain"
				/>
			</div>
		),
	},
	{
		title: "Make a Connection",
		description:
			"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
		illustration: (
			<div className="w-full h-36 flex items-center justify-center mb-4">
				<Image
					src="/peoplemakingconnection.webp"
					alt="People making connection"
					width={128}
					height={128}
					className="h-32 w-auto rounded-xl object-contain"
				/>
			</div>
		),
	},
];

export function HowItWorksSection() {
	const router = useRouter();

	// Handler for focusing the header search bar
	const focusHeaderSearchBar = () => {
		if (typeof window !== "undefined") {
			window.dispatchEvent(new CustomEvent("focus-header-search-bar"));
		}
	};

	return (
		<section className="w-full py-16 bg-transparent">
			<div className="max-w-7xl mx-auto px-4">
				<h2 className="text-3xl sm:text-4xl font-bold text-center mb-14">
					How <span className="text-[#facc15] dark:text-[#facc15]">Byway</span>{' '}
					<span className="inline-block relative">
						works
						<svg
							className="absolute -bottom-2 left-0 w-full h-3"
							viewBox="0 0 120 12"
							fill="none"
						>
							<path
								d="M0 10 Q60 0 120 10"
								stroke="#facc15"
								strokeWidth="2"
								fill="none"
							/>
						</svg>
					</span>
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{steps.map((step, idx) => (
						<div
							key={idx}
							className="flex flex-col items-center bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-transparent dark:border-neutral-700"
						>
							{step.illustration}
							<h3 className="text-xl font-semibold text-black dark:text-white mb-2 text-center">
								{step.title}
							</h3>
							<p className="text-sm text-center text-gray-700 dark:text-gray-300 mb-6">
								{step.description}
							</p>
							<Button
								onClick={() => {
									if (idx === 0) router.push("/user/profile");
									else if (idx === 1) focusHeaderSearchBar();
									else if (idx === 2) router.push("/chat");
								}}
							>
								Get Started
							</Button>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
