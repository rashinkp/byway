import React from "react";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { EmptyStateFallback } from "@/components/common/EmptyStateFallback";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
	id: string;
	name: string;
	description?: string;
}

interface CategoriesSectionProps {
	categories: Category[];
	isLoading?: boolean;
	onCategoryClick?: (categoryId: string) => void;
	className?: string;
}

export function CategoriesSection({
	categories,
	isLoading,
	onCategoryClick,
	className,
}: CategoriesSectionProps) {
	const router = useRouter();

	// Show loading skeleton if loading
	if (isLoading) {
		return (
			<section className={className || ""}>
				<div className="mb-4">
					<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--color-primary-dark)]">
						<span className="text-[#facc15] dark:text-[#facc15]">Explore & Find</span> the perfect category to guide
						<br className="hidden sm:block" /> your learning journey.
					</h2>
				</div>
				<div className="flex justify-end mb-4">
					<Button
						variant="link"
						size="default"
						onClick={() => router.push("/categories")}
					>
						See More
					</Button>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{Array.from({ length: 4 }).map((_, index) => (
						<Skeleton key={index} className="h-32 w-full rounded-2xl" />
					))}
				</div>
			</section>
		);
	}

	// Show fallback if not loading and no categories
	if (!isLoading && (!categories || categories.length === 0)) {
		return (
			<section className={className || ""}>
				<div className="mb-4">
					<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--color-primary-dark)]">
						<span className="text-[#facc15] dark:text-[#facc15]">Explore & Find</span> the perfect category to guide
						<br className="hidden sm:block" /> your learning journey.
					</h2>
				</div>
				<EmptyStateFallback
					type="categories"
					onAction={() => router.push("/categories")}
				/>
			</section>
		);
	}

	return (
		<section className={className || ""}>
			<div className="mb-4">
				<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--color-primary-dark)]">
					<span className="text-[#facc15] dark:text-[#facc15]">Explore & Find</span> the perfect category to guide
					<br className="hidden sm:block" /> your learning journey.
				</h2>
			</div>
			<div className="flex justify-end mb-4">
				<Button
					variant="link"
					size="default"
					onClick={() => router.push("/categories")}
				>
					See More
				</Button>
			</div>
			<CategoryCard
				categories={categories}
				className="mb-0"
				onCategoryClick={onCategoryClick}
			/>
		</section>
	);
}
