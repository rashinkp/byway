"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/category/useCategories";
import { CategoryList } from "@/components/category/CategoryList";
import { Pagination } from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import ErrorDisplay from "@/components/ErrorDisplay";
import KnowledgePluseBanner from "@/components/banners/KnowledgePluseBanner";

export default function CategoriesPage() {
	const router = useRouter(); 
	const [page, setPage] = useState(1);
	const limit = 9;
       
	const { data, isLoading, error } = useCategories({
		page,
		limit,
	});

	const handleCategoryClick = (categoryId: string) => {
		router.push(`/courses?category=${categoryId}`);
	};

	if (error) {
		return (
			<div className="text-center py-10">
				<ErrorDisplay
					error={error}
					title="Category Error"
					description="There was a problem loading categories. Please try again."
					compact
				/>
			</div>
		);
	}

	return (
		<div className="bg-[var(--color-background)] py-10 ">
			<KnowledgePluseBanner
				title="Browse Categories"
				subtitle="EXPLORE"
				description="Discover a wide range of learning categories to find courses that match your interests and goals."
				hideImage={true}
				className="mx-auto max-w-7xl w-full"
			/>
			<div className="container mx-auto py-8 max-w-5xl px-4">
				<CategoryList
					categories={data?.items || []}
					isLoading={isLoading}
					onCategoryClick={handleCategoryClick}
				/>

				<div className="mt-16 flex justify-center">
					<Pagination
						currentPage={page}
						totalPages={data?.totalPages || 1}
						onPageChange={setPage}
					/>
				</div>
			</div>
		</div>
	);
}
