"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/category/useCategories";
import { CategoryList } from "@/components/category/CategoryList";
import { Pagination } from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<"All" | "Active" | "Inactive">("All");
  const limit = 9;

  const { data, isLoading, error } = useCategories({
    page,
    limit,
    search,
    filterBy,
  });

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/courses?category=${categoryId}`);
  };

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
      </div>

      <CategoryList
        categories={data?.items || []}
        isLoading={isLoading}
        onCategoryClick={handleCategoryClick}
      />

      {data && data.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
} 