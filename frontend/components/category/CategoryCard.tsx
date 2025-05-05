import { Telescope, Code, Megaphone, Atom } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface Category {
  name: string;
  courseCount: number;
  icon: React.ReactNode;
}

interface CategoryCardProps {
  categories: Category[];
  className?: string;
}

export function CategoryCard({ categories, className }: CategoryCardProps) {
  return (
    <div className={cn("p-6", className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Top Categories</h2>
        <Link href="/categories">
          <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
            See All
          </span>
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors duration-200"
          >
            {/* Icon */}
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
              {category.icon}
            </div>

            {/* Category Info */}
            <div>
              <h3 className="text-base font-medium text-gray-800">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {category.courseCount} courses
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
