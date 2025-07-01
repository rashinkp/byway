import { cn } from "@/utils/cn";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  courseCount: number;
  icon: React.ReactNode;
}

interface CategoryCardProps {
  categories: Category[];
  className?: string;
  onCategoryClick?: (categoryId: string) => void;
}

export function CategoryCard({ categories, className, onCategoryClick }: CategoryCardProps) {
  return (
    <div className={cn(className)}>
      {/* Header removed */}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategoryClick?.(category.id)}
            className="flex items-center gap-4 p-4 rounded-lg border transition-colors duration-200 cursor-pointer bg-[var(--color-surface)] border-[var(--color-primary-light)] hover:bg-[var(--color-background)] shadow-sm"
          >
            {/* Icon */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-primary-light)]">
              {category.icon}
            </div>

            {/* Category Info */}
            <div>
              <h3 className="text-base font-medium text-[var(--color-primary-dark)]">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
