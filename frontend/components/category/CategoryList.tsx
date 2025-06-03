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

interface CategoryListProps {
  categories: Category[];
  isLoading?: boolean;
}

export function CategoryList({
  categories,
  isLoading,
}: CategoryListProps) {
  if (isLoading) {
    return <CategoryListSkeleton />;
  }

  if (!categories.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No categories found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card key={category.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold truncate">
              {category.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Created {formatDate(category.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-2">
              {category.description || "No description available"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 