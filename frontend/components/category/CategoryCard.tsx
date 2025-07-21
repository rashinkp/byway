import { cn } from "@/utils/cn";
import React from "react";

interface Category {
	id: string;
	name: string;
	description?: string;
}

interface CategoryCardProps {
	categories: Category[];
	className?: string;
	onCategoryClick?: (categoryId: string) => void;
	wide?: boolean;
}

export function CategoryCard({
	categories,
	className,
	onCategoryClick,
	wide = false,
}: CategoryCardProps) {
	return (
		<div className={cn(className)}>
			<div
				className={
					wide
						? "grid grid-cols-1 gap-8"
						: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
				}
			>
				{categories.map((category) => (
					<div
						key={category.id}
						onClick={() => onCategoryClick?.(category.id)}
						className={cn(
							"group flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.04] hover:ring-2 hover:ring-[#facc15] transition-all duration-200 cursor-pointer relative overflow-hidden bg-white dark:bg-neutral-800 backdrop-blur-md",
							wide
								? "p-8 min-h-[100px] min-w-[320px] w-full"
								: "p-6 min-h-[140px]",
						)}
					>
						{/* Category Name */}
						<h2
							className="text-xl font-bold mb-1 line-clamp-1 "
						>
							{category.name}
						</h2>
						{/* Category Description */}
						{category.description && (
							<p
								className="text-sm text-center opacity-90 mt-1 line-clamp-2 text-neutral-600 dark:text-neutral-300"
							>
								{category.description}
							</p>
						)}
						{/* Decorative Subtle Overlay (no blur) */}
						<div
							className="absolute inset-0 pointer-events-none rounded-2xl z-0 bg-white/10 dark:bg-neutral-900/10"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
