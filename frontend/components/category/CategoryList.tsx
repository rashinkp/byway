"use client";

import { Category } from "@/types/category";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryListSkeleton } from "./skeletons/CategoryListSkeleton";
import { formatDate } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryListProps {
  categories: Category[];
  isLoading?: boolean;
  onCategoryClick?: (categoryId: string) => void;
}

export function CategoryList({
  categories,
  isLoading,
  onCategoryClick,
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No categories found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => onCategoryClick?.(category.id)}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {category.name}
          </h3>
          <p className="text-gray-600 text-sm">{category.description}</p>
        </div>
      ))}
    </div>
  );
} 