import type { Metadata } from "next";

"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/category/useCategories";
import { CategoryList } from "@/components/category/CategoryList";
import { Pagination } from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import ErrorDisplay from "@/components/ErrorDisplay";

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
		<div className=" py-10 ">
			<div className="container mx-auto py-8 max-w-5xl px-4">
				<div className="mb-20 text-center">
					<h1 className="text-3xl md:text-4xl font-bold mb-6">Browse Categories</h1>
					<p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto dark:text-[#facc15]">
						Explore a wide range of learning categories on Byway. Find courses that match your interests and goals, and start your learning journey today!
					</p>
				</div>
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
