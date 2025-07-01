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
}

export function CategoryCard({ categories, className, onCategoryClick }: CategoryCardProps) {
  return (
    <div className={cn(className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategoryClick?.(category.id)}
            className="group bg-[var(--color-background)] flex flex-col items-center justify-center gap-2 p-6 rounded-2xl  backdrop-blur-md shadow-lg hover:shadow-2xl hover:scale-[1.04] transition-all duration-200 cursor-pointer relative overflow-hidden"
            style={{ minHeight: 140 }}
          >
            {/* Category Name */}
            <h2 className="text-xl font-bold mb-1 line-clamp-1 text-[var(--color-primary-dark)]">
              {category.name}
            </h2>
            {/* Category Description */}
            {category.description && (
              <p className="text-sm text-center text-[var(--color-primary-light)] opacity-90 mt-1 line-clamp-2">
                {category.description}
              </p>
            )}
            {/* Decorative Blur/Glass Effect */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl bg-white/30 opacity-60 blur-lg z-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
