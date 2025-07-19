import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface SectionGridProps<T> {
	title: React.ReactNode;
	items: T[];
	renderCard: (item: T) => React.ReactNode;
	className?: string;
	showNavigation?: boolean;
}

export function SectionGrid<T>({
	title,
	items,
	renderCard,
	className,
	showNavigation = true,
}: SectionGridProps<T>) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState<"left" | "right" | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const visibleItems = items.slice(currentIndex, currentIndex + 4);
	const isNavDisabled = items.length <= 4;
	const canGoLeft = !isNavDisabled && currentIndex > 0;
	const canGoRight = !isNavDisabled && currentIndex + 4 < items.length;

	const handleSlide = (dir: "left" | "right") => {
		if (isAnimating) return;
		setDirection(dir);
		setIsAnimating(true);
		setTimeout(() => {
			setCurrentIndex((prev) =>
				dir === "right"
					? Math.min(prev + 1, items.length - 4)
					: Math.max(prev - 1, 0),
			);
			setIsAnimating(false);
		}, 350); // Animation duration
	};

	return (
		<section className={cn("mb-12 px-2 sm:px-0", className)}>
			<div className="mb-16">
				<h2 className="text-3xl sm:text-4xl font-bold mb-4 ">
					{title}
				</h2>
			</div>
			<div className="overflow-hidden relative mb-16">
				<div
					ref={containerRef}
					className={
						`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 md:gap-y-10 xl:gap-y-12 transition-transform duration-350 ease-in-out ` +
						(isAnimating && direction === "right" ? "animate-slide-left" : "") +
						(isAnimating && direction === "left" ? "animate-slide-right" : "")
					}
				>
					{visibleItems.map((item, idx) => (
						<div key={idx} className="flex justify-center">
							{renderCard(item)}
						</div>
					))}
				</div>
				{/* Animation keyframes (Tailwind custom) */}
				<style jsx>{`
          .animate-slide-left {
            transform: translateX(-20%);
            opacity: 0.7;
          }
          .animate-slide-right {
            transform: translateX(20%);
            opacity: 0.7;
          }
        `}</style>
			</div>
			{showNavigation && (
				<div className="flex justify-start gap-3">
					<Button
						variant="default"
						onClick={() => handleSlide("left")}
						disabled={!canGoLeft || isAnimating}
					>
						<ChevronLeft className="w-6 h-6" />
					</Button>
					<Button
						variant="default"
						onClick={() => handleSlide("right")}
						disabled={!canGoRight || isAnimating}
					>
						<ChevronRight className="w-6 h-6" />
					</Button>
				</div>
			)}
		</section>
	);
}
