import { cn } from "@/utils/cn";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useRef } from "react";
import { CourseCard } from "@/components/course/CourseCard";

interface TopCoursesProps {
	courses: Course[];
	className?: string;
	variant?: "default" | "compact" | "sidebar";
	router: any;
}

export function TopCourses({
	courses,
	className,
}: TopCoursesProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState<"left" | "right" | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const visibleCourses = courses.slice(currentIndex, currentIndex + 4);
	const isNavDisabled = courses.length <= 4;
	const canGoLeft = !isNavDisabled && currentIndex > 0;
	const canGoRight = !isNavDisabled && currentIndex + 4 < courses.length;

	const handleSlide = (dir: "left" | "right") => {
		if (isAnimating) return;
		setDirection(dir);
		setIsAnimating(true);
		setTimeout(() => {
			setCurrentIndex((prev) =>
				dir === "right"
					? Math.min(prev + 1, courses.length - 4)
					: Math.max(prev - 1, 0),
			);
			setIsAnimating(false);
		}, 350); // Animation duration
	};

	return (
		<section className={cn("mb-12 px-2 sm:px-0", className)}>
			<div className="mb-16">
				<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--color-primary-dark)]">
					<span className="text-[#facc15] dark:text-[#facc15]">Explore & Find</span> the perfect course to boost <br /> your skills and
					career.
				</h2>
			</div>
			<div className="overflow-hidden relative" style={{ minHeight: 420 }}>
				<div
					ref={containerRef}
					className={
						`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 transition-transform duration-350 ease-in-out ` +
						(isAnimating && direction === "right" ? "animate-slide-left" : "") +
						(isAnimating && direction === "left" ? "animate-slide-right" : "")
					}
				>
					{visibleCourses.map((course) => (
						<CourseCard key={course.id} course={course} />
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
			<div className="flex justify-start gap-3 mt-10">
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
		</section>
	);
}
