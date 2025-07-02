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
import { CategoryCard } from "@/components/category/CategoryCard";

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
        <p className="text-[var(--color-muted)]">No categories found</p>
      </div>
    );
  }

  return (
    <CategoryCard categories={categories} onCategoryClick={onCategoryClick} wide={true} />
  );
} 