import React from "react";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
	onCategoryClick,
	className,
}: CategoriesSectionProps) {
	const router = useRouter();
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
