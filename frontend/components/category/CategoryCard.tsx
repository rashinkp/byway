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

export function CategoryCard({ categories, className, onCategoryClick, wide = false }: CategoryCardProps) {
  return (
    <div className={cn(className)}>
      <div className={wide
        ? "grid grid-cols-1 gap-8"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      }>
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategoryClick?.(category.id)}
            className={cn(
              "group flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.04] transition-all duration-200 cursor-pointer relative overflow-hidden ",
              wide
                ? "bg-[var(--color-surface)] p-8 min-h-[180px] min-w-[320px] w-full"
                : "bg-[var(--color-surface)] p-6 min-h-[140px]"
            )}
          >
            {/* Category Name */}
            <h2
              className="text-xl font-bold mb-1 line-clamp-1"
              style={{ color: "var(--color-primary-dark)" }}
            >
              {category.name}
            </h2>
            {/* Category Description */}
            {category.description && (
              <p
                className="text-sm text-center opacity-90 mt-1 line-clamp-2"
                style={{ color: "var(--color-muted)" }}
              >
                {category.description}
              </p>
            )}
            {/* Decorative Blur/Glass Effect */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl blur-lg z-0"
              style={{ background: "rgba(232,246,243,0.3)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
